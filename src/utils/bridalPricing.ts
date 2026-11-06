import type { BridalProduct, ProductType } from '../types/product.ts'

export function formatRp(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)
}

export function formatRpShort(value: number): string {
  if (!Number.isFinite(value) || value === 0) return 'Rp 0'
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}K`
  return `Rp ${value}`
}

export function calculateDiscountPercent(
  originalPrice?: number | null,
  currentPrice?: number | null
): number {
  const orig = Number(originalPrice || 0)
  const curr = Number(currentPrice || 0)
  if (orig <= 0 || curr <= 0 || orig <= curr) return 0
  return Math.round(((orig - curr) / orig) * 100)
}

export function generateProductCode(productType: ProductType, nextIndex: number): string {
  const prefix = productType === 'wedding_gown' ? 'EB-GWN' : 'EB-PTY'
  const padded = String(Math.max(1, nextIndex)).padStart(3, '0')
  return `${prefix}-${padded}`
}

export function generateAutoProductTitle(
  silhouette: string,
  colorName: string,
  productType: ProductType
): string {
  const cleanColor = (colorName || 'Ivory').split('&')[0].trim()
  const cleanSilhouette = (silhouette || 'Couture').split('/')[0].trim()
  const suffix = productType === 'wedding_gown' ? 'Wedding Gown' : 'Evening Dress'
  return `${cleanColor} ${cleanSilhouette} ${suffix}`
}

export interface CatalogSummaryStats {
  totalProducts: number
  weddingGownsCount: number
  partyDressesCount: number
  liveCount: number
  offlineCount: number
  avgRentalPrice: number
  avgPurchasePrice: number
  totalRentalPortfolio: number
  totalPurchasePortfolio: number
  totalRentalsBooked: number
}

export function calculateCatalogSummary(products: BridalProduct[]): CatalogSummaryStats {
  const list = Array.isArray(products) ? products : []
  const totalProducts = list.length
  const weddingGownsCount = list.filter((p) => p.product_type === 'wedding_gown').length
  const partyDressesCount = list.filter((p) => p.product_type === 'party_dress').length
  const liveCount = list.filter((p) => p.is_live !== false).length
  const offlineCount = totalProducts - liveCount

  const rentalItems = list.filter((p) => p.is_rental_available && p.rental_price > 0)
  const purchaseItems = list.filter((p) => p.is_purchase_available && p.purchase_price > 0)

  const totalRentalPortfolio = rentalItems.reduce((sum, p) => sum + p.rental_price, 0)
  const totalPurchasePortfolio = purchaseItems.reduce((sum, p) => sum + p.purchase_price, 0)

  const avgRentalPrice =
    rentalItems.length > 0 ? Math.round(totalRentalPortfolio / rentalItems.length) : 0
  const avgPurchasePrice =
    purchaseItems.length > 0 ? Math.round(totalPurchasePortfolio / purchaseItems.length) : 0

  const totalRentalsBooked = list.reduce((sum, p) => sum + (p.rented_count || 0), 0)

  return {
    totalProducts,
    weddingGownsCount,
    partyDressesCount,
    liveCount,
    offlineCount,
    avgRentalPrice,
    avgPurchasePrice,
    totalRentalPortfolio,
    totalPurchasePortfolio,
    totalRentalsBooked,
  }
}

