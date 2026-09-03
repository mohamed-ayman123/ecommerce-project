export default function Logo({
  variant = 'dark', // 'dark' (for light bg) | 'light' (for dark bg)
  size = 'md', // 'sm' | 'md' | 'lg'
  showText = true,
  className = '',
}) {
  const isLight = variant === 'light'
  const textColor = isLight ? 'text-white' : 'text-[#262524]'
  const subTextColor = isLight ? 'text-slate-400' : 'text-[#585858]'
  const tagColor = isLight ? 'text-slate-400' : 'text-[#585858]'
  const strokeColor = isLight ? '#FFFFFF' : '#262524'
  const fillColor = isLight ? '#FFFFFF' : '#262524'

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Hexagonal Tech Emblem */}
      <svg
        viewBox="0 0 48 48"
        className={`${iconSizes[size]} flex-shrink-0`}
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
        {/* Center Node */}
        <circle cx="24" cy="24" r="7.5" fill={fillColor} stroke={strokeColor} strokeWidth="1" />
      </svg>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-black tracking-tight text-lg sm:text-xl ${textColor}`}>
              NEXIS
            </span>
            <span className={`font-light tracking-wide text-sm sm:text-base ${subTextColor}`}>
              TECH
            </span>
          </div>
          <span className={`text-[8px] sm:text-[9px] font-semibold tracking-[0.22em] uppercase mt-0.5 ${tagColor}`}>
            Electronics &amp; Hardware
          </span>
        </div>
      )}
    </div>
  )
}
