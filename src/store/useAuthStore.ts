import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const DEMO_SESSION_STORAGE_KEY = 'elinboend_admin_demo_session'

function getInitialDemoAuth(): boolean {
  try {
    const saved = localStorage.getItem(DEMO_SESSION_STORAGE_KEY)
    if (saved === 'false') {
      return false
    }
    if (saved === null) {
      localStorage.setItem(DEMO_SESSION_STORAGE_KEY, 'true')
    }
    return true
  } catch {
    return true
  }
}

interface AuthState {
  session: Session | null
  user: User | null
  isDemoAuthenticated: boolean
  initialized: boolean
  initialize: () => Promise<void>
  signInAsDemoAdmin: (email?: string) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isDemoAuthenticated: getInitialDemoAuth(),
  initialized: !isSupabaseConfigured,

  initialize: async () => {
    const initialDemo = getInitialDemoAuth()

    if (isSupabaseConfigured && supabase) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        set({
          session,
          user: session?.user ?? null,
          isDemoAuthenticated: !session && initialDemo,
          initialized: true,
        })

        supabase.auth.onAuthStateChange((_event, nextSession) => {
          set({
            session: nextSession,
            user: nextSession?.user ?? null,
            initialized: true,
          })
        })
        return
      } catch {
        // Fallback to local demo session if Supabase auth is unreachable
      }
    }

    set({
      session: null,
      user: null,
      isDemoAuthenticated: initialDemo,
      initialized: true,
    })
  },

  signInAsDemoAdmin: () => {
    try {
      localStorage.setItem(DEMO_SESSION_STORAGE_KEY, 'true')
    } catch {
      // Ignore storage error
    }
    set({
      isDemoAuthenticated: true,
      initialized: true,
    })
  },

  signOut: async () => {
    try {
      localStorage.setItem(DEMO_SESSION_STORAGE_KEY, 'false')
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
      initialized: true,
    })
  },
}))
