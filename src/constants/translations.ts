export type Language = 'en' | 'id'

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.articles': 'Articles & Blog',
    'nav.mainMenu': 'Main Menu',
    'nav.logout': 'Logout',
    'nav.home': 'Dashboard',

    // Language Toggle
    'lang.indonesian': 'Bahasa Indonesia',
    'lang.english': 'English',
    'lang.switchLabel': 'Language',

    // Common Actions
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.delete': 'Delete',
    'action.edit': 'Edit',
    'action.filter': 'Filter',
    'action.add': 'Add New',
    'action.search': 'Search gown title, code, fabric, or occasion...',

    // Privacy
    'privacy.hideNominal': 'Hide Amounts',
    'privacy.showNominal': 'Show Amounts',
  },
  id: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Produk',
    'nav.articles': 'Artikel & Blog',
    'nav.mainMenu': 'Menu Utama',
    'nav.logout': 'Logout',
    'nav.home': 'Dashboard',

    // Language Toggle
    'lang.indonesian': 'Bahasa Indonesia',
    'lang.english': 'English',
    'lang.switchLabel': 'Bahasa',

    // Common Actions
    'action.save': 'Simpan',
    'action.cancel': 'Batal',
    'action.delete': 'Hapus',
    'action.edit': 'Edit',
    'action.filter': 'Filter',
    'action.add': 'Tambah Baru',
    'action.search': 'Cari nama gaun, kode, bahan, atau acara...',

    // Privacy
    'privacy.hideNominal': 'Sembunyikan Nominal',
    'privacy.showNominal': 'Tampilkan Nominal',
  },
}

