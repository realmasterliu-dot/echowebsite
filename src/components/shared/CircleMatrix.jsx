import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './CircleMatrix.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * CircleMatrix — 64 圆点矩阵动画
 * 滚动触发：从左上到右下逐个点亮橙色 + 光晕，全部完成后显示百分比数字
 *
 * @param {number} total - 总圆点数（默认 64）
 * @param {number} fillCount - 需要点亮的数量（默认 64）
 * @param {number} value - 最终显示的数值（默认 64）
 * @param {string} suffix - 后缀（默认 '%'）
 * @param {string} label - 说明文字
 */
export default function CircleMatrix({
  total = 100,
  fillCount = 64,
  value = 64,
  suffix = '%',
  label = '',
  columns = 20,
}) {
  const containerRef = useRef(null)
  const [showStat, setShowStat] = useState(false)

  const rows = Math.ceil(total / columns)
  const circles = Array.from({ length: total }, (_, i) => ({
    id: i,
    filled: i < fillCount,
  }))

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // 所有圆点初始灰色
    const circleEls = el.querySelectorAll('.circle-matrix__dot--fill')
    gsap.set(circleEls, {
      backgroundColor: '#e5e5e5',
      boxShadow: 'none',
      scale: 0.85,
      opacity: 0.4,
    })

    // 逐个点亮动画 — 从左上到右下
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'top 40%',
        scrub: 1.5,
        once: true,
        onLeave: () => setShowStat(true), // 动画结束后显示数字
      },
    })

    tl.to(circleEls, {
      backgroundColor: '#FF5500',
      boxShadow: '0 0 12px rgba(255, 85, 0, 0.5), 0 0 24px rgba(255, 85, 0, 0.2)',
      scale: 1,
      opacity: 1,
      duration: 0.08,
      ease: 'power2.out',
      stagger: {
        amount: 1.2,
        from: 'start',
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger && (t.trigger === el || el.contains(t.trigger))) t.kill()
      })
    }
  }, [total])

  return (
    <div className="circle-matrix" ref={containerRef}>
      {/* 左侧：圆点矩阵 */}
      <div
        className="circle-matrix__grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {circles.map((c) => (
          <div
            key={c.id}
            className={`circle-matrix__dot${c.filled ? ' circle-matrix__dot--fill' : ' circle-matrix__dot--empty'}`}
          />
        ))}
      </div>

      {/* 右侧：数字（动画完成后显示） */}
      <div className={`circle-matrix__stat${showStat ? ' circle-matrix__stat--visible' : ''}`}>
        <span className="circle-matrix__number">
          {value}<span className="circle-matrix__suffix">{suffix}</span>
        </span>
        {label && <p className="circle-matrix__label">{label}</p>}
      </div>
    </div>
  )
}
