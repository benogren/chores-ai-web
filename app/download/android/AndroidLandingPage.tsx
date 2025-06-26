'use client'

import Image from 'next/image'
import Waitlist from '@/components/Waitlist'

export default function AndroidLandingPage() {

  return (
    <div className="min-h-screen bg-white mt-16">

      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Coming Soon Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-purple-100 to-teal-100 rounded-full">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-br from-purple-600 to-teal-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium bg-gradient-to-br from-purple-600 to-teal-600 bg-clip-text text-transparent">
                    Android App Coming Soon
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="font-heading text-4xl lg:text-5xl font-normal text-gray-900 leading-tight">
                  ChoresAI for 
                  <span className="bg-gradient-to-br from-purple-600 to-teal-600 bg-clip-text text-transparent"> Android </span> 
                  is almost here
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  We&apos;re putting the finishing touches on our Android app. Be the first to know when 
                  it&apos;s ready and get early access to transform your family&apos;s chore management.
                </p>
              </div>

              {/* Waitlist Form */}
              <Waitlist />

            </div>

            {/* Right Column - App Preview */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone mockup with "Coming Soon" overlay */}
                <div className="relative w-full max-w-md">
                  <Image
                    src="/choresai-hero.png"
                    alt="ChoresAI App Preview"
                    width={400}
                    height={315}
                    className="object-contain w-full h-auto opacity-50"
                  />
                  {/* Coming Soon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 text-center max-w-xs">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
                      <p className="text-gray-600 text-sm">Android version in development</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl lg:text-3xl font-normal text-gray-900">
              Everything you love about ChoresAI, coming to Android
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The same powerful features that iOS families love, optimized for Android devices.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl transition-all duration-300 bg-gradient-to-br from-gray-100 to-gray-200 text-white`}>
                📸
              </div>
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">Photo Recognition</h3>
              <p className="text-gray-600">Snap a photo to instantly track chore completion with AI-powered verification.</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl transition-all duration-300 bg-gradient-to-br from-gray-100 to-gray-200 text-white`}>
                💰
              </div>
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">Instant Rewards</h3>
              <p className="text-gray-600">Automatic credit tracking and reward distribution for completed tasks.</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-2xl transition-all duration-300 bg-gradient-to-br from-gray-100 to-gray-200 text-white`}>
                👨‍👩‍👧‍👦
              </div>
              <h3 className="font-heading text-lg font-semibold text-gray-900 mb-2">Family Management</h3>
              <p className="text-gray-600">Easy coordination between parents and kids with progress tracking.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}