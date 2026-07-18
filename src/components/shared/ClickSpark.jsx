import { useCallback, useEffect, useRef } from 'react'
import './ClickSpark.css'

/**
 * ClickSpark — 点击火花粒子效果
 * 在容器内点击时产生粒子爆发效果
 */
export default function ClickSpark({
  children,
  className = '',
  sparkColor = 'var(--color-primary)',
  count = 12,
}) {
  const containerRef = useRef(null)

  const createSparks = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (let i = 0; i < count; i++) {
      const spark = document.createElement('span')
      spark.className = 'click-spark__particle'

      // Random direction
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8
      const distance = 30 + Math.random() * 50
      const tx = Math.cos(angle) * distance
      const ty = Math.sin(angle) * distance

      spark.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        background: ${sparkColor};
        --tx: ${tx}px;
        --ty: ${ty}px;
        animation: sparkParticle 0.6s ease-out forwards;
        animation-delay: ${Math.random() * 0.1}s;
      `

      containerRef.current.appendChild(spark)
      setTimeout(() => spark.remove(), 800)
    }
  }, [count, sparkColor])

  return (
    <div
      ref={containerRef}
      className={`click-spark ${className}`}
      onClick={createSparks}
    >
      {children}
    </div>
  )
}
