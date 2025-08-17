import httpClient from '@/lib/http';
import type { Message } from '@/types/chat';

interface TypewriterOptions {
  /** 打字速度（毫秒/字符） */
  typingSpeed?: number;
  /** 是否启用打字机效果 */
  enableTypewriter?: boolean;
}

export async function streamChatCompletion(
  messages: Message[],
  onChunk: (chunk: string) => void,
  onError?: (error: Error) => void,
  abortSignal?: AbortSignal,
  typewriterOptions?: TypewriterOptions,
): Promise<void> {
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  // 打字机效果配置
  const { typingSpeed = 30, enableTypewriter = true } = typewriterOptions || {};

  // 打字机效果队列
  let typewriterQueue: string[] = [];
  let isTyping = false;

  // 打字机效果处理函数
  const processTypewriterQueue = async () => {
    if (isTyping || typewriterQueue.length === 0) return;

    isTyping = true;

    while (typewriterQueue.length > 0) {
      // 检查是否被取消
      if (abortSignal?.aborted) {
        typewriterQueue = [];
        break;
      }

      const text = typewriterQueue.shift()!;

      // 逐字符输出
      for (let i = 0; i < text.length; i++) {
        if (abortSignal?.aborted) {
          typewriterQueue = [];
          break;
        }

        const char = text[i];
        onChunk(char);

        // 添加打字延迟
        if (i < text.length - 1) {
          // 最后一个字符不需要延迟
          await new Promise((resolve) => setTimeout(resolve, typingSpeed));
        }
      }
    }

    isTyping = false;
  };

  // 处理内容的函数
  const handleContent = (content: string) => {
    if (!enableTypewriter) {
      onChunk(content);
      return;
    }

    // 添加到打字机队列
    typewriterQueue.push(content);

    // 开始处理队列
    processTypewriterQueue();
  };

  try {
    const token = httpClient.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      'Cache-Control': 'no-cache',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token.access_token}`;
    }

    const response = await fetch('/api/v1/chats:stream', {
      method: 'POST',
      headers,
      body: JSON.stringify({ messages }),
      signal: abortSignal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`,
      );
    }

    if (!response.body) {
      throw new Error('响应体为空，无法获取流数据');
    }

    reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      // Check if request was aborted
      if (abortSignal?.aborted) {
        // 清空打字机队列
        typewriterQueue = [];
        throw new Error('请求已被取消');
      }

      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留最后一行（可能不完整）

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine) continue;

        if (trimmedLine.startsWith('event:')) {
          continue;
        }

        if (trimmedLine.startsWith('data: ')) {
          const data = trimmedLine.slice(6).trim();

          if (!data || data === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(data);

            if (parsed.choices?.[0]?.finish_reason === 'stop') {
              // 等待打字机效果完成
              while (isTyping || typewriterQueue.length > 0) {
                await new Promise((resolve) => setTimeout(resolve, 10));
                if (abortSignal?.aborted) break;
              }
              return;
            }

            const content = parsed.choices?.[0]?.delta?.content;
            if (typeof content === 'string' && content.length > 0) {
              handleContent(content);
            }
          } catch (parseError) {
            console.warn('解析SSE数据失败:', parseError, '原始数据:', data);
            continue;
          }
        }
      }
    }

    // 等待所有打字机效果完成
    while (isTyping || typewriterQueue.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      if (abortSignal?.aborted) break;
    }
  } catch (error) {
    // 清空打字机队列
    typewriterQueue = [];

    if (error instanceof Error && error.name === 'AbortError') {
      console.log('请求已被用户取消');
      return;
    }

    console.error('流式请求失败:', error);

    if (onError) {
      onError(error as Error);
    }

    throw error;
  } finally {
    if (reader) {
      try {
        reader.releaseLock();
      } catch (releaseError) {
        console.warn('释放reader失败:', releaseError);
      }
    }
  }
}

// Legacy function for backward compatibility
export async function streamChatCompletionWithAbort(
  messages: Message[],
  onChunk: (chunk: string) => void,
  abortSignal?: AbortSignal,
  onError?: (error: Error) => void,
  typewriterOptions?: TypewriterOptions,
): Promise<void> {
  return streamChatCompletion(
    messages,
    onChunk,
    onError,
    abortSignal,
    typewriterOptions,
  );
}
