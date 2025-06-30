const DEEPSEEK_API_KEY = "sk-fd092005f2f446d78dade7662a13c896"

export async function* streamChatResponse(prompt: string, ticker?: string) {
  try {
    const systemPrompt = `You are TradeGPT, a professional market analyst and trading assistant. Provide detailed, actionable trading insights and analysis. Always structure your responses with clear sections like Summary, Technical Analysis, Entry/Exit levels when relevant. Be professional but conversational. ${ticker ? `Focus on ${ticker} stock analysis.` : ""}`

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("No reader available")
    }

    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data === "[DONE]") {
            return
          }

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              yield content
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    console.error("Error streaming chat response:", error)
    yield "I apologize, but I'm having trouble connecting to provide a response right now. Please try again."
  }
}
