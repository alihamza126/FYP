// src/components/ChatWidgetLoader.tsx
'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import 'react-chat-widget/lib/styles.css';
import './style.scss'

// Dynamically import your ChatWidget, disabling SSR
const ChatWidget = dynamic(
  () => import('./ChatWedget'),
  { ssr: false }
);

export default function ChatWidgetLoader() {
  const pathname = usePathname()

  return pathname.includes('/admin') ? null : (
    <ChatWidget />
  );
}
