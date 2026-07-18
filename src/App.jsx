import { useEffect } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import Dock from './components/Dock'
import HeroSection from './components/home/HeroSection'
import CompanyIntro from './components/home/CompanyIntro'
import BusinessIntro from './components/home/BusinessIntro'
import ContactCTA from './components/home/ContactCTA'
import AboutSection from './components/about/AboutSection'
import PricingGrid from './components/pricing/PricingGrid'
import ServiceStepper from './components/contact/ServiceStepper'
import ContactInfo from './components/contact/ContactInfo'
import GrainientBg from './components/shared/GrainientBg'

// Register all icons
library.add(fas, fab)

export default function App() {
  // Active nav tracking via IntersectionObserver
  useEffect(() => {
    const sections = ['hero', 'about', 'pricing', 'process', 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            // Update active nav by dispatching custom event
            window.dispatchEvent(new CustomEvent('section-active', { detail: entry.target.id }))
          }
        })
      },
      { threshold: [0.2, 0.5] }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="app">
      {/* ===== HOME SECTION ===== */}
      <HeroSection />

      {/* Company Intro */}
      <div className="container">
        <CompanyIntro />
      </div>

      {/* Business Services */}
      <div className="container">
        <BusinessIntro />
      </div>

      {/* CTA Bridge */}
      <ContactCTA />

      {/* ===== ABOUT SECTION ===== */}
      <div className="container">
        <AboutSection />
      </div>

      {/* ===== PRICING SECTION ===== */}
      <div className="container">
        <PricingGrid />
      </div>

      {/* ===== SERVICE PROCESS（独立板块） ===== */}
      <section id="process" className="service-process section">
        <div className="container">
          <ScrollHeader title="PROCESS" subtitle="服务流程" />
          <ServiceStepper />
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="contact section">
        <div className="container">
          <ScrollHeader title="CONTACT" subtitle="联系我们" />
          <div style={{ marginTop: 'var(--space-xl)' }}>
            <ContactInfo />
          </div>
        </div>
      </section>

      {/* Footer spacing for dock */}
      <div style={{ height: 'calc(var(--dock-height) + 40px)' }} />

      {/* Dock Navigation (fixed bottom) */}
      <Dock />
    </div>
  )
}

// Reusable section header
function ScrollHeader({ title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
      <span className="section-label">{title}</span>
      <h2 className="section-title-zh">{subtitle}</h2>
    </div>
  )
}
