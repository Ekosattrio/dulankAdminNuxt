export interface Province {
  id: string
  name: string
  code?: string
  added: string
  createdBy: string
  avatar: string
  status?: string
}

export interface Regency {
  id: string
  provinceId: string
  province: string
  name: string
  type?: 'Kota' | 'Kabupaten'
  added: string
  createdBy: string
  avatar: string
  status?: string
}

export interface District {
  id: string
  provinceId: string
  province: string
  regencyId: string
  regency: string
  name: string
  postalCode?: string
  added: string
  createdBy: string
  avatar: string
  status?: string
}

export interface ProvinceFormData {
  id?: string
  name: string
  code?: string
  status?: string
}

export interface RegencyFormData {
  id?: string
  provinceId?: string
  province: string
  name: string
  type?: 'Kota' | 'Kabupaten'
  status?: string
}

export interface DistrictFormData {
  id?: string
  provinceId?: string
  province: string
  regencyId?: string
  regency: string
  name: string
  postalCode?: string
  status?: string
}
