"use client"

import { useState } from "react"
import { Search, BarChart3, Lightbulb, ExternalLink, X } from "lucide-react"
import UserProfileCard from "./UserProfileCard"
import chatData from "../../mock/chat.json"

interface SidebarLeftProps {
  currentSession: string | null
  onSessionSelect: (sessionId: string) => void
  onPromptSelect: (prompt: string) => void
  onClose?: () => void
}

export default function SidebarLeft({ currentSession, onSessionSelect, onPromptSelect, onClose }: SidebarLeftProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const previous7Days = chatData.sessions.filter((session) => {
    const sessionDate = new Date(session.timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - sessionDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  })

  const previous30Days = chatData.sessions.filter((session) => {
    const sessionDate = new Date(session.timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - sessionDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 7 && diffDays <= 30
  })

  const handleSessionSelect = (sessionId: string) => {
    onSessionSelect(sessionId)
    onClose?.() // Close sidebar on mobile
  }

  const handleShowRecommendedPrompts = () => {
    // Trigger modal to show in chat area
    const event = new CustomEvent("showRecommendedPrompts")
    window.dispatchEvent(event)
    onClose?.() // Close sidebar on mobile
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Mobile Close Button */}
      {onClose && (
        <div className="lg:hidden p-4 border-b border-gray-700 flex justify-end">
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-2">
        <button
          onClick={() => handleSessionSelect("new")}
          className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#2e2e2e] text-white px-4 py-2 rounded-lg font-medium"
        >
          <span className="text-lg">+</span>
          <span>New Chat</span>
        </button>
      </div>

      {/* Header */}
  <div className="p-4 border-b border-gray-700">
  <div className="flex items-center gap-2 mb-4">
    <div className="w-10 h-12 flex items-center justify-center">
      <img 
       src="/transparent-logo.png" 
        alt="TradeGPT Logo" 
        className="w-12 h-12"
      />
    </div>
    <span className="text-xl font-bold">TradeGPT</span>
    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
  </div>

  {/* Search Bar */}
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      placeholder="Search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full bg-[#272727] border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
    />
  </div>
</div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2e2e2e] cursor-pointer">
          <BarChart3 className="w-5 h-5" />
          <span>Dashboard</span>
        </div>
        <div
          onClick={handleShowRecommendedPrompts}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2e2e2e] cursor-pointer"
        >
          <Lightbulb className="w-5 h-5" />
          <span>Recommended Prompts</span>
        </div>
      </div>

      {/* Previous Chats Label */}
      <div className="px-4 pt-2 pb-1">
        <h2 className="text-md font-semibold text-gray-300">Previous Chats</h2>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Previous 7 Days */}
        {previous7Days.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Previous 7 Days</h3>
            <div className="space-y-1">
              {previous7Days.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSessionSelect(session.id)}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-[#2a2a2a] ${
                    currentSession === session.id ? "bg-[#2a2a2a]" : ""
                  }`}
                >
                  <div className="text-sm truncate">{session.title}</div>
                  <div className="text-xs text-gray-400">{new Date(session.timestamp).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previous 30 Days */}
        {previous30Days.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Previous 30 Days</h3>
            <div className="space-y-1">
              {previous30Days.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSessionSelect(session.id)}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-gray-800 ${
                    currentSession === session.id ? "bg-gray-800" : ""
                  }`}
                >
                  <div className="text-sm truncate">{session.title}</div>
                  <div className="text-xs text-gray-400">{new Date(session.timestamp).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Box */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Boost your trading profits</h4>
          <p className="text-sm text-blue-100 mb-3">with our FREE training</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
            Get Started
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <UserProfileCard />
      </div>
    </div>
  )
}