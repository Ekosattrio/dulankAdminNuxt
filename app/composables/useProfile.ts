import type { UserProfile, PasswordChangePayload } from '#server/types/profile'

interface ProfileApiResponse {
  success: boolean
  data: {
    user: {
      id: number | string
      name: string
      email: string
      phone?: string | null
      avatar?: string | null
      taxAddress?: string | null
    }
    roles: string[]
  }
  message?: string
}

interface MutationResponse {
  success: boolean
  data?: unknown
  message?: string
}

/**
 * Profil admin — backend Laravel `/api/v1/admin/profile`.
 * Mapping ke bentuk `UserProfile` yang dipakai halaman profil.
 */
export function useProfile() {
  const { data, pending, error, refresh } = useApiFetch<ProfileApiResponse>('/api/v1/admin/profile', {
    key: 'user-profile-data'
  })

  const profile = computed<UserProfile>(() => {
    const user = data.value?.data?.user
    const nameParts = String(user?.name ?? '').trim().split(/\s+/).filter(Boolean)
    const firstName = nameParts.shift() ?? ''

    return {
      id: user?.id !== undefined ? String(user.id) : '',
      firstName,
      lastName: nameParts.join(' '),
      userName: user?.email ?? '',
      phoneNumber: user?.phone ?? '',
      email: user?.email ?? '',
      role: data.value?.data?.roles?.[0] ?? 'Admin',
      avatarUrl: user?.avatar ?? '/assets/img/users/user-01.jpg',
      address: user?.taxAddress ?? '',
      country: 'Indonesia',
      province: '',
      city: '',
      postalCode: ''
    }
  })

  const saveProfile = async (payload: Partial<UserProfile>) => {
    const name = [payload.firstName, payload.lastName].filter(Boolean).join(' ').trim()

    const res = await apiFetch<MutationResponse>('/api/v1/admin/profile', {
      method: 'PUT',
      body: {
        ...(name ? { name } : {}),
        ...(payload.phoneNumber !== undefined ? { phone: payload.phoneNumber } : {}),
        ...(payload.email !== undefined ? { email: payload.email } : {}),
        ...(payload.address !== undefined ? { taxAddress: payload.address } : {})
      }
    })

    await refresh()
    return res
  }

  const changePassword = async (passwordData: PasswordChangePayload) => {
    return await apiFetch<MutationResponse>('/api/v1/admin/profile/password', {
      method: 'PUT',
      body: {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword
      }
    })
  }

  return {
    profile,
    pending,
    error,
    refresh,
    saveProfile,
    changePassword
  }
}
