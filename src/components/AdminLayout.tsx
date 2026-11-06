import { useEffect, useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useLanguageStore } from '../store/useLanguageStore'
import {
  ChartBar,
  Dress,
  Article,
  SignOut,
  Globe,
  Sparkle,
  DotsThreeOutline,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { APP_VERSION } from '../constants/changelog'

const SIDEBAR_COLLAPSED_KEY = 'elinboend_sidebar_collapsed'

export default function AdminLayout() {
  const { signOut } = useAuthStore()
  const { language, toggleLanguage, t } = useLanguageStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isSidebarCollapsed))
    } catch {
      // Ignore storage error
    }
  }, [isSidebarCollapsed])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const mainNav = [
    { key: 'nav.dashboard', defaultName: 'Dashboard', path: '/', icon: ChartBar },
    { key: 'nav.products', defaultName: 'Products', path: '/products', icon: Dress },
    { key: 'nav.articles', defaultName: 'Articles & Blog', path: '/articles', icon: Article },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const NavLink = ({
    item,
    isCollapsed = false,
  }: {
    item: { key: string; defaultName: string; path: string; icon: Icon }
    isCollapsed?: boolean
  }) => {
    const IconComp = item.icon
    const active = isActive(item.path)
    const displayName = t(item.key, item.defaultName)
    return (
      <Link
        to={item.path}
        onClick={() => setIsMobileMenuOpen(false)}
        title={displayName}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 overflow-hidden whitespace-nowrap ${
          active
            ? 'bg-primary-50 text-primary-700 border border-primary-200/80 shadow-xs'
            : 'text-charcoal-600 hover:bg-cream-100 hover:text-charcoal-900'
        }`}
      >
        <IconComp
          size={19}
          weight={active ? 'fill' : 'regular'}
          className={`shrink-0 ${active ? 'text-primary-600' : 'text-charcoal-400'}`}
        />
        <span
          className={`transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
        >
          {displayName}
        </span>
      </Link>
    )
  }

  const SidebarContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
    <div className="flex flex-col h-full w-full">
      {/* Brand Header / Collapse Toggle */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="p-3 h-[68px] flex items-center border-b border-cream-200 shrink-0 hover:bg-cream-50 transition-colors w-full text-left cursor-pointer"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        <div className="flex items-center gap-3 w-full">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-charcoal-900 border border-primary-600/40 text-gold-400 flex items-center justify-center shadow-xs">
            <Sparkle size={18} weight="fill" />
          </div>
          <div
            className={`transition-opacity duration-300 whitespace-nowrap overflow-hidden flex flex-col justify-center ${
              isCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
            }`}
          >
            <h2 className="font-display text-lg font-bold text-charcoal-900 leading-tight tracking-tight">
              Elinboend Bridal
            </h2>
            <p className="text-[9px] uppercase tracking-[0.16em] text-primary-600 font-semibold mt-0.5">
              Atelier Admin · v{APP_VERSION}
            </p>
          </div>
        </div>
      </button>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        <p
          className={`px-3 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 transition-opacity duration-300 whitespace-nowrap ${
            isCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
        >
          {t('nav.mainMenu', 'Main Menu')}
        </p>
        {mainNav.map((item) => (
          <NavLink key={item.path} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-stone-200 flex flex-col gap-1 shrink-0">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-3 px-3 py-1.5 text-[13px] font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors overflow-hidden whitespace-nowrap cursor-pointer"
          title={`Switch Language (Current: ${language.toUpperCase()})`}
        >
          <Globe size={20} weight="regular" className="shrink-0 text-stone-500" />
          <span
            className={`transition-opacity duration-300 flex items-center justify-between flex-1 ${
              isCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
            }`}
          >
            <span>{t('lang.switchLabel', 'Language')}</span>
            <span className="text-[11px] font-bold bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded uppercase">
              {language}
            </span>
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-1.5 text-[13px] font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors overflow-hidden whitespace-nowrap cursor-pointer"
          title="Logout"
        >
          <SignOut size={20} weight="regular" className="shrink-0" />
          <span
            className={`transition-opacity duration-300 ${
              isCollapsed ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
            }`}
          >
            {t('nav.logout', 'Logout')}
          </span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/30"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-72 h-full bg-white flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar Fixed Overlay */}
      <div
        className={`hidden md:flex flex-col bg-white border-r border-stone-200 fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 group overflow-hidden ${
          isSidebarCollapsed ? 'w-[72px] hover:w-64 hover:shadow-2xl' : 'w-64'
        }`}
      >
        <SidebarContent isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content Spacer */}
      <div
        className={`hidden md:block transition-all duration-300 shrink-0 ${
          isSidebarCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative pb-[4.5rem] md:pb-0 flex flex-col bg-stone-50">
        <Outlet />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 flex items-stretch justify-around"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {mainNav.map((item) => {
          const IconComp = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-2 gap-0.5 transition-colors ${
                active ? 'text-pink-600' : 'text-stone-400'
              }`}
            >
              <IconComp size={22} weight={active ? 'fill' : 'regular'} />
              <span className="text-[10px] font-medium leading-none">
                {t(item.key, item.defaultName)}
              </span>
            </Link>
          )
        })}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-stone-400 transition-colors cursor-pointer"
        >
          <DotsThreeOutline size={22} weight="regular" />
          <span className="text-[10px] font-medium leading-none">
            {language === 'id' ? 'Menu' : 'More'}
          </span>
        </button>
      </nav>
    </div>
  )
}

