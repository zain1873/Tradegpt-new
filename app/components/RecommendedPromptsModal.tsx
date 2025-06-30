

"use client"

import { useState } from "react"
import { X, TrendingUp, BarChart3, Flame, Send, Target, Zap } from "lucide-react"

interface RecommendedPromptsModalProps {
  isOpen: boolean
  onClose: () => void
  onPromptSelect: (prompt: string) => void
}

const QUICK_TRADES_PROMPTS = [
  {
    id: 1,
    text: "What are the top 5 stocks to buy today for quick returns in intraday trading.",
    category: "Intraday",
  },
  {
    id: 2,
    text: "Give me the top 5 stock picks today influenced by both the latest economic indicators (interest rates, CPI, PPI) and industry-specific news.",
    category: "Economic Analysis",
  },
  {
    id: 3,
    text: "List the top 5 stocks with positive momentum and strong market sentiment for trading today.",
    category: "Momentum",
  },
  {
    id: 4,
    text: "List top 5 stocks with a bullish crossover of the 50-day and 200-day exponential moving averages, indicating a potential upward trend.",
    category: "Technical Analysis",
  },
]

const TOP_PICKS_PROMPTS = [
  {
    id: 5,
    text: "Show me the top 5 dividend aristocrat stocks with consistent dividend growth over the past 10 years.",
    category: "Dividend Stocks",
  },
  {
    id: 6,
    text: "Identify the top 5 undervalued large-cap stocks with strong fundamentals and P/E ratios below industry average.",
    category: "Value Investing",
  },
  {
    id: 7,
    text: "List the top 5 growth stocks in the technology sector with revenue growth exceeding 25% year-over-year.",
    category: "Growth Stocks",
  },
  {
    id: 8,
    text: "Find the top 5 ESG-compliant stocks with high sustainability ratings and strong financial performance.",
    category: "ESG Investing",
  },
]

const HOT_TRADES_PROMPTS = [
  {
    id: 9,
    text: "Highlight the top 5 Call options in the AI hardware sector driven by advancements in chip technology.",
    category: "AI/Tech",
  },
  {
    id: 10,
    text: "Recommend me the top Call or Put options with weekly expirations for ETFs.",
    category: "ETFs",
  },
  {
    id: 11,
    text: "Show me the best performing Call or Put options in the energy sector as oil prices continue to fluctuate.",
    category: "Energy",
  },
  {
    id: 12,
    text: "Recommend me top Call or Put options that are linked to company with the current news events today.",
    category: "News-Driven",
  },
]

const MARKET_MOVES_PROMPTS = [
  {
    id: 13,
    text: "Analyze the current market sentiment and identify the top 3 sectors showing unusual options activity.",
    category: "Market Analysis",
  },
  {
    id: 14,
    text: "Find stocks with the highest implied volatility changes in the last 24 hours.",
    category: "Volatility",
  },
  {
    id: 15,
    text: "Show me the most active options contracts expiring this Friday across all sectors.",
    category: "Expiration",
  },
  {
    id: 16,
    text: "Identify potential breakout stocks based on unusual options flow and technical patterns.",
    category: "Breakouts",
  },
]

export default function RecommendedPromptsModal({ isOpen, onClose, onPromptSelect }: RecommendedPromptsModalProps) {
  const [activeCategory, setActiveCategory] = useState<"options" | "stocks">("stocks")
  const [activeTab, setActiveTab] = useState<"quick-trades" | "top-picks" | "hot-trades" | "market-moves">(
    "quick-trades",
  )

  if (!isOpen) return null

  const getCurrentPrompts = () => {
    if (activeCategory === "stocks") {
      return activeTab === "quick-trades" ? QUICK_TRADES_PROMPTS : TOP_PICKS_PROMPTS
    } else {
      return activeTab === "hot-trades" ? HOT_TRADES_PROMPTS : MARKET_MOVES_PROMPTS
    }
  }

  const currentPrompts = getCurrentPrompts()

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e1e1e] rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-700">
          <h2 className="text-lg lg:text-xl font-semibold text-white">Turbocharge your trading with these prompts.</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Category Toggle */}
        <div className="p-4 lg:p-6 pb-4">
          <div className="flex gap-2 lg:gap-4 mb-4 lg:mb-6">
            <button
              onClick={() => {
                setActiveCategory("options")
                setActiveTab("hot-trades")
              }}
              className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base ${
                activeCategory === "options" ? "bg-[#2a2a2a] text-white" : "bg-gray-600 text-gray-300 hover:bg-[#2a2a2a]"
              }`}
            >
              <X className="w-4 h-4 lg:w-5 lg:h-5" />
              Options
            </button>
            <button
              onClick={() => {
                setActiveCategory("stocks")
                setActiveTab("quick-trades")
              }}
              className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base ${
                activeCategory === "stocks" ? "bg-[#2a2a2a] text-white" : "bg-gray-600 text-gray-300 hover:bg-[#2a2a2a]"
              }`}
            >
              <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5" />
              Stocks
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 lg:gap-6 mb-4 lg:mb-6 overflow-x-auto">
            {activeCategory === "stocks" ? (
              <>
                <button
                  onClick={() => setActiveTab("quick-trades")}
                  className={`flex items-center gap-2 pb-2 border-b-2 transition-colors whitespace-nowrap text-sm lg:text-base ${
                    activeTab === "quick-trades"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Zap className="w-4 h-4 lg:w-5 lg:h-5" />
                  Quick Trades
                </button>
                <button
                  onClick={() => setActiveTab("top-picks")}
                  className={`flex items-center gap-2 pb-2 border-b-2 transition-colors whitespace-nowrap text-sm lg:text-base ${
                    activeTab === "top-picks"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Target className="w-4 h-4 lg:w-5 lg:h-5" />
                  Top Picks
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab("hot-trades")}
                  className={`flex items-center gap-2 pb-2 border-b-2 transition-colors whitespace-nowrap text-sm lg:text-base ${
                    activeTab === "hot-trades"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Flame className="w-4 h-4 lg:w-5 lg:h-5" />
                  Hot Trades
                </button>
                <button
                  onClick={() => setActiveTab("market-moves")}
                  className={`flex items-center gap-2 pb-2 border-b-2 transition-colors whitespace-nowrap text-sm lg:text-base ${
                    activeTab === "market-moves"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5" />
                  Market Moves
                </button>
              </>
            )}
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="px-4 lg:px-6 pb-4 lg:pb-6 max-h-96 overflow-y-auto">
          <div className="space-y-3 lg:space-y-4">
            {currentPrompts.map((prompt) => (
              <div key={prompt.id} className="bg-[#2a2a2a] rounded-lg p-3 lg:p-4 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 lg:gap-4">
                  <div className="flex-1">
                    <p className="text-white text-sm leading-relaxed mb-2">{prompt.text}</p>
                    <span className="inline-block px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                      {prompt.category}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onPromptSelect(prompt.text)
                      onClose()
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition-colors w-full lg:w-auto lg:flex-shrink-0"
                  >
                    Use prompt
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}