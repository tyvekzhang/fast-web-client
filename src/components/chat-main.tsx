"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button, Input, Spin, Avatar, message } from "antd"
import {
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  MenuUnfoldOutlined,
  CopyOutlined,
  RedoOutlined,
} from "@ant-design/icons"
import type { Conversation, Message } from "@/types/chat"
import { generateId } from "@/lib/utils"
import { streamChatCompletion } from "@/lib/api"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

const { TextArea } = Input

interface ChatMainProps {
  conversation: Conversation | undefined
  onAddMessage: (conversationId: string, message: Message) => void
  onUpdateMessage: (conversationId: string, messageId: string, content: string) => void
  onCreateConversation: () => void
  collapsed: boolean
  onToggleCollapse: () => void
  isMobile: boolean
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
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const currentConversationId = conversation?.id

    // 如果没有当前对话，创建新对话
    if (!currentConversationId) {
      onCreateConversation()
      // 等待状态更新
      await new Promise((resolve) => setTimeout(resolve, 100))
      return
    }

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    const assistantMessage: Message = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }

    // 添加用户消息
    onAddMessage(currentConversationId, userMessage)

    // 添加空的助手消息
    onAddMessage(currentConversationId, assistantMessage)

    setInput("")
    setIsLoading(true)

    try {
      // 获取对话历史
      const messages = conversation?.messages || []
      const chatHistory = [...messages, userMessage]

      // 调用流式API
      await streamChatCompletion(chatHistory, (chunk) => {
        // 更新助手消息内容
        onUpdateMessage(currentConversationId!, assistantMessage.id, chunk)
      })
    } catch (error) {
      console.error("发送消息失败:", error)
      message.error("发送消息失败，请重试")

      // 更新助手消息为错误信息
      onUpdateMessage(currentConversationId, assistantMessage.id, "抱歉，我遇到了一些问题，请稍后重试。")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      message.success("已复制到剪贴板")
    } catch (error) {
      message.error("复制失败")
    }
  }

  const regenerateResponse = async (messageIndex: number) => {
    if (!conversation || messageIndex < 1) return

    const userMessage = conversation.messages[messageIndex - 1]
    if (userMessage.role !== "user") return

    const assistantMessage = conversation.messages[messageIndex]
    if (assistantMessage.role !== "assistant") return

    setIsLoading(true)

    try {
      // 获取到用户消息为止的历史
      const chatHistory = conversation.messages.slice(0, messageIndex)

      // 重置助手消息内容
      onUpdateMessage(conversation.id, assistantMessage.id, "")

      // 调用流式API重新生成
      await streamChatCompletion(chatHistory, (chunk) => {
        onUpdateMessage(conversation.id, assistantMessage.id, chunk)
      })
    } catch (error) {
      console.error("重新生成失败:", error)
      message.error("重新生成失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">欢迎使用AI助手</h2>
          <p className="text-gray-500 mb-6">开始新的对话，我将竭诚为您服务</p>
          <Button type="primary" size="large" onClick={onCreateConversation}>
            开始对话
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          {(collapsed || isMobile) && (
            <Button type="text" icon={<MenuUnfoldOutlined />} onClick={onToggleCollapse} className="mr-3" />
          )}
          <h2 className="text-lg font-semibold text-gray-800 truncate">{conversation.title}</h2>
        </div>
        <div className="text-sm text-gray-500">{conversation.messages.length} 条消息</div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {conversation.messages.map((msg, index) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && <Avatar icon={<RobotOutlined />} className="bg-blue-500 flex-shrink-0" />}

            <div
              className={`max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-3"
                  : "bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3"
              }`}
            >
              {msg.role === "user" ? (
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "")
                        return !inline && match ? (
                          <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}

              {msg.role === "assistant" && msg.content && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                  <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(msg.content)}>
                    复制
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    icon={<RedoOutlined />}
                    onClick={() => regenerateResponse(index)}
                    loading={isLoading}
                  >
                    重新生成
                  </Button>
                </div>
              )}
            </div>

            {msg.role === "user" && <Avatar icon={<UserOutlined />} className="bg-gray-500 flex-shrink-0" />}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start">
            <Avatar icon={<RobotOutlined />} className="bg-blue-500 flex-shrink-0" />
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <Spin size="small" />
              <span className="ml-2 text-gray-500">正在思考...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <TextArea
                ref={textAreaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息... (Shift+Enter 换行)"
                autoSize={{ minRows: 1, maxRows: 6 }}
                className="resize-none"
              />
            </div>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={isLoading}
              disabled={!input.trim()}
              size="large"
            >
              发送
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">AI助手可能会产生不准确的信息，请谨慎使用。</div>
        </div>
      </div>
    </div>
  )
}
