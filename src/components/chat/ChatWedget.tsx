// src/components/chat/ChatWidget.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Howl } from 'howler';
import {
    Widget,
    addUserMessage,
    addResponseMessage,
    renderCustomComponent
} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { useSession } from 'next-auth/react';

// play a sound on incoming messages
const notificationSound = new Howl({ src: ['/notification.wav'] });

// your message type
type ChatMessage = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: number;
};

// a small timestamp component
const Timestamp = ({ date }: { date: number }) => (
    <div style={{
        fontSize: '0.75rem',
        margin: '4px 0 12px 0',
        color: '#888',
        textAlign: 'right'
    }}>
        {new Date(date).toLocaleTimeString()}
    </div>
);

let socket: ReturnType<typeof io> | null = null;

export default function ChatWidget() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const userId = session?.user?.id as string | undefined;
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // 1) Seed a welcome message on first mount
    useEffect(() => {
        const welcome: ChatMessage = {
            id: crypto.randomUUID(),
            text: '👋 Hey there! Welcome to ALI-CART Support.',
            sender: 'bot',
            timestamp: Date.now(),
        };
        setMessages([welcome]);
        addResponseMessage(welcome.text);
        renderCustomComponent(Timestamp, { date: welcome.timestamp });
    }, []);

    // 2) Wire up Socket.IO: load history & listen for new messages
    useEffect(() => {
        if (!userId) return;

        // initialize socket once
        if (!socket) {
            socket = io({
                auth: { userId },
            });
        }

        socket.on('connect', () => console.log('Socket connected:', socket?.id));
        socket.on('disconnect', () => console.log('Socket disconnected.'));

        // when the server sends all previous messages:
        socket.on('previous-messages', (history: ChatMessage[]) => {
            history.forEach((msg) => {
                if (msg.senderId === userId) {
                    addUserMessage(msg.text);
                } else {
                    addResponseMessage(msg.text);
                }
                // render the real timestamp from the server
                renderCustomComponent(Timestamp, { date: msg.timestamp });
            });
            setMessages(history);
        });

        // when the server pushes a new message:
        socket.on('receive-message', (msg: ChatMessage) => {
            notificationSound.play();
            addResponseMessage(msg.text);
            renderCustomComponent(Timestamp, { date: msg.timestamp });
            setMessages((m) => [...m, msg]);
        });

        return () => {
            socket?.disconnect();
            socket = null;
        };
    }, [userId]);

    // 3) Handler when the user sends a new chat message
    const handleNewUserMessage = (text: string) => {
        const msg: ChatMessage = {
            id: crypto.randomUUID(),
            text,
            sender: 'user',
            timestamp: Date.now(),
        };

        // addUserMessage(text);
        renderCustomComponent(Timestamp, { date: msg.timestamp });
        setMessages((m) => [...m, msg]);

        // send it to the server; server should persist & broadcast
        socket?.emit('send-message', {
            id: crypto.randomUUID(),
            text,
            sender: userId,
            timestamp: msg.timestamp
        });
    };

    return (
        <Widget
            handleNewUserMessage={handleNewUserMessage}
            title="A-CART Chat"
            subtitle="Your streetwear concierge"
            senderPlaceHolder="Type a message..."
            emojis={true}
            // default timestamp rendering is on, but we're manually rendering below
            handleToggle={(nextOpen: boolean) => setIsOpen(nextOpen)}
            showTimeStamp={false}
        />
    );
}
