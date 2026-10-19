import type { FetchOptions } from 'ofetch'
import type { FetchError } from 'ofetch'

type ApiFetch = <T = unknown>(url: string, options?: FetchOptions<'json'>) => Promise<T>

export const ADMIN_TOKEN_KEY = 'dulank_admin_token'

const AUTH_ENDPOINT = /\/auth\/(login|logout|me)$/

function readToken(): string | null {
  try {
    const cookie = useCookie<string | null>(ADMIN_TOKEN_KEY)
    if (cookie.value) return cookie.value
  } catch {
    // di luar konteks Nuxt (mis. event handler murni client)
  }

  if (import.meta.client) {
    try {
      return window.localStorage.getItem(ADMIN_TOKEN_KEY)
    } catch {
      return null
    }
  }

  return null
}

function clearToken(): void {
  try {
    const cookie = useCookie<string | null>(ADMIN_TOKEN_KEY)
    cookie.value = null
  } catch {
    // abaikan di luar konteks Nuxt
  }

  if (import.meta.client) {
    try {
      window.localStorage.removeItem(ADMIN_TOKEN_KEY)
    } catch {
      // abaikan
    }
  }
}

function resolveBaseURL(): string {
  try {
    const configured = (useRuntimeConfig().public.apiBase as string) || ''
    if (configured) {
      return configured
    }
  } catch {
    // di luar konteks Nuxt
  }

  // SSR: relative URL perlu origin sendiri agar permintaan masuk ke
  // routeRules proxy (`/api/v1/**` → Laravel) — setara useRequestFetch.
  if (import.meta.server) {
    try {
      return useRequestURL().origin
    } catch {
      // lanjut ke fallback
    }
  }

  try {
    return (process.env.NUXT_PUBLIC_API_BASE as string) || ''
  } catch {
    return ''
  }
}

/**
 * Token kedaluwarsa/ditolak (401) selain endpoint auth: bersihkan sesi dan
 * kembalikan pengguna ke halaman signin — halaman asal disimpan agar bisa
 * dilanjutkan setelah login ulang.
 */
async function handleUnauthorized(url: string): Promise<void> {
  if (!import.meta.client || AUTH_ENDPOINT.test(url)) {
    return
  }

  if (!readToken()) {
    return
  }

  clearToken()

  const target = window.location.pathname + window.location.search
  await navigateTo({ path: '/signin', query: target === '/' ? {} : { redirect: target } })
}

/**
 * Fetch terpusat untuk endpoint backend Laravel (`/api/v1/**`):
 * - baseURL dari runtimeConfig.public.apiBase (kosong = same-origin/proxy),
 * - menyisipkan Authorization Bearer dari token admin,
 * - respons 401 (token invalid) otomatis membersihkan sesi,
 * - mock lama `/api/*` tetap dapat dipanggil lewat helper ini tanpa perubahan.
 */
export const apiFetch = ((url: string, options: FetchOptions<'json'> = {}) => {
  const headers = new Headers((options.headers as HeadersInit | undefined) ?? undefined)
  headers.set('Accept', 'application/json')

  const token = readToken()
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return rawFetch(url, {
    ...options,
    baseURL: resolveBaseURL(),
    headers,
  }).catch(async (error: unknown) => {
    const fetchError = error as FetchError
    if (fetchError?.status === 401) {
      await handleUnauthorized(url)
    }

    throw error
  })
}) as ApiFetch

// Nitro's generated route union can exceed TypeScript's instantiation depth in this project.
// Keep the runtime $fetch implementation while typing responses at each domain boundary.
const rawFetch = $fetch as unknown as ApiFetch