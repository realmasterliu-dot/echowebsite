import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Grainient from '../shared/Grainient/Grainient'
import './HeroSection.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * HeroSection — 全屏首屏 + Opening Animation
 * 极简左对齐编辑式排版：Logo + 三行 Slogan 遮罩揭开 + 位移归位 + 压缩弹性
 */
export default function HeroSection() {
  const sectionRef = useRef(null)
  const playedRef = useRef(false)

  useEffect(() => {
    if (playedRef.current) return
    playedRef.current = true

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      // 0.0s - Background scale in
      tl.from('.hero__bg', {
        scale: 1.15,
        opacity: 0,
        duration: 1.8,
      }, 0)

      // 0.3s - Logo fade in + slide up
      tl.from('.hero__logo', {
        yPercent: 30,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
      }, 0.35)

      // 0.5s - Slogan lines mask reveal (clip-path) + 位移归位 (yPercent)
      tl.from('.hero__line-inner', {
        yPercent: 112,
        duration: 1.15,
        stagger: 0.16,
        ease: 'power4.out',
      }, 0.6)

      // Subtle kicker fade
      tl.from('.hero__line--kicker .hero__line-inner', {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
      }, 0.6)

      // 2.8s - Subtle compression settle
      tl.to('.hero__content', {
        scale: 0.985,
        duration: 0.12,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1,
      }, 2.8)
    }, sectionRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      <div className="hero__bg">
        <Grainient
          color1="#ff8200"
          color2="#ff5500"
          color3="#fbfbfb"
          timeSpeed={0.55}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2.5}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.04}
          grainScale={0.2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className="hero__content">
        {/* Logo */}
        <div className="hero__logo">
          <img
            src="/logo.jpg"
            alt="écho 有求必应"
            className="hero__logo-img"
          />
        </div>

        {/* Slogan */}
        <h1 className="hero__slogan">
          <span className="hero__line hero__line--kicker">
            <span className="hero__line-inner">我们坚信</span>
          </span>
          <span className="hero__line hero__line--main">
            <span className="hero__line-inner">创意驱动生意</span>
          </span>
          <span className="hero__line hero__line--main">
            <span className="hero__line-inner">
              再小的声音<span className="hero__accent">也值得被听见</span>
            </span>
          </span>
        </h1>
      </div>
    </section>
  )
}
