import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toggleTheme, toggleMobileSidebar } from '../../store/slices/uiSlice'
import { logoutUser } from '../../store/slices/authSlice'
import Logo from '../common/Logo'

function NavBar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useSelector((state) => state.ui?.theme || 'light')
  const { user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  const displayName = user?.name || user?.username || 'Admin'
  const displayRole = user?.role || 'ADMIN'
  const initialLetter = (displayName[0] || 'A').toUpperCase()

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg-card)]/95 border-b border-[var(--color-border-light)] backdrop-blur-xl transition-colors duration-200 dark:bg-[var(--color-primary-dark)] dark:border-[var(--color-primary-medium)]/30">
      <div className="flex h-20 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => dispatch(toggleMobileSidebar())}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-bg-main)] text-[var(--color-text-primary)] border border-[var(--color-border-light)] shadow-xs transition hover:border-[var(--color-accent-gold-hover)] hover:text-[var(--color-accent-gold-hover)] md:hidden dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/40 dark:text-[var(--color-text-gold)] dark:hover:bg-[var(--color-primary-medium)]/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Logo variant="auto" size="md" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification button */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-bg-main)] text-[var(--color-text-primary)] border border-[var(--color-border-light)] shadow-xs transition-all duration-200 hover:border-[var(--color-accent-gold-hover)] hover:text-[var(--color-accent-gold-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold-hover)] dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/40 dark:text-[var(--color-text-gold)] dark:hover:bg-[var(--color-primary-medium)]/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[18px] w-[18px]"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[var(--color-accent-gold-hover)] ring-2 ring-[var(--color-bg-card)] dark:ring-[var(--color-primary-dark)]" />
          </button>

          {/* Theme toggle button */}
          <button
            type="button"
            aria-label="Toggle theme"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-bg-main)] text-[var(--color-text-primary)] border border-[var(--color-border-light)] shadow-xs transition-all duration-200 hover:border-[var(--color-accent-gold-hover)] hover:text-[var(--color-accent-gold-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold-hover)] dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/40 dark:text-[var(--color-text-gold)] dark:hover:bg-[var(--color-primary-medium)]/30"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'dark' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[18px] w-[18px]"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[18px] w-[18px]"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          {/* User info badge */}
          <div className="hidden md:flex items-center gap-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)] px-3 py-1.5 shadow-xs transition-colors dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-primary-medium)]/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent-gold-hover)] text-sm font-bold text-white shadow-xs">
              {initialLetter}
            </div>

            <div className="flex min-w-0 flex-col leading-tight">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-gold-hover)] dark:text-[var(--color-text-gold)]">
                {displayRole}
              </span>
              <span className="truncate text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
                {displayName}
              </span>
            </div>
          </div>

          {/* Desktop Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 rounded-xl bg-[var(--color-accent-gold-hover)] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[var(--color-text-gold)] active:scale-[0.98]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            Logout
          </button>

          {/* Mobile Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent-gold-hover)] text-white shadow-xs transition hover:bg-[var(--color-text-gold)] active:scale-[0.98] md:hidden"
            aria-label="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default NavBar