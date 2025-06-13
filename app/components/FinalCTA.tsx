// import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="py-32 bg-white">
      <div className="container text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="font-heading text-4xl lg:text-5xl font-normal text-gray-900">
            Ready to transform your family&apos;s chore experience?
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Join thousands of families who&apos;ve discovered the joy of AI-powered 
            chore management. Start building responsibility and earning trust today.
          </p>
          
          {/* App Store Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
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

          {/* Trust Badge */}
          {/* <div className="pt-8">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <span>⭐⭐⭐⭐⭐</span>
              <span>Free to download • No credit card required</span>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}