"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import SidebarLeft from "./components/SidebarLeft"
import ChatArea from "./components/ChatArea"
import WatchlistSidebar from "./components/WatchlistSidebar"
import TickerDetailPanel from "./components/TickerDetailPanel"

export default function TradeGPTApp() {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null)
  const [currentSession, setCurrentSession] = useState<string | null>("new")
  const [pendingAction, setPendingAction] = useState<{ action: string; ticker: string } | null>(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const [sessionUpdateTrigger, setSessionUpdateTrigger] = useState(0) // Add this to force sidebar re-render

  const handlePromptSelect = (prompt: string) => {
    const event = new CustomEvent("sendPrompt", { detail: prompt })
    window.dispatchEvent(event)
    setLeftSidebarOpen(false) // Close sidebar on mobile after selection
  }

  const handleChatAction = (action: string, ticker: string) => {
    setPendingAction({ action, ticker })
  }

  const handleActionProcessed = () => {
    setPendingAction(null)
  }

  const handleTickerSelect = (ticker: string) => {
    setSelectedTicker(ticker)
    setRightSidebarOpen(false) // Close watchlist on mobile when ticker is selected
  }

  const handleSessionSelect = (sessionId: string) => {
    console.log("Session selected:", sessionId) // Debug log
    setCurrentSession(sessionId)
    setLeftSidebarOpen(false) // Close sidebar on mobile when session is selected
  }

  const handleSessionUpdate = (sessionId: string, messages: any[]) => {
    console.log("Session updated:", sessionId, messages) // Debug log
    // Update current session to the new one
    setCurrentSession(sessionId)
    // Force sidebar to re-render by updating trigger
    setSessionUpdateTrigger(prev => prev + 1)
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white relative">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setLeftSidebarOpen(!leftSidebarOpen)} className="p-2 hover:bg-gray-800 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">TradeGPT</h1>
        <button onClick={() => setRightSidebarOpen(!rightSidebarOpen)} className="p-2 hover:bg-gray-800 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {(leftSidebarOpen || rightSidebarOpen) && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => {
            setLeftSidebarOpen(false)
            setRightSidebarOpen(false)
          }}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`
          fixed lg:relative lg:translate-x-0 z-40 lg:z-auto
          w-80 h-full border-r border-gray-700 bg-gray-900
          transition-transform duration-300 ease-in-out
          ${leftSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:block
        `}
      >
        <SidebarLeft
          key={sessionUpdateTrigger} // Force re-render when sessions update
          currentSession={currentSession}
          onSessionSelect={handleSessionSelect}
          onPromptSelect={handlePromptSelect}
          onClose={() => setLeftSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col pt-16 lg:pt-0 bg-[#232323]">
        <ChatArea
          currentSession={currentSession}
          pendingAction={pendingAction}
          onActionProcessed={handleActionProcessed}
          onSessionUpdate={handleSessionUpdate}
        />
      </div>

      {/* Right Sidebar */}
      <div
        className={`
          fixed lg:relative lg:translate-x-0 z-40 lg:z-auto right-0
          w-80 h-full border-l border-gray-700 bg-gray-900
          transition-transform duration-300 ease-in-out
          ${rightSidebarOpen ? "translate-x-0" : "translate-x-full"}
          lg:block
        `}
      >
        <WatchlistSidebar
          selectedTicker={selectedTicker}
          onTickerSelect={handleTickerSelect}
          onClose={() => setRightSidebarOpen(false)}
        />

        {/* Ticker Detail Panel Overlay */}
        {selectedTicker && (
          <TickerDetailPanel
            ticker={selectedTicker}
            onClose={() => {
              setSelectedTicker(null)
              setRightSidebarOpen(false)
            }}
            onChatAction={handleChatAction}
          />
        )}
      </div>
    </div>
  )
}