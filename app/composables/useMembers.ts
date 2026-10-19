import type { MemberUser } from '#server/types/user-management'

export interface MemberFilterParams {
  search?: string
  status?: string
  startDate?: string
  endDate?: string
}

interface MutationResponse {
  success: boolean
  data: MemberUser
  message: string
}

const RELIST = '/api/v1/admin/users'

/**
 * Member (user store) — backend Laravel `/api/v1/admin/users`.
 * Member terdaftar lewat store/web; admin memantau, mengedit, dan
 * menunda/aktifkan — pembuatan member manual tidak didukung backend.
 */
export function useMembers(filterParams?: Ref<MemberFilterParams>) {
  const query = filterParams
    ? computed(() => ({
        search: filterParams?.value.search || '',
        status: filterParams?.value.status || '',
        startDate: filterParams?.value.startDate || '',
        endDate: filterParams?.value.endDate || '',
        limit: 100,
      }))
    : undefined

  const { data, pending, error, refresh } = useApiFetch<{ success: boolean; data: MemberUser[] }>(RELIST, {
    ...(query ? { query } : {}),
    key: 'user-members-list',
  })

  const members = computed<MemberUser[]>(() => data.value?.data || [])

  const saveMember = async (payload: Partial<MemberUser>) => {
    if (!payload.id) {
      throw new Error('Member didaftarkan lewat store/web; admin hanya mengedit data member.')
    }

    return await apiFetch<MutationResponse>(`${RELIST}/${encodeURIComponent(payload.id)}`, {
      method: 'PUT',
      body: payload,
    }).then(async (res) => {
      await refresh()
      return res
    })
  }

  const deleteMember = async (id: string) => {
    return await apiFetch<MutationResponse>(`${RELIST}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).then(async (res) => {
      await refresh()
      return res
    })
  }

  return {
    members,
    pending,
    error,
    refresh,
    saveMember,
    deleteMember,
  }
}