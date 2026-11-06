import type { ProductType, SilhouetteType, OccasionType, SizeOption } from '../types/product'
import type { ArticleCategory } from '../types/article'

export const PRODUCT_TYPES: Array<{ value: ProductType; label: string; badgeClass: string }> = [
  {
    value: 'wedding_gown',
    label: 'Wedding Gown',
    badgeClass: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  {
    value: 'party_dress',
    label: 'Party Dress',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
  },
]

export const SILHOUETTE_OPTIONS: SilhouetteType[] = [
  'Ballgown',
  'A-Line',
  'Mermaid',
  'Sheath / Column',
  'Modern Kebaya',
]

export const OCCASION_OPTIONS: OccasionType[] = [
  'Holy Matrimony',
  'Wedding Reception',
  'Evening Gala',
  'Bridesmaid',
  'Engagement / Sangjit',
]

export const SIZE_OPTIONS: SizeOption[] = ['XS', 'S', 'M', 'L', 'XL', 'Custom']

export interface ColorPreset {
  name: string
  hex: string
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Ivory & Warm Champagne', hex: '#F5EDE6' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Lustrous Pearl', hex: '#FAF8F5' },
  { name: 'Blush & Silver Shimmer', hex: '#FCEEE9' },
  { name: 'Warm Champagne', hex: '#DFCCAF' },
  { name: 'Broken White & Gold Lace', hex: '#F9F6F0' },
  { name: 'Dusty Rose', hex: '#E2B2B8' },
  { name: 'Deep Emerald', hex: '#0A3B2A' },
  { name: 'Royal Burgundy', hex: '#5B1222' },
  { name: 'Midnight Navy', hex: '#14213D' },
]

export const FABRIC_SUGGESTIONS: string[] = [
  'French Chantilly Lace & Silk Organza',
  'Crepe Silk & Swarovski Beads',
  'Heavy Japanese Mikado Silk',
  'Silk Stretch Velvet & Gold Thread',
  'Glitter Tulle & 3D Floral Appliques',
  'Heavy Duchess Satin',
  'French Corded Lace & Songket Accent',
  'Italian Chiffon & Pleated Bodice',
]

export const BADGE_SUGGESTIONS: string[] = [
  'Best Seller',
  'Haute Couture',
  'Modern Bride',
  'Party Exclusive',
  'Trending',
  'Popular Rental',
  'Heritage Couture',
  'Bridesmaid Favorite',
  'New Arrival',
]

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'Silhouette Guide',
  'Bridal Budget',
  'Fitting & Care',
  'Evening & Gala Styling',
  'Kebaya & Heritage',
  'Real Brides',
]

export const WHATSAPP_CONCIERGE_NUMBER = '6287880111169'
export const WHATSAPP_CONCIERGE_DISPLAY = '+62 878-8011-1169'

