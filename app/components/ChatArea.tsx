"use client"

import { useState, useRef, useEffect } from "react"
import { Clock, Paperclip, Settings, Send, Loader2 } from "lucide-react"
import ChatMessage from "./ChatMessage"
import PromptSuggestions from "./PromptSuggestions"
import RecommendedPromptsModal from "./RecommendedPromptsModal"
import { streamChatResponse } from "../services/chatApi"
import chatData from "../../mock/chat.json"

interface ChatAreaProps {
  currentSession: string | null
  pendingAction?: { action: string; ticker: string } | null
  onActionProcessed?: () => void
  onSessionUpdate?: (sessionId: string, messages: any[]) => void
}

export default function ChatArea({ currentSession, pendingAction, onActionProcessed, onSessionUpdate }: ChatAreaProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState("")
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [showRecommendedPrompts, setShowRecommendedPrompts] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (currentSession === "new" || currentSession === null) {
      // Clear messages for new chat
      setMessages([])
      setActiveSessionId(null)
    } else if (currentSession && currentSession !== activeSessionId) {
      // Load different session if it's actually different
      const session = chatData.sessions.find((s) => s.id === currentSession)
      if (session) {
        setMessages(session.messages)
        setActiveSessionId(currentSession)
      }
    }
  }, [currentSession])

  useEffect(() => {
    if (pendingAction) {
      const actionMessage = `Show me ${pendingAction.action.toLowerCase()} for ${pendingAction.ticker}`
      handleSendMessage(actionMessage, pendingAction.ticker)
      onActionProcessed?.()
    }
  }, [pendingAction])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingMessage])

  // Listen for recommended prompts modal trigger
  useEffect(() => {
    const handleShowRecommendedPrompts = () => {
      setShowRecommendedPrompts(true)
    }

    window.addEventListener("showRecommendedPrompts", handleShowRecommendedPrompts)
    
    return () => {
      window.removeEventListener("showRecommendedPrompts", handleShowRecommendedPrompts)
    }
  }, [])

  // Save messages to existing session when they change
  useEffect(() => {
    if (messages.length > 0 && activeSessionId) {
      const sessionIndex = chatData.sessions.findIndex(s => s.id === activeSessionId)
      if (sessionIndex !== -1) {
        chatData.sessions[sessionIndex].messages = messages
      }
    }
  }, [messages, activeSessionId])

  const handleSendMessage = async (content: string, ticker?: string) => {
    if (!content.trim()) return

    // Cancel any ongoing streaming
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // If this is a new chat (no active session), create one
    if (!activeSessionId || currentSession === "new") {
      const newSessionId = `session-${Date.now()}`
      const sessionTitle = content.slice(0, 50) + (content.length > 50 ? "..." : "")
      
      // Create new session
      const newSession = {
        id: newSessionId,
        title: sessionTitle,
        timestamp: new Date().toISOString(),
        messages: []
      }
      
      // Add to beginning of sessions array
      chatData.sessions.unshift(newSession)
      setActiveSessionId(newSessionId)
      
      // Notify parent component about the new session
      onSessionUpdate?.(newSessionId, [])
    }

    const userMessage = {
      id: `msg-${Date.now()}`,
      type: "user",
      content,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setStreamingMessage("")

    // Create AI message placeholder
    const aiMessageId = `msg-${Date.now()}-ai`
    setCurrentStreamingId(aiMessageId)

    const aiMessage = {
      id: aiMessageId,
      type: "ai",
      content: "",
      timestamp: new Date().toISOString(),
      completed: false,
      hasNews: containsStockSymbol(content),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, aiMessage])

    try {
      abortControllerRef.current = new AbortController()
      let fullResponse = ""

      for await (const chunk of streamChatResponse(content, ticker)) {
        if (abortControllerRef.current?.signal.aborted) {
          break
        }

        fullResponse += chunk
        setStreamingMessage(fullResponse)

        // Update the message in real-time
        setMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, content: fullResponse } : msg)))
      }

      // Finalize the message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: fullResponse,
                completed: true,
                isStreaming: false,
                analysis: generateAnalysisFromResponse(fullResponse, content),
              }
            : msg,
        ),
      )
    } catch (error) {
      console.error("Error streaming response:", error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: "I apologize, but I'm having trouble providing a response right now. Please try again.",
                completed: true,
                isStreaming: false,
              }
            : msg,
        ),
      )
    } finally {
      setIsTyping(false)
      setStreamingMessage("")
      setCurrentStreamingId(null)
      abortControllerRef.current = null
    }
  }

  const containsStockSymbol = (text: string) => {
    const stockSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "QQQ", "SPY"]
    return stockSymbols.some((symbol) => text.toUpperCase().includes(symbol))
  }

  const generateAnalysisFromResponse = (response: string, prompt: string) => {
    const ticker = prompt.match(/\b(AAPL|MSFT|GOOGL|AMZN|TSLA|META|NVDA|QQQ|SPY|[A-Z]{2,5})\b/i)?.[0] || "Market"

    return {
      summary: `Analysis for ${ticker} based on current market conditions`,
      technicalAnalysis: "Comprehensive analysis provided above",
      entryLevel: "See detailed analysis",
      exitLevel: "Refer to analysis above",
      stopLoss: "Risk management included",
    }
  }

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleRecommendedPromptSelect = (prompt: string) => {
    // Close modal and send message
    setShowRecommendedPrompts(false)
    handleSendMessage(prompt)
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-700">
        {messages.length === 0 ? (
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-20  rounded-full flex items-center justify-center mx-auto mb-4">
               <img 
                src="/transparent-logo.png"
                  alt="TradeGPT Logo" 
                  className="w-20 h-15"
                />
            </div>
            <h1 className="text-xl lg:text-2xl font-semibold mb-2">How can I help you today?</h1>
            <p className="text-gray-400 text-sm mb-6">
              Message TradeGPT for free - Get real-time market insights and analysis
            </p>
            <div className="hidden lg:block">
              <PromptSuggestions onPromptClick={handlePromptClick} />
            </div>
          </div>
        ) : null}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isTyping && !currentStreamingId && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-gray-400">Analyzing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 lg:p-6 border-t border-gray-700">
        <div className="bg-gray-800 rounded-lg border border-gray-600 focus-within:border-blue-500">
          <div className="flex items-center p-3 lg:p-4 bg-[#2e2e2e]">
            <input
              type="text"
              placeholder="Message TradeGPT for free..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isTyping && handleSendMessage(inputValue)}
              disabled={isTyping}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 disabled:opacity-50 text-sm lg:text-base"
            />
            <div className="flex items-center gap-2 ml-2 lg:ml-4">
              {/* <button className="p-2 hover:bg-gray-700 rounded-lg" disabled={isTyping}>
                <Paperclip className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
              </button>
              <button
                className="hidden lg:flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] hover:bg-gray-600 rounded-lg text-sm"
                disabled={isTyping}
              >
                <Settings className="w-4 h-4" />
                Customize Response
              </button> */}
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Prompts Modal - Centered in chat area */}
      <RecommendedPromptsModal
        isOpen={showRecommendedPrompts}
        onClose={() => setShowRecommendedPrompts(false)}
        onPromptSelect={handleRecommendedPromptSelect}
      />
    </div>
  )
}