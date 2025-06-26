import AndroidLandingPage from "./AndroidLandingPage"

// Static metadata export
export const metadata = {
  title: 'ChoresAI for Android - Coming Soon | Join the Waitlist',
  description: 'ChoresAI for Android is almost here! Join our waitlist to be the first to know when our AI-powered family chore management app launches on Google Play.',
  keywords: 'ChoresAI, Android app, family chores, chore management, kids responsibilities, AI app, coming soon',
  authors: [{ name: 'ChoresAI' }],
  creator: 'ChoresAI',
  publisher: 'ChoresAI',
  
  // Open Graph
  openGraph: {
    title: 'ChoresAI for Android - Coming Soon',
    description: 'Transform family chore management with AI. Join our Android waitlist for early access to photo-based chore tracking and instant rewards.',
    url: 'https://chores-ai.com/download/android',
    siteName: 'ChoresAI',
    images: [
      {
        url: 'https://chores-ai.com/og-android-coming-soon.png',
        width: 1200,
        height: 630,
        alt: 'ChoresAI Android App Coming Soon',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'ChoresAI for Android - Coming Soon',
    description: 'Transform family chore management with AI. Join our Android waitlist for early access.',
    images: ['https://chores-ai.com/og-android-coming-soon.png'],
  },
  
  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Canonical URL
  alternates: {
    canonical: 'https://chores-ai.com/download/android',
  },
}

export default function AndroidDownloadPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ChoresAI",
    "applicationCategory": "Productivity",
    "operatingSystem": "Android",
    "description": "AI-powered family chore management app with photo recognition and instant rewards",
    "url": "https://chores-ai.com/download/android",
    "author": {
      "@type": "Organization",
      "name": "ChoresAI"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <AndroidLandingPage />
    </>
  )
}