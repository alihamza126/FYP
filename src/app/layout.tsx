import type { Metadata } from 'next'
import { Instrument_Sans } from 'next/font/google'
import '@/styles/styles.scss'
import './global.css'
import GlobalProvider from './GlobalProvider'
import ModalCart from '@/components/Modal/ModalCart'
import ModalWishlist from '@/components/Modal/ModalWishlist'
import ModalSearch from '@/components/Modal/ModalSearch'
import ModalQuickview from '@/components/Modal/ModalQuickview'
import ModalCompare from '@/components/Modal/ModalCompare'
import CountdownTimeType from '@/type/CountdownType'
import { countdownTime } from '@/store/countdownTime'
import { Toaster } from 'react-hot-toast'
import { HeroUIProvider } from "@heroui/react";
import ChatWidgetLoader from '@/components/chat/chatLoader'

const serverTimeLeft: CountdownTimeType = countdownTime();

const instrument = Instrument_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ali-Ecom',
  description: 'Multipurpose eCommerce Template',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  

  return (
    <GlobalProvider>
      <html lang="en">
        <HeroUIProvider>
        <ChatWidgetLoader />
          <Toaster />
          <body className={instrument.className}>
            {children}
            <ModalCart serverTimeLeft={serverTimeLeft} />
            <ModalWishlist />
            <ModalSearch />
            <ModalQuickview />
            <ModalCompare />
          </body>
        </HeroUIProvider>
      </html>
    </GlobalProvider>
  )
}
