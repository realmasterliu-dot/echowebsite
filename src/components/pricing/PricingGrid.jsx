import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollReveal from '../shared/ScrollReveal'
import BorderGlow from '../shared/BorderGlow'
import { pricingPlans, videoPricingPlans, pricingPlanTabs } from '../../data/content'
import './PricingGrid.css'

/**
 * PricingGrid — 价格套餐
 * 顶部「全案套餐 / 仅视频套餐」滑块切换器 + 4张卡片
 * 全案：light / orange(最受欢迎) / light / dark(旗舰领航)
 * 仅视频：4张统一 light、无角标（不含探店与笔记两段内容）
 * BorderGlow 边缘流光 + 勾选 feature 列表
 */
export default function PricingGrid() {
  // 默认展示全案套餐；切换只换数据源，不改卡片样式与排版
  const [planTab, setPlanTab] = useState('full')
  const gridRef = useRef(null)

  const plans = planTab === 'video' ? videoPricingPlans : pricingPlans

  const handleTabChange = (value) => {
    if (value === planTab) return
    setPlanTab(value)
    // 窄屏（≤768px）网格会变成横向滚动列表，切换后回到第一张卡
    if (gridRef.current) gridRef.current.scrollLeft = 0
  }

  return (
    <section id="pricing" className="pricing section">
      <ScrollReveal>
        <div className="pricing__header">
          <span className="section-label">PRICING</span>
          <h2 className="section-title-zh">选择最适合你的方案</h2>
        </div>
      </ScrollReveal>

      <PricingPlanSwitch value={planTab} options={pricingPlanTabs} onChange={handleTabChange} />

      <div className="pricing__grid" ref={gridRef}>
        {/*
          key 用下标而非 plan.id：切换套餐时若重新挂载 ScrollReveal，
          新挂载的容器会被 gsap.set 设成 opacity:0，要等下一次滚动事件才淡入，
          用户会看到一片空白。用稳定 key 让外层不重挂载、只换卡片内容
          （卡片配色由 plan.theme → BorderGlow 内联样式驱动，会正常刷新）。
        */}
        {plans.map((plan, i) => (
          <ScrollReveal key={i} direction="up" delay={i * 0.1}>
            <PricingCard plan={plan} index={i} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

/**
 * PricingPlanSwitch — 套餐切换器（滑块式分段控件）
 *
 * ⚠️ 两个选项必须固定等宽：外层轨道宽度是由内容撑开的（fit-content），
 * 若选项用 flex:1 平分，会按各自文字长度分配宽度 ——「全案套餐」4字比
 * 「仅视频套餐」5字窄，而滑块宽度是按轨道等分算的，两者中心就对不上，
 * 看起来就是「文字没在橙色按钮中间」。故这里固定 120px。
 * 尺寸：2×120 + 3×2(padding) + 1×2(border) = 248px，滑块 calc 恰好 = 120px。
 */
function PricingPlanSwitch({ value, options, onChange }) {
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )

  return (
    <div className="plan-switch">
      <div className={`plan-switch__track plan-switch__track--n${options.length}`}>
        <span
          className="plan-switch__thumb"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
          aria-hidden="true"
        />
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`plan-switch__item${opt.value === value ? ' plan-switch__item--active' : ''}`}
            onClick={() => onChange(opt.value)}
            aria-pressed={opt.value === value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function PricingCard({ plan }) {
  const isOrange = plan.theme === 'orange'
  const isPurple = plan.theme === 'purple'
  const isDark = plan.theme === 'dark'

  const glowColors = isDark
    ? ['#fdefb5', '#FFF4D6', '#F5D98A']
    : isPurple
      ? ['#8E49CA', '#A55FD0', '#6B35A0']
      : isOrange
        ? ['#FF8200', '#FF5500', '#FFB340']
        : ['#FF5500', '#FF8200', '#FFB340']

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor={
        isDark ? '212 175 55'
          : isPurple ? '142 73 202'
            : '255 85 0'
      }
      backgroundColor={
        isDark ? 'transparent'
          : isPurple ? '#FBF5FF'
            : isOrange ? '#FFF3EC' : '#FFFFFF'
      }
      borderRadius={24}
      glowRadius={40}
      glowIntensity={1.2}
      coneSpread={25}
      animated
      colors={glowColors}
    >
      <article
        className={`price-card ${isOrange ? 'price-card--orange' : ''} ${isPurple ? 'price-card--purple' : ''} ${isDark ? 'price-card--dark' : ''}`}
      >
        {/* Badge */}
        {plan.badge && (
          <span className={`price-card__badge ${isOrange ? 'price-card__badge--orange' : ''} ${isPurple || isDark ? 'price-card__badge--purple' : ''}`}>
            {plan.badge}
          </span>
        )}

        {/* Name + Price */}
          <div className="price-card__header">
          <h3 className="price-card__name">{plan.name}</h3>
          <div className="price-card__price">
            <span className={`price-card__amount${isDark ? ' price-card__amount--gold' : ''}`}>{plan.price.toLocaleString()}</span>
            <span className="price-card__period">{plan.period}</span>
          </div>
        </div>

        {/* Description */}
        <p className={`price-card__desc ${isDark ? 'price-card__desc--light' : ''}`}>{plan.description}</p>

        {/* Feature list — checkmarks, optional dividers */}
        <ul className="price-card__features">
          {plan.features.map((f, i) => {
            if (f.divider) {
              return <li key={i} className="price-card__divider" />;
            }
            const showGold = isDark && !f.disabled
            return (
              <li
                key={i}
                className={`price-card__feature${f.disabled ? ' price-card__feature--disabled' : ''}`}
              >
                {showGold ? (
                  <svg
                    className="price-card__check price-card__check--gold"
                    viewBox="0 0 16 16"
                    fill="none"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="priceGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C9A227" />
                        <stop offset="50%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#C9A227" />
                      </linearGradient>
                    </defs>
                    <path d="M3 8L6.5 11.5L13 4.5" stroke="url(#priceGoldGrad)" />
                  </svg>
                ) : (
                  <svg
                    className={`price-card__check${f.disabled ? ' price-card__check--disabled' : ''}${isDark && !f.disabled ? ' price-card__check--white' : ''}${isOrange && !f.disabled ? ' price-card__check--orange' : ''}`}
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M3 8L6.5 11.5L13 4.5" />
                  </svg>
                )}
                <span>{f.text}</span>
              </li>
            );
          })}
        </ul>

        {/* Bonus footer */}
        {plan.bonus && (
          <p className={`price-card__bonus ${isDark ? 'price-card__bonus--light' : ''}`}>{plan.bonus}</p>
        )}
      </article>
    </BorderGlow>
  )
}
