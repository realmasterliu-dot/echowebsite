import { useRef, useEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollReveal from '../shared/ScrollReveal'
import CountUp from '../shared/CountUp'
import SpotlightCard from '../shared/SpotlightCard'
import CircleMatrix from '../shared/CircleMatrix'
import { whySections } from '../../data/content'
import './AboutSection.css'

/**
 * AboutSection — 了解更多
 * 4个子板块：品牌 / 本地生活 / 商业IP / 选择我们
 */
export default function AboutSection() {
  return (
    <section id="about" className="about section">
      <ScrollReveal>
        <div className="about__header">
          <span className="section-label">DISCOVER MORE</span>
          <h2 className="section-title-en">WHY</h2>
        </div>
      </ScrollReveal>

      <div className="about__sections">
        {whySections.map((section, idx) => (
          <AboutBlock key={section.id} section={section} index={idx} />
        ))}
      </div>
    </section>
  )
}

function AboutBlock({ section, index }) {
  const isEven = index % 2 === 0

  return (
    <div className={`about__block about__block--${isEven ? 'left' : 'right'}`}>
      <ScrollReveal direction={isEven ? 'left' : 'right'} distance={80}>
        <div className="about__block-label">{section.subtitle}</div>
        <h3 className="about__block-title">{section.title}</h3>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.15}>
        <div className="about__block-content">
          {/* Stat — 普通数字 */}
          {section.stat && (
            <div className="about__stat">
              <CountUp
                value={section.stat.value}
                suffix={section.stat.suffix}
                label={section.stat.label}
                size={section.stat.size}
              />
            </div>
          )}

          {/* Circle Matrix (brand block — 64圆点动画) */}
          {section.circleMatrix && (
            <CircleMatrix
              value={section.circleMatrix.value}
              suffix={section.circleMatrix.suffix}
              label={section.circleMatrix.label}
              fillCount={section.circleMatrix.fillCount}
              total={section.circleMatrix.total}
              columns={section.circleMatrix.columns}
            />
          )}

          {/* Data points (e.g. brand block) */}
          {section.dataPoints && (
            <div className="about__datapoints">
              {section.dataPoints.map((d, i) => (
                <div key={i} className="about__datapoint">
                  <CountUp
                    value={d.value}
                    suffix={d.suffix}
                    decimals={d.decimals || 0}
                    label={d.label}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Growth chart animated bar chart (local life) */}
          {section.growthChart && <GrowthChart data={section.growthChart} />}

          {/* IP bento cards (commercial IP block — 4 big number cards) */}
          {section.ipBentos && (
            <div className="about__ip-bento-grid">
              {section.ipBentos.map((b, i) => (
                <ScrollReveal key={i} direction="up" delay={0.1 + i * 0.1}>
                  <SpotlightCard
                    className="about__ip-bento"
                    spotlightColor="rgba(255, 85, 0, 0.18)"
                  >
                    <span className="about__ip-bento-value">{b.value}</span>
                    <p className="about__ip-bento-desc">{b.desc}</p>
                  </SpotlightCard>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Purple bento section with sub-heading */}
          {(section.subHeading || section.purpleBentos) && (
            <div className="about__purple-section">
              {section.subHeading && (
                <ScrollReveal direction="up" delay={0.1}>
                  <p className="about__purple-subheading">{section.subHeading}</p>
                </ScrollReveal>
              )}
              {section.purpleBentos && (
                <div className="about__purple-bento-grid">
                  {section.purpleBentos.map((b, i) => (
                    <ScrollReveal key={i} direction="up" delay={0.1 + i * 0.08}>
                      <SpotlightCard
                        className="about__purple-bento"
                        spotlightColor="rgba(142, 73, 202, 0.25)"
                      >
                        <div className="about__purple-bento-icon">
                          <FontAwesomeIcon icon={['fas', b.icon]} />
                        </div>
                        <h4 className="about__purple-bento-title">{b.title}</h4>
                        <p className="about__purple-bento-desc">{b.desc}</p>
                      </SpotlightCard>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Multiple stats */}
          {section.stats && (
            <div className="about__stats-grid">
              {section.stats.map((s, i) => (
                <div key={i} className="about__stat-card">
                  <CountUp value={s.value} suffix={s.suffix} label={s.label} />
                </div>
              ))}
            </div>
          )}

          {/* Points list */}
          {section.points && (
            section.points.some((p) => p.icon) ? (
              <div className="about__points-bento">
                {section.points.map((point, i) => (
                  <SpotlightCard
                    key={i}
                    className="about__point-bento"
                    spotlightColor="rgba(255, 85, 0, 0.16)"
                  >
                    <div className="about__point-bento-icon">
                      <FontAwesomeIcon icon={['fas', point.icon]} />
                    </div>
                    <h4 className="about__point-bento-title">{point.title}</h4>
                    <p className="about__point-bento-desc">{point.desc}</p>
                  </SpotlightCard>
                ))}
              </div>
            ) : (
              <div className="about__points">
                {section.points.map((point, i) => (
                  <div key={i} className="about__point">
                    <span className="about__point-title">{point.title}</span>
                    <p className="about__point-desc">{point.desc}</p>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Result bento cards (choose us — 4 data cards with big number) */}
          {section.resultBentos && (
            <div className="about__result-bento-grid">
              {section.resultBentos.map((b, i) => (
                <ScrollReveal key={i} direction="up" delay={0.1 + i * 0.1}>
                  <SpotlightCard
                    className="about__result-bento"
                    spotlightColor="rgba(255, 85, 0, 0.14)"
                  >
                    <CountUp
                      value={b.value}
                      suffix={b.suffix}
                      label={b.desc}
                      size="md"
                    />
                  </SpotlightCard>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Values grid (for choose us) — icon bento cards, left-aligned */}
          {section.values && (
            <div className="about__values-grid">
              {section.values.map((v, i) => (
                <SpotlightCard
                  key={i}
                  className="about__value-card about__value-bento"
                  spotlightColor="rgba(255, 85, 0, 0.14)"
                >
                  <div className="about__value-icon">
                    <FontAwesomeIcon icon={['fas', v.icon]} />
                  </div>
                  <h4 className="about__value-title">{v.title}</h4>
                  <p className="about__value-desc">{v.desc}</p>
                </SpotlightCard>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Divider */}
      {index < whySections.length - 1 && <div className="about__divider" />}
    </div>
  )
}

/**
 * GrowthChart — 动画柱状图（带数字滚动）
 * 滚动到视口后逐个弹出柱体 + 数字从0滚到目标值
 */
function GrowthChart({ data }) {
  const containerRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const valueRefs = useRef([])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // 数字滚动动画 — 当 visible 时触发
  useEffect(() => {
    if (!visible) return

    valueRefs.current.forEach((ref, i) => {
      if (!ref) return
      const target = data[i]?.value || 0
      // 简单的整数滚动（亿级数字不需要小数）
      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.5,
        delay: i * 0.18 + 0.5,
        ease: 'power2.out',
        onUpdate: function () {
          const current = Math.round(this.targets()[0].val)
          ref.textContent = (data[i].display?.includes('万亿')
            ? (current >= 10000 ? '万亿+' : `${current}亿`)
            : `${current}亿`)
        },
      })
    })
  }, [visible]) // eslint-disable-line react-hooks/exhaustive-deps

  // 找最大值用于计算比例
  const maxVal = Math.max(...data.map((d) => d.value))

  return (
    <div className={`growth-chart${visible ? ' growth-chart--active' : ''}`} ref={containerRef}>
      <div className="growth-chart__bars">
        {data.map((item, i) => {
          const heightPercent = (item.value / maxVal) * 100
          return (
            <div key={item.label} className="growth-chart__bar-wrap">
              <span
                className="growth-chart__value"
                style={{ transitionDelay: `${i * 0.18 + 0.4}s` }}
                ref={(el) => valueRefs.current[i] = el}
              >
                {item.display || `${item.value}`}
              </span>
              <div className="growth-chart__bar-track">
                <div
                  className={`growth-chart__bar${visible ? ' growth-chart__bar--grow' : ''}`}
                  style={{
                    '--target-height': `${heightPercent}%`,
                    '--delay': `${i * 0.18}s`,
                  }}
                />
              </div>
              <span className="growth-chart__label">{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
