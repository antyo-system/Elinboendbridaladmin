import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, SUPABASE_NOT_CONFIGURED_MESSAGE } from '../lib/supabase'

interface AuthState {
  session: Session | null
  user: User | null
  initialized: boolean
  initialize: () => Promise<void>
  signInWithCredentials: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>
  signOut: () => Promise<void>
}

let authListenerAttached = false

/** Server-side check against the `admin_emails` allowlist (see supabase/schema.sql). */
async function isAllowlistedAdmin(): Promise<boolean> {
  if (!supabase) return false
  const { data, error } = await supabase.rpc('is_admin')
  return !error && data === true
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initialized: false,

  initialize: async () => {
    if (!supabase) {
      set({ session: null, user: null, initialized: true })
      return
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session && !(await isAllowlistedAdmin())) {
      await supabase.auth.signOut()
      set({ session: null, user: null, initialized: true })
    } else {
      set({ session, user: session?.user ?? null, initialized: true })
    }

    if (!authListenerAttached) {
      authListenerAttached = true
      supabase.auth.onAuthStateChange((_event, nextSession) => {
        set({ session: nextSession, user: nextSession?.user ?? null, initialized: true })
      })
    }
  },

  signInWithCredentials: async (email: string, password: string) => {
    if (!supabase) {
      return { ok: false, error: SUPABASE_NOT_CONFIGURED_MESSAGE }
    }

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !password) {
      return { ok: false, error: 'Please enter both email address and password.' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (error || !data.session) {
      return { ok: false, error: 'Invalid email or password. Access denied.' }
    }

    if (!(await isAllowlistedAdmin())) {
      await supabase.auth.signOut()
      return { ok: false, error: 'This account is not authorized to access the admin panel.' }
    }

    set({ session: data.session, user: data.user, initialized: true })
    return { ok: true }
  },

  signOut: async () => {
    if (supabase) {
      await supabase.auth.signOut().catch(() => undefined)
    }
    set({ session: null, user: null, initialized: true })
  },
}))
