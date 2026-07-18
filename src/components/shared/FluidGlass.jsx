import './FluidGlass.css'

/**
 * FluidGlass — 液态玻璃容器
 * Apple-style glassmorphism with backdrop blur
 */
export default function FluidGlass({
  children,
  className = '',
  intensity = 'medium', // light | medium | heavy
  glow = false,
  ...props
}) {
  const classes = [
    'fluid-glass',
    `fluid-glass--${intensity}`,
    glow && 'fluid-glass--glow',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
