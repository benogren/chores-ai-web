'use client'

import { useEffect, useRef } from 'react'

interface Testimonial {
  name: string;
  avatar: string;
  text: string;
}
const testimonials = [
  {
    name: 'sarah.mom',
    avatar: '👩‍🦰',
    text: 'My kids actually WANT to do chores now! The AI verification is spot-on and they love earning real money. Best parenting tool ever! 🙌'
  },
  {
    name: 'DadOfThree',
    avatar: '👨‍💼',
    text: 'BEEN USING CHORESAI FOR 6 MONTHS AND MY HOUSE HAS NEVER BEEN CLEANER! Kids are learning responsibility 🏠✨'
  },
  {
    name: 'modernfamily2024',
    avatar: '👨‍👩‍👧‍👦',
    text: 'I love this app! It helps me teach my kids financial responsibility without overthinking. Plus the AI is so smart and encouraging 💡💖'
  }
]

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
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
      className="testimonial-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 flex items-center justify-center text-lg">
          {testimonial.avatar}
        </div>
        <span className="text-white font-medium">{testimonial.name}</span>
      </div>
      <p className="text-gray-300 leading-relaxed">
        &quot;{testimonial.text}&quot;
      </p>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-teal-600">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl lg:text-5xl font-normal text-white mb-4">
            Thousands of families love us
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}