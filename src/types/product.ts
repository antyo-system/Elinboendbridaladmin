export type ProductType = 'wedding_gown' | 'party_dress'

export type SilhouetteType =
  | 'Ballgown'
  | 'A-Line'
  | 'Mermaid'
  | 'Sheath / Column'
  | 'Modern Kebaya'

export type OccasionType =
  | 'Holy Matrimony'
  | 'Wedding Reception'
  | 'Evening Gala'
  | 'Bridesmaid'
  | 'Engagement / Sangjit'

export type SizeOption = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Custom'

export interface BridalProduct {
  id: string
  code: string
  title: string
  slug: string
  product_type: ProductType
  silhouette: SilhouetteType
  occasion: OccasionType
  color_name: string
  color_hex: string
  fabric: string
  rental_price: number
  original_rental_price?: number | null
  purchase_price: number
  original_purchase_price?: number | null
  security_deposit: number
  is_rental_available: boolean
  is_purchase_available: boolean
  badge_label?: string
  images: string[]
  description: string
  rating: number
  reviews_count: number
  rented_count: number
  sizes_available: string[]
  is_live: boolean
  store_code: string
  pickup_sla: string
  in_stock: boolean
  created_at: string
}

export type BridalProductInput = Omit<BridalProduct, 'id' | 'created_at'>

