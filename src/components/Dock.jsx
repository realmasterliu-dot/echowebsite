import { useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { navItems } from '../data/content'
import './Dock.css'

/**
 * Dock — Apple Liquid Glass 风格底部导航栏
 * 固定在页面底部，4个导航项，hover放大+邻近放大效果
 */
export default function Dock() {
  const [activeId, setActiveId] = useState('hero')

  const scrollTo = useCallback((id) => {
    setActiveId(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <nav className="dock" role="navigation" aria-label="主导航">
      <div className="dock__inner">
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
              {activeId === item.id && <span className="dock__indicator" />}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
