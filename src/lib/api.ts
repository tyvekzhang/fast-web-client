import httpClient from "@/lib/http"
import type { Message } from "@/types/chat"

export async function streamChatCompletion(
  messages: Message[],
  onChunk: (chunk: string) => void,
  onError?: (error: Error) => void,
): Promise<void> {
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

  try {
    const token = httpClient.getToken()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token.access_token}`
    }

    const response = await fetch("/api/v1/chats:stream", {
      method: "POST",
      headers,
      body: JSON.stringify({ messages }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`)
    }

    if (!response.body) {
      throw new Error("响应体为空，无法获取流数据")
    }

    reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() || "" // 保留最后一行（可能不完整）

      for (const line of lines) {
        const trimmedLine = line.trim()

        if (!trimmedLine) continue

        if (trimmedLine.startsWith("event:")) {
          continue
        }

        if (trimmedLine.startsWith("data: ")) {
          const data = trimmedLine.slice(6).trim()

          if (!data || data === "[DONE]") {
            continue
          }

          try {
            const parsed = JSON.parse(data)

            if (parsed.choices?.[0]?.finish_reason === "stop") {
              return
            }

            const content = parsed.choices?.[0]?.delta?.content
            if (typeof content === "string" && content.length > 0) {
              onChunk(content)
            }
          } catch (parseError) {
            console.warn("解析SSE数据失败:", parseError, "原始数据:", data)
            continue
          }
        }
      }
    }
  } catch (error) {
    console.error("流式请求失败:", error)

    if (onError) {
      onError(error as Error)
    }

    throw error
  } finally {
    if (reader) {
      try {
        reader.releaseLock()
      } catch (releaseError) {
        console.warn("释放reader失败:", releaseError)
      }
    }
  }
}

export async function streamChatCompletionWithAbort(
  messages: Message[],
  onChunk: (chunk: string) => void,
  abortSignal?: AbortSignal,
  onError?: (error: Error) => void,
): Promise<void> {
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

  try {
    const token = httpClient.getToken()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token.access_token}`
    }

    const response = await fetch("/api/v1/chats:stream", {
      method: "POST",
      headers,
      body: JSON.stringify({ messages }),
      signal: abortSignal,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`)
    }

    if (!response.body) {
      throw new Error("响应体为空，无法获取流数据")
    }

    reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      if (abortSignal?.aborted) {
        throw new Error("请求已被取消")
      }

      const { done, value } = await reader.read()

      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        const trimmedLine = line.trim()

        if (!trimmedLine || trimmedLine.startsWith("event:")) continue

        if (trimmedLine.startsWith("data: ")) {
          const data = trimmedLine.slice(6).trim()

          if (!data || data === "[DONE]") continue

          try {
            const parsed = JSON.parse(data)

            if (parsed.choices?.[0]?.finish_reason === "stop") {
              return
            }

            const content = parsed.choices?.[0]?.delta?.content
            if (typeof content === "string" && content.length > 0) {
              onChunk(content)
            }
          } catch (parseError) {
            console.warn("解析SSE数据失败:", parseError, "原始数据:", data)
            continue
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("请求已被用户取消")
      return
    }

    console.error("流式请求失败:", error)

    if (onError) {
      onError(error as Error)
    }

    throw error
  } finally {
    if (reader) {
      try {
        reader.releaseLock()
      } catch (releaseError) {
        console.warn("释放reader失败:", releaseError)
      }
    }
  }
}
