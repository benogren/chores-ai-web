'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface Benefit {
    icon: string;
    title: string;
    description: string;
}

const benefits = [
  {
    icon: '/robot-clock.png',
    title: 'Save Your Time',
    description: 'ChoresAI automatically verifies chore completion and processes payments. No more manual checking or tracking – focus on what matters most while your kids learn responsibility.'
  },
  {
    icon: '/robot-heart.png',
    title: 'Build Family Bonds',
    description: 'ChoresAI brings families together through shared goals and achievements. Celebrate successes, support each other, and create positive habits that last a lifetime.'
  },
  {
    icon: '/robot-money.png',
    title: 'Teach Life Skills Effortlessly',
    description: 'Watch your kids develop responsibility, work ethic, and financial literacy through engaging, AI-powered chore management. Learning disguised as earning!'
  }
]

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
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
      className="benefit-card"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="text-4xl mb-6">
        <Image
          src={`${benefit.icon}`}
          alt={benefit.title}
          width={70}
          height={70}
          className="mx-auto mb-4 object-contain animate-float"
        />
      </div>
      <h3 className="font-heading text-xl font-semibold text-gray-900 mb-4">
        {benefit.title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {benefit.description}
      </p>
    </div>
  )
}

export default function Benefits() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl lg:text-5xl font-normal text-gray-900 mb-4">
            Why choose ChoresAI?
          </h2>
          <p className="text-xl text-gray-600">
            ChoresAI is the most advanced family chore management platform.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}