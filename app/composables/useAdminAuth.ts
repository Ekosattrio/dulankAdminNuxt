import { ADMIN_TOKEN_KEY } from '~/utils/apiFetch'

export interface AdminUser {
  id: number | string
  name: string
  email: string
  phone?: string | null
  avatar?: string | null
}

interface LoginResponse {
  success: boolean
  data: {
    token: string
    user: AdminUser
    roles?: string[]
  }
  message?: string
}

interface MeResponse {
  success: boolean
  data: {
    user: AdminUser
    roles: string[]
    permissions: string[]
  }
}

/**
 * Sesi admin berbasis token Sanctum.
 *
 * Token disimpan di cookie (SSR-safe) + localStorage (client-only calls)
 * sehingga `apiFetch` dapat menyisipkan header Authorization di semua konteks.
 */
export function useAdminAuth() {
  const token = useCookie<string | null>(ADMIN_TOKEN_KEY, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    path: '/',
  })
  const user = useState<AdminUser | null>('admin-user', () => null)
  const roles = useState<string[]>('admin-roles', () => [])

  const isAuthenticated = computed(() => Boolean(token.value))

  const persistToken = (value: string | null, remember = true) => {
    token.value = value

    if (import.meta.client) {
      try {
        if (value && remember) {
          window.localStorage.setItem(ADMIN_TOKEN_KEY, value)
        } else {
          window.localStorage.removeItem(ADMIN_TOKEN_KEY)
        }
      } catch {
        // abaikan
      }
    }
  }

  const login = async (email: string, password: string, remember = false) => {
    const response = await apiFetch<LoginResponse>('/api/v1/admin/auth/login', {
      method: 'POST',
      body: { email, password, device_name: 'dulank-admin-web' },
    })

    persistToken(response.data.token, remember)
    user.value = response.data.user
    roles.value = response.data.roles ?? []

    return response
  }

  const fetchMe = async () => {
    const response = await apiFetch<MeResponse>('/api/v1/admin/auth/me')
    user.value = response.data.user
    roles.value = response.data.roles ?? []

    return response
  }

  const logout = async () => {
    try {
      await apiFetch('/api/v1/admin/auth/logout', { method: 'POST' })
    } catch {
      // token mungkin sudah tidak valid
    } finally {
      persistToken(null)
      user.value = null
      roles.value = []
    }
  }

  return {
    token,
    user,
    roles,
    isAuthenticated,
    login,
    logout,
    fetchMe,
  }
}
