import { useRef } from 'react'
import './SpotlightCard.css'

/**
 * SpotlightCard — react-bits 风格聚光灯卡片
 * 鼠标移动时跟随光斑，默认品牌橙色
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 85, 0, 0.15)',
}) {
  const divRef = useRef(null)

  const handleMouseMove = (e) => {
    const rect = divRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    divRef.current.style.setProperty('--mouse-x', `${x}px`)
    divRef.current.style.setProperty('--mouse-y', `${y}px`)
    divRef.current.style.setProperty('--spotlight-color', spotlightColor)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`card-spotlight ${className}`}
    >
      {children}
    </div>
  )
}
