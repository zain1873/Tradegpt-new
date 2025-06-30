// "use client"

// import { useState, useEffect } from "react"
// import { X, BarChart3, Newspaper, Lightbulb, TrendingUp, Loader2, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react"
// import { getStockQuote, getStockNews, type StockData, type NewsItem } from "../services/stockApi"

// interface TickerDetailPanelProps {
//   ticker: string
//   onClose: () => void
//   onChatAction: (action: string, ticker: string) => void
// }

// export default function TickerDetailPanel({ ticker, onClose, onChatAction }: TickerDetailPanelProps) {
//   const [stockData, setStockData] = useState<StockData | null>(null)
//   const [news, setNews] = useState<NewsItem[]>([])
//   const [loading, setLoading] = useState(true)
//   const [newsLoading, setNewsLoading] = useState(true)
//   const [hideKeyEvents, setHideKeyEvents] = useState(false)

//   useEffect(() => {
//     loadStockData()
//     loadNews()
//   }, [ticker])

//   const loadStockData = async () => {
//     setLoading(true)
//     try {
//       const data = await getStockQuote(ticker)
//       setStockData(data)
//     } catch (error) {
//       console.error("Error loading stock data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadNews = async () => {
//     setNewsLoading(true)
//     try {
//       const newsData = await getStockNews(ticker)
//       setNews(newsData)
//     } catch (error) {
//       console.error("Error loading news:", error)
//     } finally {
//       setNewsLoading(false)
//     }
//   }

//   const handleActionClick = (action: string) => {
//     onChatAction(action, ticker)
//     onClose()
//   }

//   const formatTime = (timestamp: number) => {
//     const date = new Date(timestamp * 1000)
//     return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//   }

//   const renderSparkline = (price: number, change: number) => {
//     const points = []
//     const basePrice = price - change
//     for (let i = 0; i < 10; i++) {
//       const variation = (Math.random() - 0.5) * (Math.abs(change) * 2)
//       points.push(basePrice + variation + (change * i) / 9)
//     }

//     const max = Math.max(...points)
//     const min = Math.min(...points)
//     const range = max - min || 1

//     const pathPoints = points
//       .map((value, index) => {
//         const x = (index / (points.length - 1)) * 200
//         const y = 60 - ((value - min) / range) * 60
//         return `${x},${y}`
//       })
//       .join(" ")

//     return (
//       <svg width="200" height="60" className="text-blue-400">
//         <polyline fill="none" stroke="currentColor" strokeWidth="2" points={pathPoints} />
//       </svg>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="absolute inset-0 bg-gray-900 z-10 flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
//       </div>
//     )
//   }

//   if (!stockData) {
//     return (
//       <div className="absolute inset-0 bg-gray-900 z-10 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-400">Failed to load stock data</p>
//           <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-700 rounded-lg">
//             Close
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="absolute inset-0 bg-[#1e1e1e] z-10 overflow-y-auto">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-700 flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold">{stockData.symbol}</h2>
//           <p className="text-sm text-gray-400">{stockData.name}</p>
//         </div>
//         <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
//           <X className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Price Info */}
//       <div className="p-4 border-b border-gray-700">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <div className="text-2xl font-bold">${stockData.price.toFixed(2)}</div>
//             <div className={`flex items-center gap-2 ${stockData.change >= 0 ? "text-green-400" : "text-red-400"}`}>
//               <span>
//                 {stockData.change >= 0 ? "+" : ""}
//                 {stockData.change.toFixed(2)}
//               </span>
//               <span>
//                 ({stockData.change >= 0 ? "+" : ""}
//                 {stockData.changePercent.toFixed(2)}%)
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Sparkline */}
//         <div className="mb-4">{renderSparkline(stockData.price, stockData.change)}</div>

//         {/* Action Buttons */}
//         <div className="grid grid-cols-2 gap-2">
//           <button
//             onClick={() => handleActionClick("Price Chart")}
//             className="flex items-center gap-2 p-3 bg-[#2e2e2e] hover:bg-[#1e1e1e] rounded-lg transition-colors"
//           >
//             <BarChart3 className="w-4 h-4" />
//             <span className="text-sm">Price Chart</span>
//           </button>
//           <button
//             onClick={() => handleActionClick("Recent News")}
//             className="flex items-center gap-2 p-3 bg-[#2e2e2e] hover:bg-[#1e1e1e] rounded-lg transition-colors"
//           >
//             <Newspaper className="w-4 h-4" />
//             <span className="text-sm">Recent News</span>
//           </button>
//           <button
//             onClick={() => handleActionClick("Trade Ideas")}
//             className="flex items-center gap-2 p-3 bg-[#2e2e2e] hover:bg-[#1e1e1e] rounded-lg transition-colors"
//           >
//             <Lightbulb className="w-4 h-4" />
//             <span className="text-sm">Trade Ideas</span>
//           </button>
//           <button
//             onClick={() => handleActionClick("Analysis")}
//             className="flex items-center gap-2 p-3 bg-[#2e2e2e] hover:bg-[#1e1e1e]  rounded-lg transition-colors"
//           >
//             <TrendingUp className="w-4 h-4" />
//             <span className="text-sm">Analysis</span>
//           </button>
//         </div>
//       </div>

