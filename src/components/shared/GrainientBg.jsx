import './GrainientBg.css'

/**
 * GrainientBg — 噪点渐变背景组件
 * SVG噪点纹理 + 渐变叠加
 */
export default function GrainientBg({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'linear-gradient(135deg, #FFF8F2 0%, #FFFBF5 40%, #FAF6FF 100%)',
    dark: 'linear-gradient(135deg, #1a1614 0%, #241A12 50%, #1E1520 100%)',
    warm: 'linear-gradient(135deg, #FFF5EE 0%, #FFF0E3 30%, #FFF7F2 100%)',
    orange: 'linear-gradient(135deg, #FF5500 0%, #FF8200 60%, #8E49CA 100%)',
    soft: 'linear-gradient(160deg, rgba(255,85,0,0.06) 0%, rgba(142,73,202,0.04) 50%, rgba(255,130,0,0.05) 100%)',
  }

  return (
    <div className={`grainient-bg grainient-bg--${variant} ${className}`}>
      <div
        className="grainient-bg__gradient"
        style={{ background: variants[variant] || variants.default }}
      />
      <svg className="grainient-bg__noise" aria-hidden="true">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
      {children && <div className="grainient-bg__content">{children}</div>}
    </div>
  )
}
