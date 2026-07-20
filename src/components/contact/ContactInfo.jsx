import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollReveal from '../shared/ScrollReveal'
import FluidGlass from '../shared/FluidGlass'
import { company, closingQuote } from '../../data/content'
import './ContactInfo.css'

/**
 * ContactInfo — 联系方式 + 结语文案
 */
export default function ContactInfo() {
  return (
    <div className="contact-info">
      <ScrollReveal>
        {/* Company card */}
        <FluidGlass className="contact-info__card" intensity="medium" glow>
          <div className="contact-info__brand">
            <img src="/logo-horizontal.png" alt="有求必应品牌策划有限公司" className="contact-info__logo" />
            <span className="contact-info__name">{company.name}</span>
          </div>

          <div className="contact-info__details">
            <div className="contact-info__phones">
              <FontAwesomeIcon icon={['fas', 'phone']} className="contact-info__icon" />
              <span className="contact-info__person">创意总监 卢慧允</span>
              <span className="contact-info__phone">189 0307 3765</span>

              <FontAwesomeIcon icon={['fas', 'phone']} className="contact-info__icon" />
              <span className="contact-info__person">创意总监 刘昊</span>
              <span className="contact-info__phone">189 2328 2944</span>
            </div>
          </div>

          <button className="contact-info__btn">
            <FontAwesomeIcon icon={['fas', 'paper-plane']} />
            <span>发送咨询</span>
          </button>
        </FluidGlass>
      </ScrollReveal>

      {/* Closing quote */}
      <ScrollReveal direction="up">
        <div className="contact-info__closing">
          <h3 className="contact-info__closing-title">
            {closingQuote.title.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </h3>
          <p className="contact-info__closing-text">{closingQuote.content}</p>
          <p className="contact-info__closing-subtext">{closingQuote.subtext}</p>
        </div>
      </ScrollReveal>
    </div>
  )
}
