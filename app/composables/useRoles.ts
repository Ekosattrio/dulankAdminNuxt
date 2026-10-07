import type { SystemRole } from '#server/types/user-management'

export function useRoles(filterParams?: Ref<{ search?: string; sort?: string }>) {
  const query = filterParams
    ? computed(() => ({
        search: filterParams?.value.search || '',
        sort: filterParams?.value.sort || 'newest',
      }))
    : undefined

  const { data, pending, error, refresh } = useFetch<{ success: boolean; data: SystemRole[] }>('/api/roles', {
    ...(query ? { query } : {}),
    key: 'system-roles-list',
  })

  const roles = computed<SystemRole[]>(() => data.value?.data || [])

  const saveRole = async (payload: Partial<SystemRole>) => {
    const res = await $fetch<{ success: boolean; data: SystemRole }>('/api/roles', {
      method: 'POST',
      body: payload,
    })
    if (res?.data && data.value?.data) {
      const idx = data.value.data.findIndex((r) => r.id === res.data.id)
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
    const res = await $fetch<{ success: boolean; data: SystemRole }>(`/api/roles/${id}`, {
      method: 'DELETE',
    })
    if (data.value?.data) {
      data.value.data = data.value.data.filter((r) => r.id !== id)
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
