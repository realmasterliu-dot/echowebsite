import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollReveal from '../shared/ScrollReveal'
import FluidGlass from '../shared/FluidGlass'
import { company, closingQuote } from '../../data/content'
import './ContactInfo.css'

/** 咨询号码：与小程序「拨打电话 / 复制号码」按钮使用的是同一个号 */
const CONSULT_NUMBER = '18923282944'
const TOAST_OK = '已复制号码，请移步微信添加好友'
const TOAST_FAIL = `复制失败，请手动添加：${CONSULT_NUMBER}`
const TOAST_DURATION = 2600

/**
 * 复制文本到剪贴板。
 * 优先用异步 Clipboard API；它在非安全上下文（http / file://）或旧浏览器下不可用，
 * 因此保留 execCommand 兜底。两者都失败时返回 false，由调用方显示失败提示——
 * 不能因为「复制了」是预期结果就假装成功，那样用户去微信粘贴时会发现是空的。
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* 落到下面的兜底方案 */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0;'
    document.body.appendChild(ta)
    ta.select()
    ta.setSelectionRange(0, text.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

/**
 * ContactInfo — 联系方式 + 结语文案
 *
 * 「发送咨询」：点击复制咨询号码，并弹出提示气泡。
 * 之所以不直接拨号：桌面端访问时点击 tel: 会唤起 FaceTime / 拨号程序，
 * 对只想加微信的客户是干扰，复制号码更稳妥。
 */
export default function ContactInfo() {
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const handleConsult = useCallback(async () => {
    const ok = await copyToClipboard(CONSULT_NUMBER)
    setToast({ ok, text: ok ? TOAST_OK : TOAST_FAIL })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), TOAST_DURATION)
  }, [])

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

          {/* 点击复制号码并提示（号码可与上方展示的两行不同，以 CONSULT_NUMBER 为准） */}
          <button type="button" className="contact-info__btn" onClick={handleConsult}>
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

      {/* 提示气泡挂在 body 上（portal）：
          外层 FluidGlass / ScrollReveal 的 backdrop-filter 与 transform 会给
          position: fixed 重新生成包含块，写在卡片里气泡就会以卡片为基准定位。 */}
      {toast &&
        createPortal(
          <div
            className={`copy-toast${toast.ok ? '' : ' copy-toast--error'}`}
            role="status"
            aria-live="polite"
          >
            <FontAwesomeIcon
              icon={['fas', toast.ok ? 'circle-check' : 'circle-exclamation']}
              className="copy-toast__icon"
            />
            <span>{toast.text}</span>
          </div>,
          document.body
        )}
    </div>
  )
}
