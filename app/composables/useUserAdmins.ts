import type { UserAdmin } from '#server/types/user-management'

interface MutationResponse {
  success: boolean
  data: UserAdmin
  message: string
}

/**
 * User admin — backend Laravel `/api/v1/admin/user-admins` (CRUD penuh).
 */
export function useUserAdmins(filterParams?: Ref<{ search?: string; role?: string; status?: string }>) {
  const query = filterParams
    ? computed(() => ({
        search: filterParams?.value.search || '',
        role: filterParams?.value.role || '',
        status: filterParams?.value.status || '',
        limit: 100,
      }))
    : undefined

  const { data, pending, error, refresh } = useApiFetch<{ success: boolean; data: UserAdmin[] }>(
    '/api/v1/admin/user-admins',
    {
      ...(query ? { query } : {}),
      key: 'user-admins-list',
    },
  )

  const userAdmins = computed<UserAdmin[]>(() => data.value?.data || [])

  const saveUserAdmin = async (payload: Partial<UserAdmin>) => {
    const body = { ...payload } as Record<string, unknown>
    delete body.id
    delete body.userId
    delete body.avatar
    delete body.createdAt

    return await apiFetch<MutationResponse>(
      payload.id
        ? `/api/v1/admin/user-admins/${encodeURIComponent(payload.id)}`
        : '/api/v1/admin/user-admins',
      {
        method: payload.id ? 'PUT' : 'POST',
        body,
      },
    ).then(async (res) => {
      await refresh()
      return res
    })
  }

  const deleteUserAdmin = async (id: string) => {
    return await apiFetch<MutationResponse>(`/api/v1/admin/user-admins/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).then(async (res) => {
      await refresh()
      return res
    })
  }

  return {
    userAdmins,
    pending,
    error,
    refresh,
    saveUserAdmin,
    deleteUserAdmin,
  }
}