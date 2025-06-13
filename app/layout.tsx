import type { Metadata } from 'next'
import { Inter, Varela_Round } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import MarketingFooter from './components/MarketingFooter'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap'
})

const varelaRound = Varela_Round({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-varela-round',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'ChoresAI - AI-Powered Family Chore Management',
  description: 'Transform household chores into an engaging experience with AI verification, digital rewards, and seamless family coordination.',
  keywords: ['chores', 'AI', 'family', 'kids', 'allowance', 'responsibility'],
  openGraph: {
    title: 'ChoresAI - AI-Powered Family Chore Management',
    description: 'Transform household chores into an engaging experience with AI verification, digital rewards, and seamless family coordination.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${varelaRound.variable} font-sans`}>
        <Header />
        <main>{children}</main>
        <MarketingFooter />
      </body>
    </html>
  )
}