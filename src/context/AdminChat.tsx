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
import toast from 'react-hot-toast';
import { Howl } from 'howler';

const notificationSound = new Howl({ src: ['/notification.wav'] });

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
            setMessages(msgs);
        });

        socket.on('receive-message', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
            notificationSound.play();   
            // // notify if not currently chatting with them
            if (
                msg.senderId != selectedUser?.userId
            ) {
                toast.custom(
                    (t) => (
                        <div
                            className={`
                          ${t.visible
                                    ? "transform transition duration-300 ease-out scale-100 opacity-100 translate-y-0"
                                    : "transform transition duration-150 ease-in scale-95 opacity-0 -translate-y-2"}
                          max-w-sm w-full bg-white shadow-lg rounded-lg ring-1 ring-gray-200 overflow-hidden cursor-pointer flex
                        `}
                            onClick={() => toast.dismiss(t.id)}
                        >
                            {/* Accent stripe */}
                            <div className="w-1 bg-blue-500" />

                            {/* Main content */}
                            <div className="flex-1 p-4 flex space-x-3">
                                {/* Optional icon */}
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        {/* replace with your icon */}
                                        <svg
                                            className="h-6 w-6 text-blue-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6l-4 4V5z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Text */}
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                        New message
                                        <span className="font-normal text-gray-500">
                                            {" "}
                                            from {msg.senderId.substring(0, 8)}…
                                        </span>
                                    </p>
                                    <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                                        {msg.text}
                                    </p>
                                </div>

                                {/* Close button */}
                                <button
                                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                                    onClick={() => toast.dismiss(t.id)}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1
                                   1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0
                                   01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0
                                   01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ),
                    {
                        id: msg._id,
                        duration: 5000,
                        position: "top-right",
                    }
                );
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
