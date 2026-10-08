import type { UserProfile, PasswordChangePayload } from '#server/types/profile'

interface ProfileApiResponse {
  success: boolean
  data: UserProfile
  message?: string
}

export function useProfile() {
  const { data, pending, error, refresh } = useFetch<ProfileApiResponse>('/api/profile', {
    key: 'user-profile-data'
  })

  const profile = computed<UserProfile>(() => data.value?.data ?? {
    id: '',
    firstName: '',
    lastName: '',
    userName: '',
    phoneNumber: '',
    email: '',
    role: '',
    avatarUrl: '/assets/img/users/user-01.jpg',
    address: '',
    country: 'Indonesia',
    province: '',
    city: '',
    postalCode: ''
  })

  const saveProfile = async (payload: Partial<UserProfile>) => {
    const res = await $fetch<{ success: boolean; data: UserProfile; message?: string }>('/api/profile', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const changePassword = async (passwordData: PasswordChangePayload) => {
    const res = await $fetch<{ success: boolean; data: any; message?: string }>('/api/profile', {
      method: 'POST',
      body: {
        action: 'change-password',
        passwordData
      }
    })
    return res
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
