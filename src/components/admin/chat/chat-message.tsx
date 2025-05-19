import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: string
  timestamp: string
  isAdmin: boolean
  userName?: string
}

export function ChatMessage({ message, timestamp, isAdmin, userName }: ChatMessageProps) {
  return (
    <div className={cn("flex items-start gap-2.5 mb-4", isAdmin ? "flex-row-reverse" : "flex-row")}>
      <Avatar className={cn("w-8 h-8", isAdmin ? "bg-blue-500" : "bg-gray-200")}>
        <AvatarFallback>
          <UserCircle className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex flex-col max-w-[80%] leading-1.5", isAdmin ? "items-end" : "items-start")}>
        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
          <span className="text-sm font-semibold">{isAdmin ? "Admin" : userName || "User"}</span>
        </div>
        <div
          className={cn(
            "px-4 py-2 rounded-lg",
            isAdmin ? "bg-blue-500 text-white rounded-tr-none" : "bg-gray-100 text-gray-900 rounded-tl-none",
          )}
        >
          <p className="text-sm">{message}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">{new Date(timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
  )
}
