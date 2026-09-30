// master.ts — type/interface untuk domain master (auto-import shared/types)
// Dibuat oleh refactor Nuxt 4: interface dipisah dari halaman ke folder tersendiri.

export interface AddressItem {
  id: string;
  entityId: string;
  name: string;
  contact: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  otherDetail: string;
  tag: string;
  date: string;
}

export interface DistrictItem {
  id?: number
  province: string
  regency: string
  name: string
  added: string
  createdBy: string
  avatar: string
}

export interface ProvinceItem {
  id?: number;
  name: string;
  added: string;
  createdBy: string;
  avatar: string;
}

export interface RegencyItem {
  id?: number;
  province: string;
  name: string;
  added: string;
  createdBy: string;
  avatar: string;
}
