import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AUTH_SESSION_STORAGE_KEY = 'elinboend_admin_auth_session_v2'
const LEGACY_DEMO_KEY = 'elinboend_admin_demo_session'
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12 // 12 hours

const configuredAdminEmail =
  (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.trim().toLowerCase() ||
  'admin@elinboendbridal.com'
const configuredAdminPassword =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || 'Elinboend2026!'

interface StoredAdminSession {
  email: string
  expiresAt: number
}

function readValidStoredSession(): StoredAdminSession | null {
  try {
    // Always purge legacy auto-demo key
    localStorage.removeItem(LEGACY_DEMO_KEY)

    const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredAdminSession
    if (!parsed?.email || typeof parsed.expiresAt !== 'number') {
      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
      return null
    }
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

interface AuthState {
  session: Session | null
  user: User | null
  isDemoAuthenticated: boolean
  adminEmail: string | null
  initialized: boolean
  initialize: () => Promise<void>
  signInWithCredentials: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => {
  const initialStored = readValidStoredSession()

  return {
    session: null,
    user: null,
    isDemoAuthenticated: Boolean(initialStored),
    adminEmail: initialStored?.email ?? null,
    initialized: !isSupabaseConfigured,

    initialize: async () => {
      const storedSession = readValidStoredSession()

      if (isSupabaseConfigured && supabase) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession()

          set({
            session,
            user: session?.user ?? null,
            isDemoAuthenticated: Boolean(storedSession),
            adminEmail: session?.user?.email ?? storedSession?.email ?? null,
            initialized: true,
          })

          supabase.auth.onAuthStateChange((_event, nextSession) => {
            const currentStored = readValidStoredSession()
            set({
              session: nextSession,
              user: nextSession?.user ?? null,
              isDemoAuthenticated: Boolean(currentStored),
              adminEmail: nextSession?.user?.email ?? currentStored?.email ?? null,
              initialized: true,
            })
          })
          return
        } catch {
          // Fallback to stored verified session if Supabase is unreachable
        }
      }

      set({
        session: null,
        user: null,
        isDemoAuthenticated: Boolean(storedSession),
        adminEmail: storedSession?.email ?? null,
        initialized: true,
      })
    },

    signInWithCredentials: async (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase()

      if (!normalizedEmail || !password) {
        return { ok: false, error: 'Please enter both email address and password.' }
      }

      // 1. Try Supabase Auth if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          })
          if (!error && data.session) {
            set({
              session: data.session,
              user: data.user,
              isDemoAuthenticated: true,
              adminEmail: data.user?.email ?? normalizedEmail,
              initialized: true,
            })
            return { ok: true }
          }
        } catch {
          // Continue to configured admin credential check
        }
      }

      // 2. Strict Atelier Admin Credential Check
      if (
        normalizedEmail === configuredAdminEmail &&
        password === configuredAdminPassword
      ) {
        const sessionPayload: StoredAdminSession = {
          email: normalizedEmail,
          expiresAt: Date.now() + SESSION_DURATION_MS,
        }
        try {
          localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(sessionPayload))
        } catch {
          // Ignore storage error
        }
        set({
          isDemoAuthenticated: true,
          adminEmail: normalizedEmail,
          initialized: true,
        })
        return { ok: true }
      }

      return {
        ok: false,
        error: 'Invalid email or password. Access denied.',
      }
    },

    signOut: async () => {
      try {
        localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
        localStorage.removeItem(LEGACY_DEMO_KEY)
      } catch {
        // Ignore storage error
      }
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.signOut()
        } catch {
          // Ignore network sign-out error
        }
      }
      set({
        session: null,
        user: null,
        isDemoAuthenticated: false,
        adminEmail: null,
        initialized: true,
      })
    },
  }
})
