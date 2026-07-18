import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollReveal from '../shared/ScrollReveal'
import { services } from '../../data/content'
import './BusinessIntro.css'

/**
 * BusinessIntro — 业务介绍（Square Bento Cards）
 * 统一 bento 设计规范：正方形 / 圆角统一 / icon左上角小方块 / hover聚光
 */
export default function BusinessIntro() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const handleMouseEnter = useCallback((i) => setHoveredIndex(i), [])
  const handleMouseLeave = useCallback(() => setHoveredIndex(null), [])

  return (
    <section id="business" className="business-intro section">
      <ScrollReveal>
        <div className="business-intro__header">
          <span className="section-label">OUR SERVICES</span>
          <h2 className="business-intro__title">我们的业务</h2>
        </div>
      </ScrollReveal>

      <div className="business-intro__grid">
        {services.map((service, i) => (
          <ScrollReveal key={service.title} direction="up" delay={i * 0.05}>
            <div
              className={`business-card${hoveredIndex === i ? ' business-card--active' : ''}`}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Spotlight overlay */}
              <div
                className="business-card__spotlight"
                style={{
                  background: hoveredIndex === i
                    ? `radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--color-primary-rgb), 0.08), transparent 60%)`
                    : 'none',
                }}
              />

              {/* Icon — 统一规范：小圆角方块，左上角 */}
              <div className="business-card__icon">
                <FontAwesomeIcon icon={['fas', service.icon]} />
              </div>

              {/* Content area — 底端左对齐 */}
              <div className="business-card__body">
                <h3 className="business-card__title">{service.title}</h3>
                <p className="business-card__desc">{service.desc}</p>
              </div>

              {/* Arrow indicator */}
              <span className="business-card__arrow">→</span>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
