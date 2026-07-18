import { useState, useEffect, useRef } from 'react'

/**
 * useCountUp — 数字滚动动画 Hook
 *
 * @param {number} target - 目标数字
 * @param {number} duration - 动画时长(ms)，默认2000
 * @param {number} decimals - 小数位数，默认0
 */
export function useCountUp(target, duration = 2000, decimals = 0) {
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!started) return

    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)

      // easeOutExpo for premium feel
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(eased * target)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [target, duration, started])

  // IntersectionObserver to trigger on scroll into view
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true)
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  return { value: value.toFixed(decimals), ref, started }
}
