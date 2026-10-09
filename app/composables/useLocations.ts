import type { Province, Regency, District } from '#server/types/location'

export function useProvinces() {
  const { data, pending, error, refresh } = useApiFetch<{ success: boolean; data: Province[] }>('/api/provinces', {
    key: 'provinces-list'
  })

  const provinces = computed<Province[]>(() => data.value?.data ?? [])

  const saveProvince = async (payload: Partial<Province>) => {
    const res = await apiFetch<{ success: boolean; data: Province; message?: string }>('/api/provinces', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteProvince = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/provinces/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    provinces,
    pending,
    error,
    refresh,
    saveProvince,
    deleteProvince
  }
}

export function useRegencies() {
  const { data, pending, error, refresh } = useApiFetch<{ success: boolean; data: Regency[] }>('/api/regencies', {
    key: 'regencies-list'
  })

  const regencies = computed<Regency[]>(() => data.value?.data ?? [])

  const saveRegency = async (payload: Partial<Regency>) => {
    const res = await apiFetch<{ success: boolean; data: Regency; message?: string }>('/api/regencies', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteRegency = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/regencies/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    regencies,
    pending,
    error,
    refresh,
    saveRegency,
    deleteRegency
  }
}

export function useDistricts() {
  const { data, pending, error, refresh } = useApiFetch<{ success: boolean; data: District[] }>('/api/districts', {
    key: 'districts-list'
  })

  const districts = computed<District[]>(() => data.value?.data ?? [])

  const saveDistrict = async (payload: Partial<District>) => {
    const res = await apiFetch<{ success: boolean; data: District; message?: string }>('/api/districts', {
      method: 'POST',
      body: payload
    })
    await refresh()
    return res
  }

  const deleteDistrict = async (id: string) => {
    const res = await apiFetch<{ success: boolean; message?: string }>(`/api/districts/${id}`, {
      method: 'DELETE'
    })
    await refresh()
    return res
  }

  return {
    districts,
    pending,
    error,
    refresh,
    saveDistrict,
    deleteDistrict
  }
}

export function useLocations() {
  const provinceState = useProvinces()
  const regencyState = useRegencies()
  const districtState = useDistricts()

  const pending = computed(() => provinceState.pending.value || regencyState.pending.value || districtState.pending.value)
  const error = computed(() => provinceState.error.value || regencyState.error.value || districtState.error.value)

  const refreshAll = async () => {
    await Promise.all([
      provinceState.refresh(),
      regencyState.refresh(),
      districtState.refresh()
    ])
  }

  const getRegenciesByProvince = (provinceNameOrId: string) => {
    if (!provinceNameOrId) return []
    const target = provinceNameOrId.toLowerCase()
    return regencyState.regencies.value.filter(
      (r) => r.province.toLowerCase() === target || r.provinceId.toLowerCase() === target
    )
  }

  const getDistrictsByRegency = (regencyNameOrId: string) => {
    if (!regencyNameOrId) return []
    const target = regencyNameOrId.toLowerCase()
    return districtState.districts.value.filter(
      (d) => d.regency.toLowerCase() === target || d.regencyId.toLowerCase() === target
    )
  }

  return {
    ...provinceState,
    ...regencyState,
    ...districtState,
    provinces: provinceState.provinces,
    regencies: regencyState.regencies,
    districts: districtState.districts,
    pending,
    error,
    refreshAll,
    getRegenciesByProvince,
    getDistrictsByRegency
  }
}
