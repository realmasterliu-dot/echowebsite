import { useCountUp } from '../../hooks/useCountUp'
import './CountUp.css'

/**
 * CountUp — 数字滚动动画组件
 * 滚动到视口时从0滚动到目标值
 */
export default function CountUp({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2000,
  label,
  size,
}) {
  const { value: displayedValue, ref } = useCountUp(value, duration, decimals)

  return (
    <div className={`count-up${size ? ` count-up--${size}` : ''}`} ref={ref}>
      <span className="count-up__number">
        <span className="count-up__prefix">{prefix}</span>
        {displayedValue}
        <span className="count-up__suffix">{suffix}</span>
      </span>
      {label && <span className="count-up__label">{label}</span>}
    </div>
  )
}
