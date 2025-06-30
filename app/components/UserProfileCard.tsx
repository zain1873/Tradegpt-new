"use client"

import { Cloud } from "lucide-react"
import userData from "../../mock/user.json"

export default function UserProfileCard() {
  const { user } = userData

  return (
    <div className="flex items-center gap-3">
      <img src={user.avatar || "/placeholder.svg"} alt={user.username} className="w-8 h-8 rounded-full bg-gray-600" />
      <div className="flex-1">
        <div className="font-medium text-sm">{user.username}</div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{user.weather.temperature}°C</span>
          <span>|</span>
          <div className="flex items-center gap-1">
            <Cloud className="w-3 h-3" />
            <span>{user.weather.condition}</span>
          </div>
          <span>|</span>
          <span>{user.weather.time}</span>
        </div>
      </div>
    </div>
  )
}
