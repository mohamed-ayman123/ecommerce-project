export default function Logo({
  variant = 'dark', // 'dark' (for light bg) | 'light' (for dark bg) | 'auto' (responsive)
  size = 'md', // 'sm' | 'md' | 'lg'
  showText = true,
  className = '',
}) {
  const isLight = variant === 'light'
  const isAuto = variant === 'auto'

  // Icon strokes & fills using configured theme CSS variables
  const strokeColor = isAuto
    ? 'currentColor'
    : isLight
      ? '#FFFFFF'
      : 'var(--color-primary-dark)'

  const circleFill = 'var(--color-text-gold)'
  const circleStroke = isAuto
    ? 'currentColor'
    : isLight
      ? '#FFFFFF'
      : 'var(--color-primary-dark)'

  const svgClass = isAuto ? 'text-[var(--color-primary-dark)] dark:text-white' : ''

  // Typography color classes from theme CSS variables
  const nexisColor = isAuto
    ? 'text-[var(--color-text-primary)] dark:text-white'
    : isLight
      ? 'text-white'
      : 'text-[var(--color-text-primary)]'

  const techColor = isAuto
    ? 'text-[var(--color-primary-medium)] dark:text-[var(--color-text-gold)]'
    : isLight
      ? 'text-[var(--color-text-gold)]'
      : 'text-[var(--color-primary-medium)]'

  const tagColor = isAuto
    ? 'text-[var(--color-text-secondary)] dark:text-[var(--color-border-light)]'
    : isLight
      ? 'text-[var(--color-border-light)]'
      : 'text-[var(--color-text-secondary)]'

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  const textSizes = {
    sm: {
      title: 'text-base',
      sub: 'text-xs',
      tag: 'text-[7px]',
    },
    md: {
      title: 'text-lg sm:text-xl',
      sub: 'text-sm sm:text-base',
      tag: 'text-[8px] sm:text-[9px]',
    },
    lg: {
      title: 'text-2xl',
      sub: 'text-lg',
      tag: 'text-[10px]',
    },
  }

  const currentTextSize = textSizes[size] || textSizes.md

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Hexagonal Tech Emblem */}
      <svg
        viewBox="0 0 48 48"
        className={`${iconSizes[size]} ${svgClass} flex-shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Hexagon */}
        <polygon
          points="24,4 41.32,14 41.32,34 24,44 6.68,34 6.68,14"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Vertical Center Line */}
        <line x1="24" y1="4" x2="24" y2="44" stroke={strokeColor} strokeWidth="3.5" />
        {/* Center Node (Gold in both modes) */}
        <circle
          cx="24"
          cy="24"
          r="7.5"
          fill={circleFill}
          stroke={circleStroke}
          strokeWidth="1.5"
        />
      </svg>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1.5 font-heading">
            <span className={`font-black tracking-tight ${currentTextSize.title} ${nexisColor}`}>
              NEXIS
            </span>
            <span className={`font-medium tracking-wide ${currentTextSize.sub} ${techColor}`}>
              TECH
            </span>
          </div>
          <span
            className={`font-body font-semibold tracking-[0.22em] uppercase mt-0.5 ${currentTextSize.tag} ${tagColor}`}
          >
            ELECTRONICS &amp; HARDWARE
          </span>
        </div>
      )}
    </div>
  )
}

