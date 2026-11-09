import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { requireSupabase, isSupabaseConfigured } from '../lib/supabase'
import type { BridalProduct, BridalProductInput } from '../types/product'
import { slugify } from '../utils/seoUtils'

const PRODUCTS_QUERY_KEY = ['bridal-products']

type ProductRow = Partial<BridalProduct> & { id: string }

function toProduct(row: ProductRow): BridalProduct {
  const title = row.title || 'Untitled Bridal Gown'
  return {
    id: row.id,
    code: row.code || '',
    title,
    slug: row.slug || slugify(title),
    product_type: row.product_type === 'party_dress' ? 'party_dress' : 'wedding_gown',
    silhouette: row.silhouette || 'Ballgown',
    occasion: row.occasion || 'Holy Matrimony',
    color_name: row.color_name || 'Ivory',
    color_hex: row.color_hex || '#F5EDE6',
    fabric: row.fabric || '',
    rental_price: Number(row.rental_price ?? 0),
    original_rental_price:
      row.original_rental_price === null || row.original_rental_price === undefined
        ? null
        : Number(row.original_rental_price),
    purchase_price: Number(row.purchase_price ?? 0),
    original_purchase_price:
      row.original_purchase_price === null || row.original_purchase_price === undefined
        ? null
        : Number(row.original_purchase_price),
    security_deposit: Number(row.security_deposit ?? 0),
    is_rental_available: row.is_rental_available !== false,
    is_purchase_available: row.is_purchase_available !== false,
    badge_label: row.badge_label || '',
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description || '',
    rating: Number(row.rating ?? 5),
    reviews_count: Number(row.reviews_count ?? 0),
    rented_count: Number(row.rented_count ?? 0),
    sizes_available: Array.isArray(row.sizes_available) ? row.sizes_available : [],
    is_live: row.is_live !== false,
    store_code: row.store_code || 'EB_ATELIER',
    pickup_sla: row.pickup_sla || '3_day',
    in_stock: row.in_stock !== false,
    created_at: row.created_at || new Date().toISOString(),
  }
}

/** Maps the form payload to database columns (id / created_at are managed by Postgres). */
function toRow(input: BridalProductInput) {
  return {
    code: input.code,
    title: input.title,
    slug: input.slug,
    product_type: input.product_type,
    silhouette: input.silhouette,
    occasion: input.occasion,
    color_name: input.color_name,
    color_hex: input.color_hex,
    fabric: input.fabric,
    description: input.description,
    rental_price: Math.round(input.rental_price),
    original_rental_price: input.original_rental_price ?? null,
    purchase_price: Math.round(input.purchase_price),
    original_purchase_price: input.original_purchase_price ?? null,
    security_deposit: Math.round(input.security_deposit),
    is_rental_available: input.is_rental_available,
    is_purchase_available: input.is_purchase_available,
    badge_label: input.badge_label || '',
    sizes_available: input.sizes_available,
    images: input.images,
    rating: input.rating,
    reviews_count: input.reviews_count,
    rented_count: input.rented_count,
    is_live: input.is_live,
    store_code: input.store_code,
    pickup_sla: input.pickup_sla,
    in_stock: input.in_stock,
  }
}

function friendlyError(message: string): Error {
  if (message.includes('duplicate key') && message.includes('slug')) {
    return new Error('A gown with this name/slug already exists. Please use a different name.')
  }
  if (message.toLowerCase().includes('row-level security')) {
    return new Error('Your account is not allowed to modify the catalog.')
  }
  return new Error(message)
}

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<BridalProduct[]> => {
      const { data, error } = await requireSupabase()
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw friendlyError(error.message)
      return (data as ProductRow[]).map(toProduct)
    },
  })
}

export function useAddProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: BridalProductInput): Promise<BridalProduct> => {
      const { data, error } = await requireSupabase()
        .from('products')
        .insert(toRow(input))
        .select()
        .single()

      if (error) throw friendlyError(error.message)
      return toProduct(data as ProductRow)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updated: BridalProduct): Promise<BridalProduct> => {
      const { data, error } = await requireSupabase()
        .from('products')
        .update(toRow(updated))
        .eq('id', updated.id)
        .select()
        .single()

      if (error) throw friendlyError(error.message)
      return toProduct(data as ProductRow)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const { error } = await requireSupabase().from('products').delete().eq('id', id)
      if (error) throw friendlyError(error.message)
      return id
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  })
}
