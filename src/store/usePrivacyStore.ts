import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PrivacyState {
  hideNominal: boolean
  toggleHideNominal: () => void
}

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set) => ({
      hideNominal: false,
      toggleHideNominal: () => set((state) => ({ hideNominal: !state.hideNominal })),
    }),
    {
      name: 'elinboend-bridal-admin-privacy',
    }
  )
)

