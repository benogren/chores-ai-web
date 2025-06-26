'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface Feature {
    id: string;
    title: string;
    description: string;
    image: string;
    icon: string;
}

const features = [
  {
    id: 'ai-verification',
    title: 'AI Photo Verification',
    description: 'Snap a photo with ChoresAI, and our AI analyzes chore completion. Get instant feedback and approval for completed tasks with encouraging guidance.',
    image: '/choresai-photo.png',
    icon: '📸'
  },
  {
    id: 'age-appropriate',
    title: 'Age-Appropriate Tasks',
    description: 'ChoresAI suggests tasks tailored to each child\'s age and abilities. From simple chores for toddlers to complex tasks for teens, we help build responsibility step by step.',
    image: '/choresai-age.png',
    icon: '👶'
  },
  {
    id: 'digital-wallets',
    title: 'Smart Digital Wallets',
    description: 'Automatic payments to kids\' digital wallets upon chore completion. Track earnings, spending, and teach financial responsibility effortlessly.',
    image: '/choresai-wallet.png',
    icon: '💰'
  },
  {
    id: 'parent-control',
    title: 'Parent Control & Oversight',
    description: 'Complete visibility and control over chore assignments, AI decisions, and family progress. Review, approve, or adjust any chore completion.',
    image: '/choresai-parent.png',
    icon: '👨‍👩‍👧‍👦'
  }
  // {
  //   id: 'progress-tracking',
  //   title: 'Family Progress Tracking',
  //   description: 'Monitor your family\'s chore completion rates, earnings trends, and achievement milestones. Celebrate success and identify areas for improvement.',
  //   image: '/choresai-progress.png',
  //   icon: '📊'
  // }
]

interface FeatureCardProps {
  feature: Feature;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

function FeatureCard({ feature, index, isActive, onClick }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`feature-card cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'border-purple-500 shadow-lg bg-gradient-to-r from-purple-50 to-teal-50' 
          : 'hover:border-gray-300'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white' 
            : 'bg-gray-100'
        }`}>
          {feature.icon}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-heading text-xl font-semibold mb-3 transition-colors duration-300 ${
            isActive ? 'text-purple-900' : 'text-gray-900'
          }`}>
            {feature.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {feature.description}
          </p>
        </div>

        {/* Active indicator */}
        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
          isActive ? 'bg-purple-500' : 'bg-transparent'
        }`} />
      </div>
    </div>
  )
}

export default function Features() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleFeatureClick = (index: number) => {
    if (index !== activeFeatureIndex) {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveFeatureIndex(index)
        setIsTransitioning(false)
      }, 150)
    }
  }

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl lg:text-5xl font-normal text-gray-900 mb-4">
            What does ChoresAI include?
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Phone Image */}
          <div className="w-full">
              <div className={`transition-all duration-300 ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}>
                <Image
                  src={features[activeFeatureIndex].image}
                  width={379}
                  height={700}
                  alt={`${features[activeFeatureIndex].title} Mockup`}
                  className="mx-auto mb-4 object-contain animate-float"
                  priority={activeFeatureIndex === 0}
                />
              </div>
          </div>

          {/* Right Column - Interactive Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.id} 
                feature={feature} 
                index={index}
                isActive={index === activeFeatureIndex}
                onClick={() => handleFeatureClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Feature Indicators */}
        <div className="flex justify-center mt-12 gap-3">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => handleFeatureClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeFeatureIndex 
                  ? 'bg-purple-500 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}