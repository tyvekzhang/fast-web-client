'use client';

import { DeepThinkIcon } from '@/assets/icons/deep-think';
import { streamChatCompletion } from '@/lib/api';
import { generateId } from '@/lib/utils';
import type { Conversation, Message } from '@/types/chat';
import { Avatar, Button, Input, message, Spin, Upload } from 'antd';
import { throttle } from 'lodash';
import {
  Bot,
  Copy,
  Globe,
  RotateCw,
  Send,
  UploadIcon,
  User,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { TextArea } = Input;

interface ChatMainProps {
  conversation: Conversation | undefined;
  onAddMessage: (conversationId: string, message: Message) => void;
  onUpdateMessage: (
    conversationId: string,
    messageId: string,
    content: string,
  ) => void;
  onCreateConversation: () => string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
}

export default function ChatMain({
  conversation,
  onAddMessage,
  onUpdateMessage,
  onCreateConversation,
  collapsed,
  onToggleCollapse,
  isMobile,
}: ChatMainProps) {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingContentRef = useRef<string>('');

  const throttledScroll = useCallback(
    throttle(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }, 500),
    [],
  );

  useEffect(() => {
    throttledScroll();
  }, [conversation?.messages, throttledScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleStreamChunk = useCallback(
    (conversationId: string, messageId: string, chunk: string) => {
      streamingContentRef.current += chunk;
      onUpdateMessage(conversationId, messageId, streamingContentRef.current);
    },
    [onUpdateMessage],
  );

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    let currentConversationId = conversation?.id;

    // Create new conversation if none exists
    if (!currentConversationId) {
      currentConversationId = onCreateConversation();
    }

    // Add messages to conversation
    onAddMessage(currentConversationId, userMessage);
    onAddMessage(currentConversationId, assistantMessage);

    setInput('');
    setIsGenerating(true);
    streamingContentRef.current = '';

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const messages = conversation?.messages || [];
      const chatHistory = [...messages, userMessage];

      await streamChatCompletion(
        chatHistory,
        (chunk) =>
          handleStreamChunk(currentConversationId!, assistantMessage.id, chunk),
        (error) => {
          console.error('流式请求错误:', error);
          if (!abortControllerRef.current?.signal.aborted) {
            message.error('发送消息失败，请重试');
            onUpdateMessage(
              currentConversationId!,
              assistantMessage.id,
              '抱歉，我遇到了一些问题，请稍后重试。',
            );
          }
        },
        abortControllerRef.current.signal,
      );
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('发送消息失败:', error);
        message.error('发送消息失败，请重试');
        onUpdateMessage(
          currentConversationId!,
          assistantMessage.id,
          '抱歉，我遇到了一些问题，请稍后重试。',
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
      streamingContentRef.current = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      message.info('已停止生成');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('已复制到剪贴板');
    } catch (error) {
      message.error('复制失败');
    }
  };

  const regenerateResponse = async (messageIndex: number) => {
    if (!conversation || messageIndex < 1 || isGenerating) return;

    const userMessage = conversation.messages[messageIndex - 1];
    if (userMessage.role !== 'user') return;

    const assistantMessage = conversation.messages[messageIndex];
    if (assistantMessage.role !== 'assistant') return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsGenerating(true);
    streamingContentRef.current = '';

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const chatHistory = conversation.messages.slice(0, messageIndex);
      onUpdateMessage(conversation.id, assistantMessage.id, '');

      await streamChatCompletion(
        chatHistory,
        (chunk) =>
          handleStreamChunk(conversation.id, assistantMessage.id, chunk),
        (error) => {
          console.error('重新生成错误:', error);
          if (!abortControllerRef.current?.signal.aborted) {
            message.error('重新生成失败，请重试');
          }
        },
        abortControllerRef.current.signal,
      );
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('重新生成失败:', error);
        message.error('重新生成失败，请重试');
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
      streamingContentRef.current = '';
    }
  };

  const handleDeepThink = async () => {
    message.info('正在进行深度思考...');
  };

  const handleWebSearch = async () => {
    message.info('正在联网搜索...');
  };

  const handleFileUpload = (file: any) => {
    message.info('正在上传文件: ' + file.name);
    return false;
  };

  function onClickBack(): void {
    router.push('/');
  }

  return (
    <div className="h-screen flex flex-col px-2">
      <div className="flex items-center justify-between p-2 border-b border-gray-200  w-full">
        <div className="flex items-center justify-end w-full">
          <Button
            type="link"
            onClick={onClickBack}
            icon={<X className="-mr-0.5" size={16} />}
          >
            关闭
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full p-4 space-y-6">
        {conversation && (
          <>
            {conversation.messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <Avatar
                    icon={<Bot size={16} />}
                    className="bg-blue-500 flex-shrink-0"
                  />
                )}

                <div
                  className={`max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-3'
                      : 'bg-gray-100 rounded-2xl rounded-bl-md px-4 py-1'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          code({ node, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(
                              className || '',
                            );
                            return match ? (
                              <SyntaxHighlighter
                                language={match[1]}
                                style={vscDarkPlus}
                                customStyle={{
                                  margin: 0,
                                  borderRadius: '4px',
                                  fontSize: '14px',
                                }}
                                showLineNumbers={true}
                                wrapLines={true}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  {msg.role === 'assistant' && msg.content && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                      <Button
                        type="text"
                        size="small"
                        icon={<Copy size={14} />}
                        onClick={() => copyToClipboard(msg.content)}
                      >
                        复制
                      </Button>
                      <Button
                        type="text"
                        size="small"
                        icon={<RotateCw size={14} />}
                        onClick={() => regenerateResponse(index)}
                        disabled={isGenerating}
                      >
                        重新生成
                      </Button>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <Avatar
                    icon={<User size={16} />}
                    className="bg-gray-500 flex-shrink-0"
                  />
                )}
              </div>
            ))}

            {isGenerating && (
              <div className="flex gap-4 justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2 mt-4">
                  <Spin size="small" />
                  <span className="text-gray-500">生成中...</span>
                </div>
              </div>
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {conversation && conversation.title !== '新对话' ? (
        <div className="p-4 border-t border-gray-200  min-w-4xl mx-auto">
          <div className="mx-auto">
            <div className="relative">
              <TextArea
                ref={textAreaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入消息... (Shift+Enter 换行)"
                autoSize={{ minRows: 3, maxRows: 6 }}
                className="shadow p-4 resize-none pr-32 rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <div className="absolute left-2 bottom-2 flex gap-2">
                <Button
                  type="text"
                  icon={<DeepThinkIcon size={16} />}
                  onClick={handleDeepThink}
                  disabled={isGenerating}
                  size="small"
                >
                  深度思考
                </Button>
                <Button
                  type="text"
                  icon={<Globe size={16} />}
                  onClick={handleWebSearch}
                  disabled={isGenerating}
                  size="small"
                >
                  联网查询
                </Button>
              </div>
              <div className="absolute right-2 bottom-2 flex gap-2">
                <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                  <Button
                    type="text"
                    icon={<UploadIcon size={16} />}
                    disabled={isGenerating}
                    size="small"
                  />
                </Upload>
                {isGenerating ? (
                  <Button type="default" onClick={handleStop} size="small">
                    停止
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<Send size={16} />}
                    onClick={handleSend}
                    disabled={!input.trim()}
                    size="small"
                  />
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              AI助手可能会产生不准确的信息，请谨慎使用。
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-screen items-center justify-center mx-auto my-auto">
          <div className="text-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-600">
                欢迎使用AI助手
              </h2>
              <p className="text-gray-500 mb-6">
                我是AI助手，擅长数据库相关任务。有什么我可以帮助您的吗？
              </p>
            </div>
            <div className="relative min-w-2xl mx-auto">
              <TextArea
                ref={textAreaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入消息... (Shift+Enter 换行)"
                autoSize={{ minRows: 3, maxRows: 6 }}
                className="shadow p-4 resize-none rounded-lg border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <div className="absolute left-2 bottom-2 flex gap-2">
                <Button
                  type="text"
                  icon={<DeepThinkIcon size={16} />}
                  onClick={handleDeepThink}
                  disabled={isGenerating}
                  size="small"
                >
                  深度思考
                </Button>
                <Button
                  type="text"
                  icon={<Globe size={16} />}
                  onClick={handleWebSearch}
                  disabled={isGenerating}
                  size="small"
                >
                  联网查询
                </Button>
              </div>
              <div className="absolute right-2 bottom-2 flex gap-2">
                <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                  <Button
                    type="text"
                    icon={<UploadIcon size={16} />}
                    disabled={isGenerating}
                    size="small"
                  />
                </Upload>
                <Button
                  type="primary"
                  icon={<Send size={16} />}
                  onClick={handleSend}
                  disabled={!input.trim() || isGenerating}
                  size="small"
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              AI助手可能会产生不准确的信息，请谨慎使用。
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
