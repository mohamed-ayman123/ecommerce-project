import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Home, ArrowLeft, LogIn } from 'lucide-react'
import Logo from '@/components/common/Logo'
import Button from '@/components/common/Button'

export default function NotFound() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useSelector((state) => state.auth)

  const handlePrimaryAction = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  const handleGoBack = () => {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(isAuthenticated ? '/dashboard' : '/login')
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-bg-main)] px-4 py-12 transition-colors duration-200 dark:bg-[var(--color-dark-bg-main)]">
      {/* Decorative ambient background glows using Logo gradient colors */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-[var(--color-primary-dark)]/25 to-[var(--color-primary-medium)]/20 blur-3xl dark:from-[var(--color-primary-dark)]/40 dark:to-[var(--color-primary-medium)]/30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-gradient-to-tl from-[var(--color-accent-gold)]/20 via-[var(--color-accent-gold-hover)]/15 to-transparent blur-3xl dark:from-[var(--color-accent-gold)]/30 dark:via-[var(--color-accent-gold-hover)]/20"
      />

      {/* Brand Logo Header */}
      <div className="mb-8 select-none transition-transform duration-200 hover:scale-[1.02]">
        <Logo size="md" variant="auto" showText={true} />
      </div>

      {/* Main Card with Logo Gradient Top Accent */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--color-border-medium)]/40 bg-white/95 text-center shadow-2xl backdrop-blur-xl transition-colors duration-200 dark:border-[var(--color-primary-medium)]/40 dark:bg-[var(--color-dark-bg-card)]/95">
        {/* Sleek Top Gradient Line based on Logo palette */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-primary-dark)] via-[var(--color-primary-medium)] to-[var(--color-accent-gold)]" />

        <div className="p-8 sm:p-10">
          {/* Stylized Logo-Gradient 404 Display */}
          <div className="mb-3">
            <span className="font-heading text-7xl font-black tracking-tight select-none sm:text-8xl bg-gradient-to-r from-[var(--color-primary-dark)] via-[var(--color-primary-medium)] to-[var(--color-accent-gold)] bg-clip-text text-transparent dark:from-[var(--color-primary-medium)] dark:via-emerald-300 dark:to-[var(--color-accent-gold)]">
              404
            </span>
          </div>

          {/* Subtitle Pill */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-medium)]/70 bg-gradient-to-r from-[var(--color-primary-dark)]/5 via-[var(--color-primary-medium)]/10 to-[var(--color-accent-gold)]/15 px-4 py-1 text-xs font-bold tracking-wider uppercase text-[var(--color-primary-dark)] dark:border-[var(--color-primary-medium)]/50 dark:text-[var(--color-accent-gold)]">
            Resource Unavailable
          </div>

          <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl dark:text-white">
            Page Not Found
          </h1>

          <p className="mt-3 font-body text-sm leading-relaxed text-[var(--color-text-secondary)] dark:text-slate-300">
            The page or administrative endpoint you are trying to reach does not exist, was moved, or has an outdated link.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleGoBack}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>

            <Button
              type="button"
              size="md"
              onClick={handlePrimaryAction}
              className="w-full sm:w-auto bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary-medium)] hover:from-[var(--color-primary-medium)] hover:to-[var(--color-primary-dark)] dark:from-[var(--color-primary-medium)] dark:to-[var(--color-primary-dark)] dark:hover:from-[var(--color-accent-gold-hover)] dark:hover:to-[var(--color-accent-gold)] text-white shadow-md hover:shadow-lg transition-all"
            >
              {isAuthenticated ? (
                <>
                  <Home className="mr-2 h-4 w-4 text-[var(--color-accent-gold)]" />
                  Return to Dashboard
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4 text-[var(--color-accent-gold)]" />
                  Sign In to Admin
                </>
              )}
            </Button>
          </div>

          {/* Quick Shortcuts for Authenticated Admins */}
          {isAuthenticated && (
            <div className="mt-8 border-t border-[var(--color-border-light)] pt-6 dark:border-[var(--color-primary-medium)]/30">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] dark:text-slate-400">
                Quick Shortcuts
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/products')}
                  className="rounded-lg px-2.5 py-1 font-medium text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-bg-main)] dark:text-[var(--color-accent-gold)] dark:hover:bg-[var(--color-primary-medium)]/30"
                >
                  Products
                </button>
                <span className="text-[var(--color-border-medium)]">&bull;</span>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/orders')}
                  className="rounded-lg px-2.5 py-1 font-medium text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-bg-main)] dark:text-[var(--color-accent-gold)] dark:hover:bg-[var(--color-primary-medium)]/30"
                >
                  Orders
                </button>
                <span className="text-[var(--color-border-medium)]">&bull;</span>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/users')}
                  className="rounded-lg px-2.5 py-1 font-medium text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-bg-main)] dark:text-[var(--color-accent-gold)] dark:hover:bg-[var(--color-primary-medium)]/30"
                >
                  Users
                </button>
                <span className="text-[var(--color-border-medium)]">&bull;</span>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/settings')}
                  className="rounded-lg px-2.5 py-1 font-medium text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-bg-main)] dark:text-[var(--color-accent-gold)] dark:hover:bg-[var(--color-primary-medium)]/30"
                >
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer System Status Note */}
      <p className="relative z-10 mt-8 text-center text-xs text-[var(--color-text-secondary)] dark:text-slate-500">
        Nexis Tech Admin Dashboard &bull; All systems operational
      </p>
    </div>
  )
}
