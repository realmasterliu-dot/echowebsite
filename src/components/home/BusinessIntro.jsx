import { useState, useCallback, useRef, useLayoutEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollReveal from '../shared/ScrollReveal'
import { services } from '../../data/content'
import './BusinessIntro.css'

/**
 * BusinessIntro — 业务介绍（Bento Cards）
 * 统一 bento 设计规范：圆角统一 / icon左上角小方块 / hover聚光
 */
export default function BusinessIntro() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const gridRef = useRef(null)

  const handleMouseEnter = useCallback((i) => setHoveredIndex(i), [])
  const handleMouseLeave = useCallback(() => setHoveredIndex(null), [])

  // 移动端：所有业务卡片等高 = 最高内容卡片（纵向长方形，确保长文案完整显示）
  // 仅 max-width:768px 生效；尺寸由最长文案卡片决定，所有卡片统一为该高度
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const mq = window.matchMedia('(max-width: 768px)')
    let raf = 0

    const equalize = () => {
      if (!mq.matches) {
        grid.style.removeProperty('--biz-card-h')
        return
      }
      // 先释放固定高度，测出每张卡片真实自然高度
      grid.style.removeProperty('--biz-card-h')
      void grid.offsetHeight // 强制重排
      const cards = grid.querySelectorAll('.business-card')
      let max = 0
      cards.forEach((c) => { max = Math.max(max, c.offsetHeight) })
      if (max > 0) grid.style.setProperty('--biz-card-h', `${max}px`)
    }

    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(equalize)
    }

    equalize()
    mq.addEventListener('change', schedule)
    window.addEventListener('resize', schedule)
    // 字体加载完成后高度可能变化，再校准一次（无定时器闪烁）
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule)

    return () => {
      cancelAnimationFrame(raf)
      mq.removeEventListener('change', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <section id="business" className="business-intro section">
      <ScrollReveal>
        <div className="business-intro__header">
          <span className="section-label">OUR SERVICES</span>
          <h2 className="business-intro__title">我们的业务</h2>
        </div>
      </ScrollReveal>

      <div className="business-intro__grid" ref={gridRef}>
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
