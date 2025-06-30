



"use client"

import { CheckCircle, User, Bot, Loader2 } from "lucide-react"
import NewsCard from "./NewsCard"
import newsData from "../../mock/news.json"

interface ChatMessageProps {
  message: {
    id: string
    type: "user" | "ai"
    content: string
    analysis?: {
      summary: string
      technicalAnalysis: string
      entryLevel: string
      exitLevel: string
      stopLoss: string
    }
    timestamp: string
    completed?: boolean
    hasNews?: boolean
    isStreaming?: boolean
  }
}

// Function to render markdown-like formatting
const renderFormattedText = (text: string) => {
  // Split text into lines
  const lines = text.split('\n')
  
  return lines.map((line, index) => {
    // Skip empty lines
    if (line.trim() === '' || line.trim() === '---') {
      return <div key={index} className="h-4"></div>
    }
    
    // Handle headers (### or ##)
    if (line.startsWith('###')) {
      const title = line.replace(/###\s*\*\*(.*?)\*\*/, '$1').replace(/###\s*/, '').replace(/\*\*/g, '')
      return (
        <h3 key={index} className="text-lg font-bold text-white mb-3 mt-4">
          {title}
        </h3>
      )
    }
    
    if (line.startsWith('##')) {
      const title = line.replace(/##\s*\*\*(.*?)\*\*/, '$1').replace(/##\s*/, '').replace(/\*\*/g, '')
      return (
        <h2 key={index} className="text-xl font-bold text-white mb-3 mt-4">
          {title}
        </h2>
      )
    }
    
    // Handle numbered lists (1., 2., 3.)
    if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*\*/g, '')
      return (
        <div key={index} className="mb-2">
          <div className="flex items-start gap-2">
            <span className="text-white font-bold mt-1 text-sm">
              {line.match(/^\d+/)?.[0]}.
            </span>
            <div 
              className="text-gray-100 flex-1"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      )
    }
    
    // Handle bullet points (- or *)
    if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
      const content = line.replace(/^[\s\-\*]+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*\*/g, '')
      return (
        <div key={index} className="mb-2 ml-4">
          <div className="flex items-start gap-2">
            <span className="text-white mt-2 text-xs">•</span>
            <div 
              className="text-gray-100 flex-1"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      )
    }
    
    // Handle regular text with bold formatting
    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*\*/g, '')
    
    return (
      <p 
        key={index} 
        className="text-gray-100 mb-2 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formattedLine }}
      />
    )
  })
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user"

  // Extract ticker from message content for news
  const ticker = message.content.match(/\b(QQQ|SPY|AAPL|TSLA|NVDA)\b/i)?.[0]
  const tickerNews = ticker ? (newsData.news as any)[ticker] : null

  return (
    <div className={`flex gap-4 items-start`}>
      {/* Avatar first for both */}
      <div className={`w-8 h-8 ${isUser ? "bg-gray-600" : "bg-blue-600"} rounded-full flex items-center justify-center flex-shrink-0`}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      <div className={`max-w-3xl`}>
        {isUser ? (
          <div className="text-white rounded-lg px-4 py-3 max-w-md">{message.content}</div>
        ) : (
          <div className="space-y-4">
            {/* AI Response Header */}
            <div className="flex items-center gap-2">
              {message.isStreaming ? (
                <>
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-blue-500 font-medium">Analyzing...</span>
                </>
              ) : message.completed ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">Completed</span>
                </>
              ) : null}
            </div>

            {/* Main Response */}
            <div className="rounded-lg p-4">
              <div className="prose prose-invert max-w-none">
                {message.isStreaming ? (
                  <div className="text-gray-100">
                    {renderFormattedText(message.content)}
                    <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse"></span>
                  </div>
                ) : (
                  renderFormattedText(message.content)
                )}
              </div>

              {message.analysis && !message.isStreaming && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Entry Level</div>
                      <div className="font-semibold text-green-400">{message.analysis.entryLevel}</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Exit Level</div>
                      <div className="font-semibold text-blue-400">{message.analysis.exitLevel}</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Stop Loss</div>
                      <div className="font-semibold text-red-400">{message.analysis.stopLoss}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* News Summary */}
            {message.hasNews && tickerNews && !message.isStreaming && (
              <div className="rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-3">TradeGPT News Summary</h4>
                <div className="space-y-3">
                  {tickerNews.slice(0, 2).map((news: any) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}