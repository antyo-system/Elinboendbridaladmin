import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkle } from '@phosphor-icons/react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuthStore } from '../store/useAuthStore'

export default function Login() {
  const [email, setEmail] = useState('admin@elinboendbridal.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const signInAsDemoAdmin = useAuthStore((s) => s.signInAsDemoAdmin)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
        return
      }
      navigate('/')
      return
    }

    // Local demo mode when Supabase env vars are not set
    signInAsDemoAdmin(email)
    setLoading(false)
    navigate('/')
  }

  const handleQuickDemoAccess = () => {
    signInAsDemoAdmin('admin@elinboendbridal.com')
    navigate('/')
  }

  return (
    <div className="min-h-[100dvh] bg-stone-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
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
        <div className="bg-white py-8 px-6 shadow-sm border border-stone-200 rounded-2xl sm:px-10 space-y-6">
          <form className="space-y-5" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-medium border border-red-100">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="mt-1.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@elinboendbridal.com"
                  className="appearance-none block w-full px-3 py-2.5 border border-stone-300 rounded-lg shadow-2xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1.5">
                <input
                  type="password"
                  required={isSupabaseConfigured}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-3 py-2.5 border border-stone-300 rounded-lg shadow-2xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div className="pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="w-full py-2 px-4 rounded-lg border border-pink-200 bg-pink-50/70 hover:bg-pink-100 text-pink-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Instant Atelier Owner Access (Local / Demo Mode)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

