// app/thank-you/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import confetti from 'canvas-confetti'

export default function ThankYouPage() {
  const [showSuccess, setShowSuccess] = useState(false)
//   const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    // Trigger success animation
    setTimeout(() => setShowSuccess(true), 200)

    // Enhanced confetti effect using canvas-confetti
    const triggerConfetti = () => {
      // If canvas-confetti is installed, use this:
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
      })

      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#8b5cf6', '#06b6d4', '#10b981']
        })
      }, 200)

      // Third burst
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a855f7', '#06b6d4', '#10b981']
        })
      }, 400)
      

      // Fallback CSS confetti (remove if using canvas-confetti)
      createCSSConfetti()
    }

    triggerConfetti()
  }, [])

  // Fallback CSS confetti function
  const createCSSConfetti = () => {
    const colors = ['#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
    
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div')
        confetti.className = 'confetti-piece'
        confetti.style.left = Math.random() * 100 + '%'
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        confetti.style.animationDelay = Math.random() * 3 + 's'
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's'
        confetti.style.width = (Math.random() * 8 + 4) + 'px'
        confetti.style.height = (Math.random() * 8 + 4) + 'px'
        document.body.appendChild(confetti)
        
        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti)
          }
        }, 6000)
      }, i * 30)
    }
  }

//   const shareMessage = "I just joined the ChoresAI waitlist! 🤖 AI-powered family chore management is coming soon!"
//   const shareUrl = "https://chores-ai.com"

//   const shareOnTwitter = () => {
//     const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`
//     window.open(url, '_blank')
//   }

//   const shareOnFacebook = () => {
//     const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
//     window.open(url, '_blank')
//   }

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(`${shareMessage} ${shareUrl}`)
//       setCopySuccess(true)
//       setTimeout(() => setCopySuccess(false), 2000)
//     } catch (err) {
//       console.error('Failed to copy: ', err)
//     }
//   }

  return (
    <>
      <style jsx>{`
        .confetti-piece {
          position: fixed;
          z-index: 1000;
          top: -10px;
          border-radius: 3px;
          animation: confetti-fall linear infinite;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotateZ(0deg) rotateY(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(720deg) rotateY(360deg);
            opacity: 0;
          }
        }
        
        .success-enter {
          animation: success-bounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        @keyframes success-bounce {
          0% {
            transform: scale(0.3) translateY(50px);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) translateY(-10px);
            opacity: 0.9;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        
        .float-up {
          animation: float-up 0.6s ease-out forwards;
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(40px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }
        
        @keyframes pulse-gentle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .wiggle {
          animation: wiggle 0.8s ease-in-out;
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
      `}</style>

      <section className="min-h-screen pt-20 pb-20 bg-gradient-to-br from-purple-50 via-white to-teal-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-transparent rounded-full opacity-50"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-200 to-transparent rounded-full opacity-50"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Success Content */}
            <div className={`space-y-8 ${showSuccess ? 'success-enter' : 'opacity-0'}`}>
              {/* Robot Celebration */}
              <div className="mb-8">
                <div className="relative inline-block">
                  <Image
                    src="/robot-heart.png"
                    alt="Celebrating Robot"
                    width={140}
                    height={140}
                    className="mx-auto pulse-gentle"
                  />
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-6">
                <h1 className="font-heading text-5xl lg:text-7xl font-normal bg-gradient-to-br from-purple-600 to-teal-600 bg-clip-text text-transparent">
                  You&apos;re in!
                </h1>
                
                <div className="space-y-4">
                  <h2 className="font-heading text-2xl lg:text-4xl font-normal text-gray-800">
                    Welcome to the ChoresAI family! 🏠
                  </h2>
                  
                  <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                    Thank you for joining our waitlist. You&apos;ll be among the first to experience 
                    the future of family chore management!
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="float-up mt-16 bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-white/20 max-w-4xl mx-auto" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-center gap-3 mb-8">
                <h3 className="font-heading text-2xl lg:text-3xl font-normal text-gray-900">
                  What happens next?
                </h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-semibold text-gray-900 mb-2">
                        Verify Your Email
                    </h4>
                    <p className="text-gray-600">
                     Look for an email from <code>hello@mail.getwaitlist.com</code> and click the verification link to confirm your spot.
                    </p>
                  </div>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-semibold text-gray-900 mb-2">
                      Help us spread the word!
                    </h4>
                    <p className="text-gray-600">
                      After verifying, share ChoresAI with friends and family to help us grow our community.
                    </p>
                  </div>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    3
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-semibold text-gray-900 mb-2">
                      Be the first to try it!
                    </h4>
                    <p className="text-gray-600">
                        We&apos;ll notify you as soon as ChoresAI is ready for early access. Get ready to transform your family chore management
                    </p>
                  </div>
                </div>
              </div>
            </div>

            

          </div>
        </div>
      </section>
    </>
  )
}