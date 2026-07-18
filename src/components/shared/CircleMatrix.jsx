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
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  )

  // 手机端改用紧凑配置：10 圆（5列2行）点亮 6，右侧显示 64
  const cfg = isMobile
    ? { total: 10, fillCount: 6, columns: 5, value: 64 }
    : { total, fillCount, columns, value }

  const circles = Array.from({ length: cfg.total }, (_, i) => ({
    id: i,
    filled: i < cfg.fillCount,
  }))

  // 监听屏幕宽度变化，桌面/手机切换时重渲染
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

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
    // 区间缩短：start/end 提前并压缩，让点阵在进入视口不久就点亮完，不必滑很远
    // showStat 设为「粘性」：一旦数字出现过（进入视口 或 回滚入视），永不再隐藏
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 50%',
        scrub: 1.2,
        onEnter: () => setShowStat(true),     // 向下滚入视口即显示数字（提前出现，不必滑很远）
        onEnterBack: () => setShowStat(true),  // 向上滚回视口内也保持显示（修复「滑到底再上滑 64 消失」）
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
        amount: isMobile ? 0.6 : 1.2,
        from: 'start',
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger && (t.trigger === el || el.contains(t.trigger))) t.kill()
      })
    }
  }, [cfg.total, cfg.fillCount, isMobile])

  return (
    <div className={`circle-matrix${isMobile ? ' circle-matrix--mobile' : ''}`} ref={containerRef}>
      {/* 左侧/上方：圆点矩阵 */}
      <div
        className="circle-matrix__grid"
        style={{
          gridTemplateColumns: `repeat(${cfg.columns}, 1fr)`,
        }}
      >
        {circles.map((c) => (
          <div
            key={c.id}
            className={`circle-matrix__dot${c.filled ? ' circle-matrix__dot--fill' : ' circle-matrix__dot--empty'}`}
          />
        ))}
      </div>

      {/* 右侧/下方：数字（动画完成后显示） */}
      <div className={`circle-matrix__stat${showStat ? ' circle-matrix__stat--visible' : ''}`}>
        <span className="circle-matrix__number">
          {cfg.value}<span className="circle-matrix__suffix">{suffix}</span>
        </span>
        {label && <p className="circle-matrix__label">{label}</p>}
      </div>
    </div>
  )
}
