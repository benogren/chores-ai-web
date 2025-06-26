import type { Metadata } from 'next'
import { Inter, Varela_Round } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import MarketingFooter from './components/MarketingFooter'
import { Analytics } from "@vercel/analytics/react"
// import { SpeedInsights } from "@vercel/speed-insights/next"

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
  authors: [{ name: 'ChoresAI', url: 'https://chores-ai.com' }],
  creator: 'ChoresAI',
  publisher: 'ChoresAI',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: 'https://chores-ai-api.vercel.app/icon1.png',
  },
  manifest: 'https://chores-ai-api.vercel.app/manifest.json',
  openGraph: {
    title: 'ChoresAI - AI-Powered Family Chore Management',
    description: 'Transform household chores into an engaging experience with AI verification, digital rewards, and seamless family coordination.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://chores-ai-api.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ChoresAI - AI-Powered Family Chore Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChoresAI',
    description: 'AI-Powered Family Chore Management',
    images: ['https://chores-ai-api.vercel.app/x-og-image.png'],
  },
  appLinks: {
    ios: {
      url: 'https://apps.apple.com/us/app/choresai-smart-family-tasks/id6747013648',
      app_store_id: 'id6747013648',
    },
    // android: {
    //   package: 'com.example.android/package',
    //   app_name: 'app_name_android',
    // },
    web: {
      url: 'https://chores-ai.com',
      should_fallback: true,
    },
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
        <main>
          {children}
          <Analytics />
          {/* <SpeedInsights /> */}
        </main>
        <MarketingFooter />
      </body>
    </html>
  )
}