import { useRef, useEffect } from 'react'
import './BorderGlow.css'

/**
 * BorderGlow — react-bits 风格边缘发光效果
 * 鼠标靠近边缘时产生锥形光晕
 */
export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '255 85 0',
  backgroundColor = 'transparent',
  borderRadius = 24,
  glowRadius = 40,
  glowIntensity = 1.3,
  coneSpread = 25,
  animated = true,
  colors = ['#FF5500', '#FF8200', '#8E49CA'],
}) {
  const divRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    divRef.current.style.setProperty('--mouse-x', `${x}px`)
    divRef.current.style.setProperty('--mouse-y', `${y}px`)

    // Calculate distance to nearest edge
    const distToLeft = x
    const distToRight = rect.width - x
    const distToTop = y
    const distToBottom = rect.height - y
    const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom)

    const intensity = Math.max(0, 1 - minDist / edgeSensity) * glowIntensity
    divRef.current.style.setProperty('--glow-intensity', intensity)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`border-glow ${className}`}
      style={{
        '--glow-color': `rgb(${glowColor})`,
        '--bg-color': backgroundColor,
        '--border-radius': `${borderRadius}px`,
        '--glow-radius': `${glowRadius}px`,
        '--cone-spread': `${coneSpread}deg`,
        ...(animated ? {} : {}),
      }}
    >
      {children}
      {/* Animated border gradient */}
      {animated && (
        <div
          className="border-glow__ring"
          style={{
            '--g1': colors[0] || '#FF5500',
            '--g2': colors[1] || '#FF8200',
            '--g3': colors[2] || '#8E49CA',
          }}
        />
      )}
    </div>
  )
}
