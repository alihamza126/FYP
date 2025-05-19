'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserCircle, Send, MessageSquare } from 'lucide-react';
import { useChat } from '@/context/AdminChat';

export default function AdminChat() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const {
    activeUsers,
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState([]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  useEffect(() => {
    const res = selectedUser
      ? messages.filter(
        (m) =>
          (m.senderId === selectedUser.userId && m.receiverId === currentUserId) ||
          (m.senderId === currentUserId && m.receiverId === selectedUser.userId)
      )
      : [];

    setConversation(res);
  }, [messages])

  // Filter messages for this conversation


  const handleSend = () => {
    if (!messageInput.trim() || !selectedUser) return;

    sendMessage(messageInput.trim());
    setMessageInput('');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Active Users</h2>
          <p className="text-sm text-gray-500">{activeUsers.length} online</p>
        </div>
        <ScrollArea className="flex-1">
          {activeUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No active users
            </div>
          ) : (
            activeUsers.map((user: User) => (
              <div
                key={user.socketId}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${selectedUser?.userId === user.userId
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-100'
                  }`}
              >
                <Avatar>
                  <AvatarFallback>
                    <UserCircle className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    User {user.userId.slice(-8)}
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Online
                </Badge>
              </div>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-white flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  <UserCircle className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-bold">
                  User {selectedUser.userId.slice(-8)}
                </h2>
                <p className="text-sm text-gray-500">
                  ID: {selectedUser.userId}
                </p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation</p>
                </div>
              ) : (
                messages.map((msg: Message) => (
                  msg.senderId !== currentUserId && (
                    <div
                      key={msg._id}
                      className={`flex mt-2 ${msg.from == "admin"
                        ? 'justify-end'
                        : 'justify-start'
                        }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-[70%] ${msg.from == "admin"
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        <p>{msg.text}</p>
                        <p className="text-xs mt-1 text-white/40 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )

                ))
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-white flex gap-2">
              <Input
                placeholder="Type your message…"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!messageInput.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <Card className="p-6 max-w-md text-center">
              <h2 className="text-xl font-bold mb-2">
                Admin Chat Dashboard
              </h2>
              <p className="text-gray-500 mb-4">
                Select a user to start chatting
              </p>
              <Separator className="my-4" />
              <p className="text-sm text-gray-500">
                {activeUsers.length === 0
                  ? 'No users online'
                  : `${activeUsers.length} users online`}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}