import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollReveal from '../shared/ScrollReveal'
import BorderGlow from '../shared/BorderGlow'
import { pricingPlans } from '../../data/content'
import './PricingGrid.css'

/**
 * PricingGrid — 价格套餐
 * 4张卡片：light / orange(最受欢迎) / light / dark(旗舰领航)
 * BorderGlow 边缘流光 + 圆点 feature 列表
 */
export default function PricingGrid() {
  return (
    <section id="pricing" className="pricing section">
      <ScrollReveal>
        <div className="pricing__header">
          <span className="section-label">PRICING</span>
          <h2 className="section-title-zh">选择最适合你的方案</h2>
        </div>
      </ScrollReveal>

      <div className="pricing__grid">
        {pricingPlans.map((plan, i) => (
          <ScrollReveal key={plan.id} direction="up" delay={i * 0.1}>
            <PricingCard plan={plan} index={i} />
          </ScrollReveal>
        ))}
      </div>
    </section>
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
