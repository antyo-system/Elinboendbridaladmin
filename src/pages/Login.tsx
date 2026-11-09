import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Sparkle, Eye, EyeSlash, LockKey } from '@phosphor-icons/react'
import { useAuthStore } from '../store/useAuthStore'

const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 60

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)

  const { session, initialized, initialize, signInWithCredentials } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!initialized) {
      void initialize()
    }
  }, [initialized, initialize])

  if (session) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (lockedUntil && Date.now() < lockedUntil) {
      const remainingSec = Math.ceil((lockedUntil - Date.now()) / 1000)
      setErrorMsg(`Too many failed attempts. Please wait ${remainingSec}s before trying again.`)
      return
    }

    setLoading(true)
    setErrorMsg('')

    const result = await signInWithCredentials(email, password)
    setLoading(false)

    if (!result.ok) {
      const nextAttempts = failedAttempts + 1
      setFailedAttempts(nextAttempts)
      if (nextAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_SECONDS * 1000)
        setErrorMsg(
          `Too many failed login attempts. Login locked for ${LOCKOUT_SECONDS} seconds.`
        )
      } else {
        setErrorMsg(result.error || 'Invalid email or password.')
      }
      return
    }

    setFailedAttempts(0)
    setLockedUntil(null)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-[100dvh] bg-cream-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 rounded-xl bg-charcoal-900 border border-primary-600/40 text-gold-400 flex items-center justify-center shadow-md">
          <Sparkle size={24} weight="fill" />
        </div>
        <h2 className="mt-4 text-center font-display text-4xl font-bold text-charcoal-900 tracking-tight">
          Elinboend Bridal
        </h2>
        <p className="mt-1 text-center text-[10px] uppercase tracking-[0.18em] text-primary-600 font-semibold">
          Exclusive Wedding Gowns &amp; Party Dresses · Atelier Admin
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-cream-200 rounded-2xl sm:px-10 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-cream-100">
            <LockKey size={18} weight="duotone" className="text-primary-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Authorized Atelier Staff Sign In
            </span>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-semibold border border-red-200">
                {errorMsg}
              </div>
            )}

            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider"
              >
                Admin Email
              </label>
              <div className="mt-1.5">
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="appearance-none block w-full px-3.5 py-2.5 border border-cream-300 rounded-lg shadow-2xs placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600 text-sm text-charcoal-900"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="mt-1.5 relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="appearance-none block w-full pl-3.5 pr-10 py-2.5 border border-cream-300 rounded-lg shadow-2xs placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600 text-sm text-charcoal-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-charcoal-400 hover:text-charcoal-700 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {loading ? 'Verifying Credentials...' : 'Sign In to Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

