import { useState, useEffect, useCallback, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { navItems } from '../data/content'
import './Dock.css'

/**
 * 固定在页面底部的悬浮玻璃导航栏
 * 固定在页面底部，4个导航项，hover放大+邻近放大效果
 *
 * 行为：
 *  - 当前导航项随滚动位置自动高亮（IntersectionObserver 监听各 section）
 *  - 向下滚动时隐藏，向上滚动或停止滚动时重新出现（首页第一屏始终显示）
 */
export default function Dock() {
  const [activeId, setActiveId] = useState('hero')
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const stopTimer = useRef(null)

  // 1) 当前 section 进入视口中带时，高亮对应导航项
  useEffect(() => {
    const ids = navItems.map((i) => i.id)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      // 仅取视口正中一条窄带：哪一屏跨过中线，就高亮谁
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // 2) 向下滚动隐藏，向上/停止滚动显示（顶部第一屏始终显示）
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      // 首页第一屏：始终显示
      if (y < 80) {
        setHidden(false)
        lastY.current = y
        return
      }
      const goingDown = y > lastY.current
      if (goingDown && y - lastY.current > 3) {
        setHidden(true)
      } else if (!goingDown && lastY.current - y > 3) {
        setHidden(false)
      }
      lastY.current = y
      // 停止滚动（含触底）后重新出现
      clearTimeout(stopTimer.current)
      stopTimer.current = setTimeout(() => setHidden(false), 140)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // 初始化（处理刷新后非顶部的情况）
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(stopTimer.current)
    }
  }, [])

  const scrollTo = useCallback((id) => {
    setActiveId(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <nav
      className={`dock ${hidden ? 'dock--hidden' : ''}`}
      role="navigation"
      aria-label="主导航"
      aria-hidden={hidden}
    >
      <div className="dock__inner">
        <div className="dock__glass" aria-hidden="true" />
        <div className="dock__track">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`dock__item ${activeId === item.id ? 'dock__item--active' : ''}`}
              onClick={() => scrollTo(item.id)}
              aria-label={item.label}
              aria-current={activeId === item.id}
            >
              <span className="dock__icon">
                <FontAwesomeIcon icon={['fas', item.icon]} />
              </span>
              <span className="dock__label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
