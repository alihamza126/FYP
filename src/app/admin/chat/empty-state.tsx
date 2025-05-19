import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">Admin Chat Dashboard</CardTitle>
          <CardDescription className="text-center">Select a user from the sidebar to start chatting</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-sm text-gray-500 text-center">
            When users connect, they will appear in the sidebar. You can then select them to start a conversation.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
