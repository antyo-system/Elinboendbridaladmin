import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Dress,
  CurrencyCircleDollar,
  Article as ArticleIcon,
  Eye,
  EyeSlash,
  ChatCircleText,
  Lightning,
  Sparkle,
  Plus,
  TrendUp,
  CheckCircle,
} from '@phosphor-icons/react'
import { useProducts } from '../../hooks/useProducts'
import { useArticles } from '../../hooks/useArticles'
import { useAnalyticsStats } from '../../hooks/useAnalyticsStats'
import { usePrivacyStore } from '../../store/usePrivacyStore'
import { useLanguageStore } from '../../store/useLanguageStore'
import { calculateCatalogSummary, formatRp } from '../../utils/bridalPricing'
import {
  SILHOUETTE_OPTIONS,
  OCCASION_OPTIONS,
  WHATSAPP_CONCIERGE_NUMBER,
  WHATSAPP_CONCIERGE_DISPLAY,
} from '../../constants/bridalOptions'

export default function Dashboard() {
  const { data: products = [], isLoading: isProductsLoading } = useProducts()
  const { data: articles = [], isLoading: isArticlesLoading } = useArticles()
  const { data: analytics, isLoading: isAnalyticsLoading } = useAnalyticsStats()
  const { hideNominal, toggleHideNominal } = usePrivacyStore()
  const { language, t } = useLanguageStore()

  const catalogStats = useMemo(() => calculateCatalogSummary(products), [products])

  const articleStats = useMemo(() => {
    const published = articles.filter((a) => a.status === 'published').length
    const drafts = articles.filter((a) => a.status === 'draft').length
    const views = articles.reduce((sum, a) => sum + (a.views_count || 0), 0)
    return { total: articles.length, published, drafts, views }
  }, [articles])

  const silhouetteBreakdown = useMemo(() => {
    return SILHOUETTE_OPTIONS.map((sil) => {
      const count = products.filter((p) => p.silhouette === sil).length
      const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0
      return { label: sil, count, pct }
    })
  }, [products])

  const occasionBreakdown = useMemo(() => {
    return OCCASION_OPTIONS.map((occ) => {
      const count = products.filter((p) => p.occasion === occ).length
      const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0
      return { label: occ, count, pct }
    })
  }, [products])

  const summaryCards = [
    {
      label: language === 'id' ? 'Total Koleksi Gaun' : 'Total Gowns & Dresses',
      value: `${catalogStats.totalProducts} Items`,
      trend: `${catalogStats.weddingGownsCount} Wedding Gowns · ${catalogStats.partyDressesCount} Party Dresses`,
      toneBg: 'bg-pink-50',
      toneText: 'text-pink-600',
      trendClass: 'text-pink-700',
      icon: Dress,
      isLoading: isProductsLoading,
    },
    {
      label: language === 'id' ? 'Rata-rata Sewa (3 Hari)' : 'Avg. 3-Day Rental Price',
      value: hideNominal ? 'Rp •••••••' : formatRp(catalogStats.avgRentalPrice),
      trend: `${catalogStats.totalRentalsBooked} total rentals booked across collection`,
      toneBg: 'bg-emerald-50',
      toneText: 'text-emerald-700',
      trendClass: 'text-emerald-600',
      icon: TrendUp,
      isLoading: isProductsLoading,
    },
    {
      label: language === 'id' ? 'Rata-rata Custom Beli' : 'Avg. Custom Purchase Price',
      value: hideNominal ? 'Rp •••••••' : formatRp(catalogStats.avgPurchasePrice),
      trend: `${catalogStats.liveCount} Live on Website · ${catalogStats.offlineCount} Offline`,
      toneBg: 'bg-blue-50',
      toneText: 'text-blue-700',
      trendClass: 'text-blue-600',
      icon: CurrencyCircleDollar,
      isLoading: isProductsLoading,
    },
    {
      label: language === 'id' ? 'Artikel & Jurnal Bridal' : 'Bridal Journal Articles',
      value: `${articleStats.published} Published`,
      trend: `${articleStats.views.toLocaleString()} total organic reader views (${articleStats.drafts} drafts)`,
      toneBg: 'bg-amber-50',
      toneText: 'text-amber-700',
      trendClass: 'text-stone-500',
      icon: ArticleIcon,
      isLoading: isArticlesLoading,
    },
  ]

  return (
    <div className="space-y-5 p-4 md:p-6 lg:p-8">
      {/* Header & Nominal Privacy Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary-600 font-bold text-[11px] uppercase tracking-[0.16em] mb-1">
            <Sparkle size={15} weight="fill" className="text-gold-500" />
            <span>Elinboend Bridal — Exclusive Wedding Gowns &amp; Party Dresses</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-charcoal-900">
            {t('nav.dashboard', 'Dashboard')}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-charcoal-500">
            {language === 'id'
              ? 'Ringkasan koleksi gaun pengantin, harga sewa vs custom, dan analitik WhatsApp Concierge.'
              : 'Real-time overview of your bridal gown catalog, rental vs. custom pricing, and WhatsApp Concierge performance.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={toggleHideNominal}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition-all shadow-2xs cursor-pointer ${
              hideNominal
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:text-stone-900'
            }`}
            title={
              hideNominal
                ? t('privacy.showNominal', 'Show Amounts')
                : t('privacy.hideNominal', 'Hide Amounts')
            }
          >
            {hideNominal ? (
              <>
                <EyeSlash size={18} weight="bold" className="text-amber-600 shrink-0" />
                <span>{t('privacy.showNominal', 'Show Amounts')}</span>
              </>
            ) : (
              <>
                <Eye size={18} weight="bold" className="text-stone-500 shrink-0" />
                <span>{t('privacy.hideNominal', 'Hide Amounts')}</span>
              </>
            )}
          </button>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-pink-600 hover:bg-pink-700 text-white shadow-xs transition-colors"
          >
            <Plus size={16} weight="bold" />
            <span>{language === 'id' ? 'Kelola Produk Gaun' : 'Manage Gown Catalog'}</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="text-[11px] font-bold uppercase leading-snug tracking-wide text-stone-500">
                  {card.label}
                </p>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.toneBg}`}
                >
                  <Icon size={19} weight="bold" className={card.toneText} />
                </div>
              </div>
              {card.isLoading ? (
                <div className="h-6 w-3/4 animate-pulse rounded bg-stone-100" />
              ) : (
                <p className="break-words text-lg font-black leading-tight text-stone-900 md:text-xl">
                  {card.value}
                </p>
              )}
              <p className={`mt-2 min-h-4 text-xs font-semibold ${card.trendClass}`}>
                {card.isLoading ? '\u00a0' : card.trend}
              </p>
            </div>
          )
        })}
      </div>

      {/* Website Visitor & WhatsApp Concierge Analytics Widget */}
      {!isAnalyticsLoading && analytics && (
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                <Sparkle size={20} weight="bold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Website Visitor &amp; WhatsApp Concierge Conversion Analytics
                </h3>
                <p className="text-xs text-stone-500">
                  Direct fitting &amp; gown booking inquiries to{' '}
                  <span className="font-mono font-semibold text-stone-700">
                    {WHATSAPP_CONCIERGE_DISPLAY}
                  </span>
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Concierge Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Visitors Card */}
            <div className="p-4 bg-stone-50/70 rounded-xl border border-stone-200/60 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Eye size={24} weight="bold" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                  Unique Bride Visitors Today
                </p>
                <p className="text-2xl font-black text-stone-900 mt-0.5">
                  {analytics.uniqueVisitors}
                </p>
                <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                  {analytics.totalPageViews} Lookbook Pageviews
                </p>
              </div>
            </div>

            {/* WA Clicks Card */}
            <div className="p-4 bg-stone-50/70 rounded-xl border border-stone-200/60 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <ChatCircleText size={24} weight="bold" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                  WhatsApp Fitting &amp; Order Leads
                </p>
                <p className="text-2xl font-black text-emerald-700 mt-0.5">
                  {analytics.uniqueWALeads}
                </p>
                <p className="text-[11px] text-stone-500 font-semibold mt-0.5">
                  {analytics.totalWAClicks} Total Concierge Clicks
                </p>
              </div>
            </div>

            {/* Conversion Rate Card */}
            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200/70 flex items-center gap-4">
              <div className="p-3 bg-pink-600 text-white rounded-xl shadow-xs">
                <Lightning size={24} weight="fill" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide">
                  Concierge Conversion Rate
                </p>
                <p className="text-2xl font-black text-pink-900 mt-0.5">
                  {analytics.conversionRate}%
                </p>
                <p className="text-[11px] text-pink-600 font-semibold mt-0.5">
                  Visitor ➔ WhatsApp Inquiry Ratio
                </p>
              </div>
            </div>
          </div>

          {/* Top Converted Gowns */}
          {analytics.topProducts.length > 0 && (
            <div className="pt-3 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                ✨ Top Gowns Driving WhatsApp Fitting Inquiries:
              </h4>
              <div className="flex flex-wrap gap-2">
                {analytics.topProducts.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs"
                  >
                    <span>{p.name}</span>
                    <span className="bg-pink-100 text-pink-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      {p.clicks} WA Clicks
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Collection Distribution: Silhouette & Occasion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Collection by Gown Silhouette</h2>
              <p className="text-xs text-stone-500">
                Distribution across Ballgown, A-Line, Mermaid, Sheath, and Modern Kebaya
              </p>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {silhouetteBreakdown.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                  <span>{item.label}</span>
                  <span className="text-stone-500">
                    {item.count} {item.count === 1 ? 'gown' : 'gowns'} ({item.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-pink-600 transition-all duration-300"
                    style={{ width: `${Math.max(item.count > 0 ? 8 : 0, item.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Collection by Bridal Occasion</h2>
              <p className="text-xs text-stone-500">
                Curated balance for Holy Matrimony, Reception, Evening Gala &amp; Bridesmaids
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle size={13} weight="fill" /> All Occasions Covered
            </span>
          </div>
          <div className="space-y-3">
            {occasionBreakdown.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                  <span>{item.label}</span>
                  <span className="text-stone-500">
                    {item.count} {item.count === 1 ? 'piece' : 'pieces'} ({item.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-500 transition-all duration-300"
                    style={{ width: `${Math.max(item.count > 0 ? 8 : 0, item.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-base font-bold text-stone-900">
          {language === 'id' ? 'Aksi Cepat' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/products"
            className="bg-pink-600 hover:bg-pink-700 flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-center text-sm font-bold text-white shadow-xs transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Dress size={20} weight="bold" />
            <span>
              {language === 'id'
                ? 'Kelola Katalog Gaun & Harga'
                : 'Manage Gown & Dress Catalog'}
            </span>
          </Link>

          <Link
            to="/articles"
            className="bg-stone-800 hover:bg-stone-900 flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-center text-sm font-bold text-white shadow-xs transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            <ArticleIcon size={20} weight="bold" />
            <span>
              {language === 'id'
                ? 'Tulis Artikel & Jurnal Bridal'
                : 'Write Bridal Journal Article'}
            </span>
          </Link>

          <a
            href={`https://wa.me/${WHATSAPP_CONCIERGE_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-center text-sm font-bold text-white shadow-xs transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            <ChatCircleText size={20} weight="bold" />
            <span>WhatsApp Concierge ({WHATSAPP_CONCIERGE_DISPLAY})</span>
          </a>
        </div>
      </div>
    </div>
  )
}

