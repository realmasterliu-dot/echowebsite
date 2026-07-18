import ScrollReveal from '../shared/ScrollReveal'
import GrainientBg from '../shared/GrainientBg'
import './ContactCTA.css'

/**
 * ContactCTA — 首页联系入口
 * 大面积CTA引导到联系我们section
 */
export default function ContactCTA() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="contact-cta">
      <GrainientBg variant="warm" className="contact-cta__bg" />

      <ScrollReveal>
        <div className="contact-cta__content">
          <span className="section-label contact-cta__label">GET IN TOUCH</span>
          <h2 className="contact-cta__title">
            准备好让品牌
            <br />
            <span className="text-gradient">焕然一新</span>？
          </h2>
          <p className="contact-cta__desc">
            不论您今天因为什么业务需求找到我们，<br />
            我们都时刻准备着，为您提供最真诚的支持。
          </p>

          <button className="contact-cta__btn" onClick={scrollToContact}>
            <span>立即咨询</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </ScrollReveal>
    </section>
  )
}
