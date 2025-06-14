import Link from 'next/link'
import Image from 'next/image'

const footerLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Support', href: 'mailto:support@chores-ai.com' }
]

export default function MarketingFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/choresai-icon.png"
              alt="ChoresAI Logo"
              width={50}
              height={50}
              className="p-1"
            />
            <span className="text-2xl font-heading font-normal leading-tight bg-gradient-to-br from-purple-600 to-teal-600 bg-clip-text text-transparent">
              ChoresAI
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8">
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* App Store Buttons */}
          {/* <div className="flex gap-3">
            <Link href="#" className="app-store-button text-xs">
              <div className="flex items-center gap-2">
                <span className="text-sm">📱</span>
                <div className="text-left">
                  <div className="text-xs opacity-80">Download</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </div>
            </Link>
            
            <Link href="#" className="app-store-button google-play text-xs">
              <div className="flex items-center gap-2">
                <span className="text-sm">▷</span>
                <div className="text-left">
                  <div className="text-xs opacity-80">Get on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </div>
            </Link>
          </div> */}
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2024 ChoresAI. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built with <Image src="/robot-heart.png" alt="Heart" width={25} height={25} className="inline-block mb-2" /> for modern families.
          </p>
        </div>
      </div>
    </footer>
  )
}