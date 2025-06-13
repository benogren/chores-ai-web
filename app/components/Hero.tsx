// import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Social Proof Badge */}
            <div className="social-proof-badge">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 border-2 border-white"></div>
              </div>
              <span>Loved by thousands of families</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h2 className="font-heading text-4xl lg:text-5xl font-normal text-gray-900 leading-tight">
                Transform chores into 
                <span className="bg-gradient-to-br from-purple-600 to-teal-600 bg-clip-text text-transparent"> earnings</span> with just a picture
              </h2>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-md">
              Meet ChoresAI, the AI-powered app for easy family chore management. 
              Snap a photo, scan progress, or track completion and get instant 
              payment and responsibility building.
            </p>

            {/* App Store Buttons */}
            {/* <div className="flex gap-4 pt-4">
              <Link href="#" className="app-store-button">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </div>
              </Link>
              
              <Link href="#" className="app-store-button google-play">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">▷</span>
                  <div className="text-left">
                    <div className="text-xs opacity-80">GET IT ON</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </div>
              </Link>
            </div> */}
          </div>

          {/* Right Column - Phone Mockups */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full">
                <Image
                  src="/choresai-hero.png"
                  alt="ChoresAI App Mockup"
                  width={750}
                  height={591}
                  className='cover object-contain max-w-full h-auto animate-float'
                />  
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}