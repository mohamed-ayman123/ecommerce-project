import { useEffect, useState } from 'react'

function NavBar() {
    const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
    })
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark)
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
        }, [isDark])

    
  return (
    <header className="sticky top-0 z-40  bg-[var(--color-primary-dark)] backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
            <div className='flex items-center gap-3'>
                <img src="https://koda-store-dashboard.vercel.app/assets/KodaLogo2-D3eRgjLV.png" alt="" className='h-12 w-auto object-contain' />
                <div className='hidden sm:block'>
                    <h1 className='text-lg font-bold text-[var(--color-text-light)] dark:text-[var(--color-text-gold)]'>Koda Dashboard</h1>
                    <p className='text-xs text-[var(--color-text-gold)] dark:text-slate-400'>E-Commerce Admin Panel</p>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
            <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] shadow-sm transition-all duration-200 hover:border-[var(--color-accent-gold)] hover:text-[var(--color-accent-gold)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)] focus:ring-offset-2 dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-accent-gold-hover)]"
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
                    className="h-[18px] w-[18px] "
                >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>

                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-accent-gold-hover )] bg-[var(--color-accent-gold-hover)]" />
            </button>

            <button
                type="button"
                aria-label="Toggle dark mode"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-bg-main)] text-[var(--color-accent-gold)] shadow-sm transition-all duration-200 hover:border-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)] hover:text-[var(--color-text-light)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)] focus:ring-offset-2 dark:bg-[var(--color-dark-bg-main)] dark:text-[var(--color-text-gold)]"
                onClick={() => setIsDark((value) => !value)}

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
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
            </button>

            <div className="hidden md:flex items-center items-center gap-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-main)] px-3 py-2 shadow-sm dark:bg-[var(--color-dark-bg-main)] dark:border-[var(--color-dark-bg-main)] dark:text-[var(--color-text-gold)]">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-gold-hover)] text-sm font-bold text-[var(--color-text-light)]">
                    A
                </div>

                <div className="flex min-w-0 flex-col leading-tight">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-gold)]">
                    ADMIN
                    </span>

                    <span className="truncate text-sm font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-text-gold)]">
                    admin
                    </span>
                </div>
            </div>

            <button class="hidden md:flex items-center gap-2 rounded-xl bg-[var(--color-accent-gold-hover)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-text-gold)]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>Logout</button>
            <button class="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent-gold-hover)] text-white transition hover:bg-[var(--color-text-gold)] md:hidden"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg></button>
        </div>
      </div>
    </header>
  )
}
export default NavBar;