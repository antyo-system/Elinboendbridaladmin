import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { BridalProduct, BridalProductInput } from '../types/product'
import { INITIAL_BRIDAL_PRODUCTS } from '../data/initialBridalData'
import { slugify } from '../utils/seoUtils'

const LOCAL_PRODUCTS_KEY = 'elinboend_bridal_admin_products_v1'

function loadLocalProducts(): BridalProduct[] {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_BRIDAL_PRODUCTS))
  } catch {
    // Ignore storage error
  }
  return INITIAL_BRIDAL_PRODUCTS
}

function saveLocalProducts(products: BridalProduct[]) {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products))
  } catch {
    // Ignore storage error
  }
}

function normalizeProductRow(raw: Partial<BridalProduct>, index: number): BridalProduct {
  const title = raw.title || 'Untitled Bridal Gown'
  return {
    id: raw.id || `eb-${index + 1}`,
    code: raw.code || `EB-${String(index + 1).padStart(3, '0')}`,
    title,
    slug: raw.slug || slugify(title),
    product_type: raw.product_type === 'party_dress' ? 'party_dress' : 'wedding_gown',
    silhouette: raw.silhouette || 'Ballgown',
    occasion: raw.occasion || 'Holy Matrimony',
    color_name: raw.color_name || 'Ivory & Warm Champagne',
    color_hex: raw.color_hex || '#F5EDE6',
    fabric: raw.fabric || 'French Chantilly Lace & Silk Organza',
    rental_price: Number(raw.rental_price ?? 0),
    original_rental_price:
      raw.original_rental_price !== undefined && raw.original_rental_price !== null
        ? Number(raw.original_rental_price)
        : null,
    purchase_price: Number(raw.purchase_price ?? 0),
    original_purchase_price:
      raw.original_purchase_price !== undefined && raw.original_purchase_price !== null
        ? Number(raw.original_purchase_price)
        : null,
    security_deposit: Number(raw.security_deposit ?? 1000000),
    is_rental_available: raw.is_rental_available !== false,
    is_purchase_available: raw.is_purchase_available !== false,
    badge_label: raw.badge_label || '',
    images: Array.isArray(raw.images) ? raw.images : [],
    description: raw.description || '',
    rating: Number(raw.rating ?? 5.0),
    reviews_count: Number(raw.reviews_count ?? 0),
    rented_count: Number(raw.rented_count ?? 0),
    sizes_available:
      Array.isArray(raw.sizes_available) && raw.sizes_available.length > 0
        ? raw.sizes_available
        : ['XS', 'S', 'M', 'L', 'Custom'],
    is_live: raw.is_live !== false,
    store_code: raw.store_code || 'EB_ATELIER',
    pickup_sla: raw.pickup_sla || '3_day',
    in_stock: raw.in_stock !== false,
    created_at: raw.created_at || new Date().toISOString(),
  }
}

export function useProducts() {
  return useQuery({
    queryKey: ['bridal-products'],
    queryFn: async (): Promise<BridalProduct[]> => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

          if (!error && data && data.length > 0) {
            const normalized = data.map((row, idx) =>
              normalizeProductRow(row as Partial<BridalProduct>, idx)
            )
            saveLocalProducts(normalized)
            return normalized
          }
        } catch (err) {
          console.warn('Supabase products fetch fallback to local catalog:', err)
        }
      }
      return loadLocalProducts()
    },
  })
}

export function useAddProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: BridalProductInput): Promise<BridalProduct> => {
      const newProduct: BridalProduct = {
        ...input,
        id: `eb-${Date.now().toString(36)}`,
        created_at: new Date().toISOString(),
      }

      if (isSupabaseConfigured && supabase) {
        try {
          const dbPayload = {
            title: newProduct.title,
            slug: newProduct.slug,
            product_type: newProduct.product_type,
            silhouette: newProduct.silhouette,
            occasion: newProduct.occasion,
            fabric: newProduct.fabric,
            description: newProduct.description,
            rental_price: newProduct.rental_price,
            original_rental_price: newProduct.original_rental_price,
            purchase_price: newProduct.purchase_price,
            security_deposit: newProduct.security_deposit,
            badge_label: newProduct.badge_label || null,
            sizes_available: newProduct.sizes_available,
            images: newProduct.images,
            is_active: newProduct.is_live,
          }
          const { data, error } = await supabase
            .from('products')
            .insert([dbPayload])
            .select()
            .single()

          if (!error && data) {
            newProduct.id = data.id
          }
        } catch (err) {
          console.warn('Saved new gown locally (Supabase sync skipped):', err)
        }
      }

      const current = loadLocalProducts()
      const next = [newProduct, ...current]
      saveLocalProducts(next)
      return newProduct
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bridal-products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updated: BridalProduct): Promise<BridalProduct> => {
      if (isSupabaseConfigured && supabase) {
        try {
          const dbPayload = {
            title: updated.title,
            slug: updated.slug,
            product_type: updated.product_type,
            silhouette: updated.silhouette,
            occasion: updated.occasion,
            fabric: updated.fabric,
            description: updated.description,
            rental_price: updated.rental_price,
            original_rental_price: updated.original_rental_price,
            purchase_price: updated.purchase_price,
            security_deposit: updated.security_deposit,
            badge_label: updated.badge_label || null,
            sizes_available: updated.sizes_available,
            images: updated.images,
            is_active: updated.is_live,
          }
          await supabase.from('products').update(dbPayload).eq('id', updated.id)
        } catch (err) {
          console.warn('Updated gown locally (Supabase sync skipped):', err)
        }
      }

      const current = loadLocalProducts()
      const next = current.map((p) => (p.id === updated.id ? updated : p))
      saveLocalProducts(next)
      return updated
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bridal-products'] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('products').delete().eq('id', id)
        } catch (err) {
          console.warn('Deleted gown locally (Supabase sync skipped):', err)
        }
      }

      const current = loadLocalProducts()
      const next = current.filter((p) => p.id !== id)
      saveLocalProducts(next)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bridal-products'] })
    },
  })
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

