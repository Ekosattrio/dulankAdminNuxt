import type { SystemRole } from '#server/types/user-management'

interface RoleResponse {
  success: boolean
  data: SystemRole[]
}

interface MutationResponse {
  success: boolean
  data: SystemRole
  message?: string
}

const RELIST = '/api/v1/admin/roles'

/**
 * Role & permission matrix — backend Laravel `/api/v1/admin/roles`.
 */
export function useRoles(filterParams?: Ref<{ search?: string; sort?: string }>) {
  const query = filterParams
    ? computed(() => ({
        search: filterParams?.value.search || '',
        sort: filterParams?.value.sort || 'newest',
      }))
    : undefined

  const { data, pending, error, refresh } = useApiFetch<RoleResponse>(RELIST, {
    ...(query ? { query } : {}),
    key: 'system-roles-list',
  })

  const roles = computed<SystemRole[]>(() => data.value?.data || [])

  const saveRole = async (payload: Partial<SystemRole>) => {
    const { id, createdOn, ...body } = payload
    void createdOn

    const res = await apiFetch<MutationResponse>(
      id ? `${RELIST}/${encodeURIComponent(id)}` : RELIST,
      {
        method: id ? 'PUT' : 'POST',
        body,
      },
    )
    if (res?.data && data.value?.data) {
      const idx = data.value.data.findIndex((r: SystemRole) => r.id === res.data.id)
      if (idx !== -1) {
        data.value.data[idx] = res.data
      } else {
        data.value.data.unshift(res.data)
      }
    }
    await refresh()
    return res
  }

  const deleteRole = async (id: string) => {
    const res = await apiFetch<MutationResponse>(`${RELIST}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    if (data.value?.data) {
      data.value.data = data.value.data.filter((r: SystemRole) => r.id !== id)
    }
    await refresh()
    return res
  }

  return {
    roles,
    pending,
    error,
    refresh,
    saveRole,
    deleteRole,
  }
}