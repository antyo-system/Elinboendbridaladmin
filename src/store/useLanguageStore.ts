import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TRANSLATIONS, type Language } from '../constants/translations'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string, defaultText?: string) => string
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language: Language) => set({ language }),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === 'en' ? 'id' : 'en' })),
      t: (key: string, defaultText?: string) => {
        const lang = get().language
        const dict = TRANSLATIONS[lang]
        if (dict && dict[key]) {
          return dict[key]
        }
        return defaultText || key
      },
    }),
    {
      name: 'elinboend-bridal-admin-language',
    }
  )
)

