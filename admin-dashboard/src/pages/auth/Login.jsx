import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-toastify'
import Logo from '@/components/common/Logo'
import Button from '@/components/common/Button'
import { loginUser, loginSuccess } from '@/store/slices/authSlice'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth)
  const defaultLanding = useSelector(
    (state) => state.ui?.preferences?.defaultLanding || '/dashboard'
  )

  const userRole = (user?.role || '').toLowerCase()
  const userEmail = (user?.email || '').toLowerCase()
  const isAdmin =
    !user?.role ||
    userRole === 'admin' ||
    userEmail === 'admin@nexis.com' ||
    userEmail === 'admin@koda.com'

  // Redirect if already authenticated as an admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      let redirectPath = location.state?.from?.pathname || defaultLanding
      if (redirectPath === '/' || redirectPath === '/login') {
        redirectPath = defaultLanding
      }
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, isAdmin, navigate, location, defaultLanding])

  // Fill default test credentials
  const handleQuickFill = () => {
    setEmail('admin@nexis.com')
    setPassword('admin1212')
    setFormError('')
    toast.info('Demo admin credentials filled (admin@nexis.com)!')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    if (!cleanEmail || !cleanPassword) {
      const msg = 'Please enter both email and password'
      setFormError(msg)
      toast.error(msg)
      return
    }

    try {
      const response = await dispatch(
        loginUser({
          email: cleanEmail,
          password: cleanPassword,
        })
      ).unwrap()

      toast.dismiss()
      toast.success(response?.message || 'Logged in successfully!')
      const destination = location.state?.from?.pathname || defaultLanding
      navigate(destination, { replace: true })
    } catch (error) {
      // Graceful demo fallback: If external API server is down or unreachable, allow demo login
      if (
        cleanEmail.toLowerCase() === 'admin@nexis.com' &&
        cleanPassword === 'admin1212' &&
        (!error.response || error.code === 'ERR_NETWORK')
      ) {
        const demoUser = {
          _id: 'demo-admin-id',
          username: 'Nexis Admin',
          email: 'admin@nexis.com',
          role: 'admin',
        }
        dispatch(
          loginSuccess({
            token: 'demo-jwt-token-admin',
            user: demoUser,
          })
        )
        toast.success('Signed in using offline demo mode!')
        const destination = location.state?.from?.pathname || defaultLanding
        navigate(destination, { replace: true })
        return
      }

      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.response?.data?.message ||
            error?.message ||
            'Failed to sign in. Please verify your credentials.'

      setFormError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden bg-gradient-to-br from-[var(--color-dark-bg-main)] via-[var(--color-dark-bg-card)] to-[var(--color-primary-dark)] transition-colors duration-300">
      {/* Dynamic Atmospheric Glows & Background Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 sm:w-[540px] sm:h-[540px] bg-[var(--color-primary-medium)]/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 sm:w-[600px] sm:h-[600px] bg-[var(--color-text-gold)]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[var(--color-primary-dark)]/40 rounded-full blur-[160px] pointer-events-none" />

      {/* Cybernetic Tech Dot Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(var(--color-accent-gold-hover) 1px, transparent 1px), radial-gradient(var(--color-primary-medium) 1px, transparent 1px)`,
          backgroundSize: `36px 36px`,
          backgroundPosition: `0 0, 18px 18px`
        }}
      />

      {/* Login Master Card */}
      <div className="relative z-10 w-full max-w-md lg:max-w-4xl rounded-3xl border border-white/20 dark:border-white/10 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl flex overflow-hidden ring-1 ring-white/15">
        
        {/* Left Brand Showcase (Desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--color-primary-dark)]/95 via-[var(--color-primary-medium)]/95 to-[var(--color-dark-bg-main)]/95 p-10 text-white flex-col justify-between relative overflow-hidden border-r border-white/10">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[var(--color-text-gold)]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[var(--color-primary-medium)]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-10">
              <Logo variant="light" size="md" />
            </div>

            <h1 className="text-3xl xl:text-4xl font-heading font-bold leading-tight mb-4 tracking-tight">
              Manage Your Store <br />
              <span className="text-[var(--color-text-gold)]">Like a Pro</span>
            </h1>
            <p className="text-emerald-100/80 text-sm mb-8 leading-relaxed font-body">
              Enterprise administration dashboard for electronics hardware, inventory tracking,
              real-time orders, and user intelligence.
            </p>

            <div className="space-y-3 font-body">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl text-sm font-medium border border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-text-gold)] shrink-0" />
                <span>Product &amp; Inventory Management</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl text-sm font-medium border border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-text-gold)] shrink-0" />
                <span>Live Order Fulfillment &amp; Tracking</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl text-sm font-medium border border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-text-gold)] shrink-0" />
                <span>Customer Directory &amp; Role Access</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-emerald-100/70 font-body">
            <ShieldCheck className="w-4 h-4 text-[var(--color-text-gold)] shrink-0" />
            <span>Encrypted Nexis Tech Admin Authentication</span>
          </div>
        </div>

        {/* Right Form Panel (Elevated Glassmorphic Surface) */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center relative overflow-hidden bg-gradient-to-b from-white/95 via-[var(--color-border-light)]/95 to-[var(--color-bg-main)]/95 dark:from-[var(--color-dark-bg-main)]/95 dark:via-[var(--color-dark-bg-card)]/95 dark:to-[var(--color-primary-dark)]/95 backdrop-blur-xl">
          {/* Subtle Ambient Refractions behind the Form */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-[var(--color-text-gold)]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[var(--color-primary-medium)]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6 relative z-10">
            <Logo variant="auto" size="md" />
          </div>

          <div className="text-center lg:text-left mb-6 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-text-primary)] dark:text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] dark:text-gray-400 font-body mt-1">
              Sign in to your Nexis Tech admin portal
            </p>
          </div>

          {/* Quick Demo Fill Button */}
          <Button
            type="button"
            variant="subtle"
            size="none"
            onClick={handleQuickFill}
            className="relative z-10 w-full mb-6 flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold font-body"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-text-gold)] shrink-0" />
            <span>Quick Fill Demo Credentials (admin@nexis.com)</span>
          </Button>

          {/* Error banner */}
          {formError && (
            <div className="relative z-10 mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-medium font-body flex items-center gap-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider font-heading"
              >
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-gray-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="admin@nexis.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white/90 dark:bg-[var(--color-dark-bg-main)]/90 border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40 rounded-xl text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-secondary)]/50 font-body transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] focus:border-transparent shadow-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider font-heading"
                >
                  Password <span className="text-rose-500">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] dark:text-gray-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/90 dark:bg-[var(--color-dark-bg-main)]/90 border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40 rounded-xl text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-secondary)]/50 font-body transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] focus:border-transparent shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full mt-2 shadow-md hover:shadow-lg transition-all"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Divider */}
          <div className="relative z-10 flex items-center my-6">
            <div className="flex-grow border-t border-[var(--color-border-medium)]/60 dark:border-white/10" />
            <span className="px-3 text-xs text-[var(--color-text-secondary)] dark:text-gray-400 font-body">OR</span>
            <div className="flex-grow border-t border-[var(--color-border-medium)]/60 dark:border-white/10" />
          </div>

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => toast.info('Google SSO is configured for enterprise domains only.')}
            className="relative z-10 w-full flex items-center justify-center gap-3 bg-white/80 dark:bg-white/5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <p className="relative z-10 text-[11px] text-center text-[var(--color-text-secondary)] dark:text-gray-400 mt-6 font-body">
            Authorized Personnel Only • Nexis Tech Commerce
          </p>
        </div>

      </div>
    </div>
  )
}
