import AppleLandingPage from "./AppleLandingPage"

// Static metadata export
export const metadata = {
  title: 'ChoresAI for iOS | Download Now',
  description: 'ChoresAI for iOS is here! Download our AI-powered family chore management app from the App Store and transform how your family handles chores.',
  keywords: 'ChoresAI, iOS app, family chores, chore management, kids responsibilities, AI app, download now',
  authors: [{ name: 'ChoresAI' }],
  creator: 'ChoresAI',
  publisher: 'ChoresAI',
  
  // Open Graph
  openGraph: {
    title: 'ChoresAI for iOS | Download Now',
    description: 'Transform family chore management with AI. Download our iOS app from the App Store for photo-based chore tracking and instant rewards.',
    url: 'https://chores-ai.com/download/ios',
    siteName: 'ChoresAI',
    images: [
      {
        url: 'https://chores-ai.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ChoresAI iOS App Download',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'ChoresAI for iOS | Download Now',
    description: 'Transform family chore management with AI. Download our iOS app from the App Store for photo-based chore tracking and instant rewards.',
    images: ['https://chores-ai.com/og-image.png'],
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
    canonical: 'https://chores-ai.com/download/ios',
  },
}

export default function AppleDownloadPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ChoresAI",
    "applicationCategory": "Productivity",
    "operatingSystem": "iOS",
    "description": "AI-powered family chore management app with photo recognition and instant rewards",
    "url": "https://chores-ai.com/download/ios",
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
        <AppleLandingPage />
      </>
    )
}