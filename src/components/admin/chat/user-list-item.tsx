"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserListItemProps {
  userId: string
  isSelected: boolean
  onClick: () => void
  hasUnread?: boolean
}

export function UserListItem({ userId, isSelected, onClick, hasUnread }: UserListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
        isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100",
      )}
      onClick={onClick}
    >
      <Avatar>
        <AvatarFallback>
          <UserCircle className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">User {userId.substring(0, 8)}...</p>
      </div>
      <div className="flex gap-2">
        {hasUnread && (
          <Badge className="bg-red-500 text-white border-0 h-5 w-5 p-0 flex items-center justify-center rounded-full">
            •
          </Badge>
        )}
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Online
        </Badge>
      </div>
    </div>
  )
}
