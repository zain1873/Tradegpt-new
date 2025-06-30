"use client"

interface NewsCardProps {
  news: {
    id: number
    headline: string
    summary: string
    timestamp: string
    source: string
  }
}

export default function NewsCard({ news }: NewsCardProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="bg-[#2e2e2e] rounded-lg p-3 hover:bg-[#1a1a1a]  transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h5 className="font-medium text-sm leading-tight">{news.headline}</h5>
        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{formatTime(news.timestamp)}</span>
      </div>
      <p className="text-xs text-gray-400 mb-2">{news.summary}</p>
      <div className="text-xs text-blue-400">{news.source}</div>
    </div>
  )
}