//       {/* News Section */}
//       <div className="p-4">
//         {newsLoading ? (
//           <div className="text-center py-8">
//             <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-400" />
//             <p className="text-gray-400">Loading latest news...</p>
//           </div>
//         ) : news.length > 0 ? (
//           <div className="space-y-4">
//             {/* Today's News Highlight */}
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <Sparkles className="w-5 h-5 text-blue-400" />
//                 <h3 className="font-semibold text-white">Today's News Highlight</h3>
//               </div>

//               <div className=" rounded-lg p-4 mb-4">
//                 <h4 className="font-semibold text-lg mb-3 leading-tight">{news[0].headline}</h4>

//                 <button
//                   onClick={() => setHideKeyEvents(!hideKeyEvents)}
//                   className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 mb-4"
//                 >
//                   <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
//                   {hideKeyEvents ? "Show key events" : "Hide key events"}
//                 </button>

//                 {!hideKeyEvents && (
//                   <div className="space-y-4">
//                     <div className="flex gap-3">
//                       <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex-shrink-0 mt-1"></div>
//                       <div>
//                         <h5 className="font-medium text-white mb-2">
//                           {stockData.symbol} INVESTOR ALERT: Latest Market Update
//                         </h5>
//                         <p className="text-gray-300 text-sm leading-relaxed mb-3">
//                           {news[0].summary || news[0].headline}
//                         </p>
//                         <div className="text-xs text-gray-400 mb-3">
//                           {formatTime(news[0].datetime)} • {news[0].source}
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <span className="text-sm text-gray-400">Was this news helpful?</span>
//                           <div className="flex gap-2">
//                             <button className="p-1 hover:bg-gray-700 rounded">
//                               <ThumbsUp className="w-4 h-4 text-gray-400" />
//                             </button>
//                             <button className="p-1 hover:bg-gray-700 rounded">
//                               <ThumbsDown className="w-4 h-4 text-gray-400" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Recent News Summaries */}
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <Sparkles className="w-5 h-5 text-blue-400" />
//                 <h3 className="font-semibold text-blue-400">RECENT NEWS SUMMARIES</h3>
//               </div>

//               {news.length > 1 ? (
//                 <div className="space-y-3">
//                   {news.slice(1, 6).map((item) => (
//                     <div key={item.id} className="bg-[2e2e2e] rounded-lg p-3 hover:bg-[#2a2a2a] transition-colors">
//                       <h5 className="font-medium text-sm leading-tight mb-2">{item.headline}</h5>
//                       <p className="text-xs text-gray-400 mb-2 line-clamp-2">{item.summary}</p>
//                       <div className="flex items-center justify-between">
//                         <span className="text-xs text-blue-400">{item.source}</span>
//                         <span className="text-xs text-gray-500">{formatTime(item.datetime)}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-gray-400">
//                   <p>Past day summaries are not available due to insufficient key events.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-8 text-gray-400">
//             <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-50" />
//             <p>No recent news available for {stockData.symbol}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { X, BarChart3, Newspaper, Lightbulb, TrendingUp, Loader2, ThumbsUp, ThumbsDown, Sparkles, ExternalLink } from "lucide-react"
import { getStockQuote, getStockNews, type StockData, type NewsItem } from "../services/stockApi"

interface TickerDetailPanelProps {
  ticker: string
  onClose: () => void
  onChatAction: (action: string, ticker: string) => void
}

