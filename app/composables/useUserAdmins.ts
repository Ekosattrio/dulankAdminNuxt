import type { UserAdmin } from '#server/types/user-management'

export function useUserAdmins(filterParams?: Ref<{ search?: string; role?: string; status?: string }>) {
  const query = filterParams
    ? computed(() => ({
        search: filterParams?.value.search || '',
        role: filterParams?.value.role || '',
        status: filterParams?.value.status || '',
      }))
    : undefined

  const { data, pending, error, refresh } = useFetch<{ success: boolean; data: UserAdmin[] }>('/api/user-admins', {
    ...(query ? { query } : {}),
    key: 'user-admins-list',
  })

  const userAdmins = computed<UserAdmin[]>(() => data.value?.data || [])

  const saveUserAdmin = async (payload: Partial<UserAdmin>) => {
    return await $fetch<{ success: boolean; data: UserAdmin }>('/api/user-admins', {
      method: 'POST',
      body: payload,
    }).then(async (res) => {
      await refresh()
      return res
    })
  }

  const deleteUserAdmin = async (id: string) => {
    return await $fetch<{ success: boolean; data: UserAdmin }>(`/api/user-admins/${id}`, {
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
