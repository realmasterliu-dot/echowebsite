import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollReveal.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * ScrollReveal — 滚动揭示组件
 * 子元素在进入视口时触发动画
 *
 * Props:
 * - direction: 'up' | 'down' | 'left' | 'right' | 'fade'
 * - distance: px距离，默认60
 * - duration: 动画时长(s)，默认0.8
 * - stagger: 子元素间隔(s)，默认0
 * - delay: 延迟(s)，默认0
 */
export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  distance = 60,
  duration = 0.8,
  stagger = 0,
  delay = 0,
  threshold = 0.15,
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const getTransform = () => {
      switch (direction) {
        case 'up': return `translateY(${distance}px)`
        case 'down': return `translateY(-${distance}px)`
        case 'left': return `translateX(${distance}px)`
        case 'right': return `translateX(-${distance}px)`
        default: return 'none'
      }
    }

    // Set initial state
    const targets = stagger > 0 ? el.children : [el]
    gsap.set(targets, {
      opacity: 0,
      transform: getTransform(),
    })

    // Create scroll trigger
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          x: 0,
          y: 0,
          transform: 'none',
          duration,
          ease: 'power3.out',
          stagger,
          delay,
        })
      },
      once: true,
    })

    return () => trigger.kill()
  }, [direction, distance, duration, stagger, delay, threshold])

  return (
    <div ref={containerRef} className={`scroll-reveal ${className}`}>
      {children}
    </div>
  )
}
