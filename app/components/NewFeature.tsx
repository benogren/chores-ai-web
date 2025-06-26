import Image from "next/image";

export default function NewFeature() {
    return (
        <section className="pt-16">
                <div className="container">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-8">
                      {/* Coming Soon Badge */}
                      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-purple-100 to-teal-100 rounded-full">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-br from-purple-600 to-teal-600 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium bg-gradient-to-br from-purple-600 to-teal-600 bg-clip-text text-transparent">
                            New Feature
                          </span>
                        </div>
                      </div>
        
                      {/* Main Headline */}
                      <div className="space-y-6">
                        <h1 className="font-heading text-4xl lg:text-5xl font-normal text-gray-900 leading-tight">
                          ChoresAI for 
                          <span className="bg-gradient-to-br from-purple-600 to-teal-600 bg-clip-text text-transparent"> iPad </span> 
                          is now available!
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                            Transform your family&apos;s chore management with our new iPad app. 
                            Enjoy a larger screen experience for easier task management and family coordination.
                        </p>
                      </div>
        
                    </div>
        
                    {/* Right Column - App Preview */}
                    <div className="relative flex justify-center lg:justify-end">
                      <div className="relative">
                        {/* Phone mockup with "Coming Soon" overlay */}
                        <div className="relative w-full max-w-md">
                          <Image
                            src="/choresai-ipad.png"
                            alt="ChoresAI App Preview"
                            width={400}
                            height={315}
                            className="object-contain w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
    );
}