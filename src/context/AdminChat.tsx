// src/context/ChatContext.tsx
'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';

export interface User {
    userId: string;
    socketId: string;
}

export interface Message {
    _id: string;
    senderId: string;
    receiverId?: string;
    text: string;
    createdAt: string;
}

interface ChatContextType {
    socket: Socket | null;
    activeUsers: User[];
    messages: Message[];
    selectedUser: User | null;
    setSelectedUser: (u: User | null) => void;
    sendMessage: (text: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const [socket, setSocket] = useState<Socket | null>(null);
    const [activeUsers, setActiveUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // 1) Initialize Socket.IO
    useEffect(() => {
        if (!userId) return;
        const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
            auth: { userId },
        });
        setSocket(s);
        return () => {
            s.disconnect();
            setSocket(null);
        };
    }, [userId]);

    // 2) Wire up socket events
    useEffect(() => {
        if (!socket) return;

        socket.on('active-users', setActiveUsers);

        socket.on('seleted-user-messages', (msgs: Message[]) => {
            if (!selectedUser) return;
            console.log(msgs)
            setMessages(msgs);
        });

        socket.on('receive-message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
            // notify if not currently chatting with them
            if (
                selectedUser &&
                msg.senderId !== selectedUser.userId &&
                msg.senderId !== userId
            ) {
                toast({
                    title: 'New message',
                    description: `From ${msg.senderId.substring(0, 8)}…`,
                });
            }
        });

        return () => {
            socket.off('active-users');
            socket.off('seleted-user-messages');
            socket.off('receive-message');
        };
    }, [socket, selectedUser, userId]);

    // 3) Whenever selectedUser changes, load that conversation
    useEffect(() => {
        if (socket && selectedUser) {
            socket.emit('seleted-user-messages', {
                senderId: selectedUser.userId,
            });
        }
    }, [socket, selectedUser]);

    // 4) sendMessage helper
    const sendMessage = (text: string) => {
        if (!socket || !userId || !selectedUser) return;
        const payload = {
            sender: userId,
            receiver: selectedUser.userId,
            text,
            id: Date.now().toString(),
        };
        socket.emit('admin-message-sent', payload);
        // locally append
        setMessages((m) => [
            ...m,
            {
                _id: payload.id,
                senderId: userId,
                receiverId: selectedUser.userId,
                text,
                timestamp: new Date().toISOString(),
            },
        ]);
    };

    return (
        <ChatContext.Provider
            value={{
                socket,
                activeUsers,
                messages,
                selectedUser,
                setSelectedUser,
                sendMessage,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) {
        throw new Error('useChat must be inside ChatProvider');
    }
    return ctx;
}