export default function TickerDetailPanel({ ticker, onClose, onChatAction }: TickerDetailPanelProps) {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newsLoading, setNewsLoading] = useState(true)
  const [hideKeyEvents, setHideKeyEvents] = useState(false)

  useEffect(() => {
    loadStockData()
    loadNews()
  }, [ticker])

  const loadStockData = async () => {
    setLoading(true)
    try {
      const data = await getStockQuote(ticker)
      setStockData(data)
    } catch (error) {
      console.error("Error loading stock data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadNews = async () => {
    setNewsLoading(true)
    try {
      const newsData = await getStockNews(ticker)
      setNews(newsData)
    } catch (error) {
      console.error("Error loading news:", error)
    } finally {
      setNewsLoading(false)
    }
  }

  const handleActionClick = (action: string) => {
    onChatAction(action, ticker)
    onClose()
  }

  const handleNewsClick = (newsItem: NewsItem) => {
    if (newsItem.url) {
      window.open(newsItem.url, '_blank', 'noopener,noreferrer')
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const renderSparkline = (price: number, change: number) => {
    const points = []
    const basePrice = price - change
    for (let i = 0; i < 10; i++) {
      const variation = (Math.random() - 0.5) * (Math.abs(change) * 2)
      points.push(basePrice + variation + (change * i) / 9)
    }

    const max = Math.max(...points)
    const min = Math.min(...points)
    const range = max - min || 1

    const pathPoints = points
      .map((value, index) => {
        const x = (index / (points.length - 1)) * 200
        const y = 60 - ((value - min) / range) * 60
        return `${x},${y}`
      })
      .join(" ")

    return (
      <svg width="200" height="60" className="text-blue-400">
        <polyline fill="none" stroke="currentColor" strokeWidth="2" points={pathPoints} />
      </svg>
    )
  }

  if (loading) {
    return (
      <div className="absolute inset-0 bg-gray-900 z-10 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  if (!stockData) {
    return (
      <div className="absolute inset-0 bg-gray-900 z-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Failed to load stock data</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-700 rounded-lg">
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 bg-[#1e1e1e] z-10 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{stockData.symbol}</h2>
          <p className="text-sm text-gray-400">{stockData.name}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Price Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold">${stockData.price.toFixed(2)}</div>
            <div className={`flex items-center gap-2 ${stockData.change >= 0 ? "text-green-400" : "text-red-400"}`}>
              <span>
                {stockData.change >= 0 ? "+" : ""}
                {stockData.change.toFixed(2)}
              </span>
              <span>
                ({stockData.change >= 0 ? "+" : ""}
                {stockData.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Sparkline */}
        <div className="mb-4">{renderSparkline(stockData.price, stockData.change)}</div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleActionClick("Price Chart")}
            className="flex items-center gap-2 p-3 bg-[#2e2e2e] hover:bg-[#1e1e1e] rounded-lg transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm">Price Chart</span>
          </button>
          <button
            onClick={() => handleActionClick("Recent News")}
            className="flex items-center gap-2 p-3 bg-[#2e2e2e] hover:bg-[#1e1e1e] rounded-lg transition-colors"
          >
            <Newspaper className="w-4 h-4" />
            <span className="text-sm">Recent News</span>
          </button>
          <button
            onClick={() => handleActionClick("Trade Ideas")}
            className="flex items-center gap-2 p-3 bg-[#2e2e2e] hover:bg-[#1e1e1e] rounded-lg transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            <span className="text-sm">Trade Ideas</span>
          </button>
          <button
            onClick={() => handleActionClick("Analysis")}
            className="flex items-center gap-2 p-3 bg-[#2e2e2e] hover:bg-[#1e1e1e]  rounded-lg transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Analysis</span>
          </button>
        </div>
      </div>

      {/* News Section */}
      <div className="p-4">
        {newsLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-blue-400" />
            <p className="text-gray-400">Loading latest news...</p>
          </div>
        ) : news.length > 0 ? (
          <div className="space-y-4">
            {/* Today's News Highlight */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white">Today's News Highlight</h3>
              </div>

              <div className=" rounded-lg p-4 mb-4">
                <div 
                  onClick={() => handleNewsClick(news[0])}
                  className="cursor-pointer hover:bg-[#2a2a2a] rounded-lg p-2 -m-2 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-lg mb-3 leading-tight group-hover:text-blue-400 transition-colors">{news[0].headline}</h4>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors ml-2 mt-1 flex-shrink-0" />
                  </div>
                </div>

                <button
                  onClick={() => setHideKeyEvents(!hideKeyEvents)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 mb-4"
                >
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                  {hideKeyEvents ? "Show key events" : "Hide key events"}
                </button>

                {!hideKeyEvents && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex-shrink-0 mt-1"></div>
                      <div>
                        <h5 className="font-medium text-white mb-2">
                          {stockData.symbol} INVESTOR ALERT: Latest Market Update
                        </h5>
                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                          {news[0].summary || news[0].headline}
                        </p>
                        <div className="text-xs text-gray-400 mb-3">
                          {formatTime(news[0].datetime)} • {news[0].source}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-400">Was this news helpful?</span>
                          <div className="flex gap-2">
                            <button className="p-1 hover:bg-gray-700 rounded">
                              <ThumbsUp className="w-4 h-4 text-gray-400" />
                            </button>
                            <button className="p-1 hover:bg-gray-700 rounded">
                              <ThumbsDown className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent News Summaries */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-blue-400">RECENT NEWS SUMMARIES</h3>
              </div>

              {news.length > 1 ? (
                <div className="space-y-3">
                  {news.slice(1, 6).map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => handleNewsClick(item)}
                      className="bg-[2e2e2e] rounded-lg p-3 hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sm leading-tight group-hover:text-blue-400 transition-colors flex-1">{item.headline}</h5>
                        <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-blue-400 transition-colors ml-2 mt-1 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-gray-400 mb-2 line-clamp-2">{item.summary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-400">{item.source}</span>
                        <span className="text-xs text-gray-500">{formatTime(item.datetime)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Past day summaries are not available due to insufficient key events.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent news available for {stockData.symbol}</p>
          </div>
        )}
      </div>
    </div>
  )
}