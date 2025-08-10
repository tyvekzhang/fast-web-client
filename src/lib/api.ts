import httpClient from '@/lib/http';
import type { Message } from "@/types/chat";

export async function streamChatCompletion(
  messages: Message[],
  onChunk: (chunk: string) => void,
  onError?: (error: Error) => void
): Promise<void> {
  try {
    // 1. 获取 token
    const token = httpClient.getToken();
    
    // 2. 添加 Authorization 头
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token.access_token}`;
    }

    // 3. 发送请求（使用 fetch）
    const response = await fetch("/api/v1/chats:stream", {
      method: "POST",
      headers,
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 4. 处理流式响应（保持不变）
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("无法获取响应流");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            if (data === "[DONE]") {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || "";

              if (content) {
                fullContent += content;
                onChunk(fullContent);
              }
            } catch (e) {
              console.warn("解析SSE数据失败:", e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error("流式请求失败:", error);
    if (onError) onError(error as Error);
    throw error;
  }
}