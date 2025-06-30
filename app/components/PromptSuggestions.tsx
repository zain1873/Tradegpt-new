"use client"

interface PromptSuggestionsProps {
  onPromptClick: (prompt: string) => void
}

const SUGGESTED_PROMPTS = [
  "Give me a shorting entry for QQQ",
  "Tell me the buying entry level for SPY",
  "Best entry points and exit for QQQ today",
  "Best shorting entry & exit for QQQ",
]

export default function PromptSuggestions({ onPromptClick }: PromptSuggestionsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 max-w-2xl mx-auto">
      {SUGGESTED_PROMPTS.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onPromptClick(prompt)}
          className="p-3 lg:p-4 bg-[#2e2e2e] hover:bg-[#1e1e1e] border border-gray-600 rounded-lg text-left transition-colors"
        >
          <span className="text-sm text-gray-300">{prompt}</span>
        </button>
      ))}
    </div>
  )
}
