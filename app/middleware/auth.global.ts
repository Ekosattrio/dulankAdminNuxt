const PUBLIC_ROUTES = new Set([
  '/signin',
  '/forgot-password',
  '/reset-password',
  '/auth',
])

const normalizePath = (path: string): string => path.replace(/\.html$/, '').replace(/\/+$/, '') || '/'

/**
 * Guard halaman admin:
 * - tanpa token → `/signin?redirect=<halaman asal>` (kembali setelah login),
 * - sudah login mengunjungi halaman publik → `/`,
 * - sesi valid → muat profil user (nama/roles/avatar) untuk header & sapaan.
 * Nama halaman memakai `/signin` (x-www-form-urlencoded, session),
 * alias `.html` legacy dinormalkan agar tidak tertolak.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const path = normalizePath(to.path)
  const { isAuthenticated, user, fetchMe } = useAdminAuth()
  const isPublic = PUBLIC_ROUTES.has(path)

  if (isPublic) {
    if (isAuthenticated.value) {
      return navigateTo('/')
    }

    return
  }

  if (!isAuthenticated.value) {
    const redirectTarget = to.fullPath === '/' ? undefined : to.fullPath

    return navigateTo({ path: '/signin', query: redirectTarget ? { redirect: redirectTarget } : {} })
  }

  if (!user.value) {
    try {
      await fetchMe()
    } catch {
      // Token tidak valid: apiFetch (client) membersihkan sesi & kembali ke
      // signin; pada SSR permintaan data berikutnya akan mendapat 401.
    }
  }
})
