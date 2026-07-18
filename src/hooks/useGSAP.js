import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useGSAP — GSAP ScrollTrigger 封装
 * 自动管理注册/销毁，避免内存泄漏
 *
 * @param {Function} callback - 接收 (triggerEl, tl) 的回调
 * @param {Object} options - 传递给ScrollTrigger的选项
 * @param {Array} deps - 依赖项
 */
export function useGSAP(callback, options = {}, deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      callback(el, gsap)
    }, el)

    return () => ctx.revert()
  }, deps)

  return ref
}

/**
 * useScrollTrigger — 简单滚动触发器
 */
export function useScrollTrigger(animFn, options = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const trigger = Object.assign(
      {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      options
    )

    const ctx = gsap.context(() => {
      animFn(el, gsap, trigger)
    }, el)

    return () => ctx.revert()
  }, [])

  return ref
}

export default useGSAP
