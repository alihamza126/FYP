// src/components/chat/ChatWidget.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
    Widget,
    addUserMessage,
    addResponseMessage,
} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

type ChatMessage = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: number;
};

export default function ChatWidget() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // seed initial welcome
    useEffect(() => {
        const welcome: ChatMessage = {
            id: crypto.randomUUID(),
            text: '👋 Hey there! Welcome to ALI-CART Support.',
            sender: 'bot',
            timestamp: Date.now(),
        };
        setMessages([welcome]);
        addResponseMessage(welcome.text);
    }, []);

    // called when user sends a new message
    const handleNewUserMessage = async (text: string) => {
        try {
            const botMsg: ChatMessage = {
                id: crypto.randomUUID(),
                text: "reply",
                sender: 'bot',
                timestamp: Date.now(),
            };
            setMessages((m) => [...m, botMsg]);
            addResponseMessage("reply");
        } catch (err) {
            console.error(err);
            const errMsg = '❌ Sorry, something went wrong.';
            const botError: ChatMessage = {
                id: crypto.randomUUID(),
                text: errMsg,
                sender: 'bot',
                timestamp: Date.now(),
            };
            setMessages((m) => [...m, botError]);
            addResponseMessage(errMsg);
        }
    };

    return (
        <Widget
            handleNewUserMessage={handleNewUserMessage}
            title="A-CART Chat"
            subtitle="Your streetwear concierge"
            handleToggle={(nextOpen: boolean) => setIsOpen(nextOpen)}
            senderPlaceHolder="Type a message..."
            emojis={true}
        />
    );
}

