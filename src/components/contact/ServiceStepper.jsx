import { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { serviceProcess } from '../../data/content'
import './ServiceStepper.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * ServiceStepper — 服务流程 6步
 * 序号在 bento 之外纵向排列（123456），右侧为宽 bento 卡片
 */
export default function ServiceStepper() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.stepper-row', {
        x: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.service-process',
          start: 'top 72%',
          once: true,
        },
      })
    }, containerRef.current)

    return () => ctx.revert()
  }, [])

  return (
    <div className="service-process" ref={containerRef}>
      {/* 纵向列表：序号在box外，box在右侧 */}
      <div className="stepper-list">
        {serviceProcess.map((item) => (
          <div key={item.step} className="stepper-row">
            {/* 序号 — 在 bento 之外 */}
            <span className="stepper-row__number">{String(item.step).padStart(2, '0')}</span>

            {/* 宽 bento 卡片 */}
            <div className="stepper-bento">
              {item.icon && (
                <div className="stepper-bento__icon">
                  <FontAwesomeIcon icon={['fas', item.icon]} />
                </div>
              )}
              <div className="stepper-bento__content">
                <h4 className="stepper-bento__title">{item.title}</h4>
                <p className="stepper-bento__desc">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
