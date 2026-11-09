import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseUrl.startsWith('http')
)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  'Database is not connected. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then redeploy.'

/** Returns the Supabase client or throws a clear error when env vars are missing. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(SUPABASE_NOT_CONFIGURED_MESSAGE)
  }
  return supabase
}

const MEDIA_BUCKET = 'media'

/** Uploads an image to the shared public `media` bucket and returns its public URL. */
export async function uploadMediaFile(
  file: File,
  folder: 'products' | 'articles'
): Promise<string> {
  const client = requireSupabase()
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`

  const { error } = await client.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false })

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`)
  }

  return client.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
}
