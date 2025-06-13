'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-xl'
      }`}
    >
      <div className="container">
        <nav className="flex justify-between items-center py-4">
          {/* Logo */}
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
          
          {/* Navigation */}
          <ul className="hidden md:flex gap-8 list-none">
            <li>
              <Link 
                href="#" 
                className="text-gray-700 font-medium hover:text-gray-900 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="#features" 
                className="text-gray-700 font-medium hover:text-gray-900 transition-colors duration-200"
              >
                Features
              </Link>
            </li>
          </ul>
          
          {/* App Store Buttons */}
          {/* <div className="flex gap-3">
            <Link href="#" className="app-store-button">
              <div className="flex items-center gap-2">
                <span className="text-lg">📱</span>
                <div className="text-left">
                  <div className="text-xs opacity-80">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </div>
            </Link>
            
            <Link href="#" className="app-store-button google-play">
              <div className="flex items-center gap-2">
                <span className="text-lg">▷</span>
                <div className="text-left">
                  <div className="text-xs opacity-80">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </div>
            </Link>
          </div> */}
        </nav>
      </div>
    </header>
  )
}