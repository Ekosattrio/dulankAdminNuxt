export interface CompanyImages {
  logo: string
  icon: string
  favicon: string
  darkLogo: string
}

export interface CompanySetting {
  id: string
  companyName: string
  tagline: string
  email: string
  phone: string
  fax?: string
  website: string
  npwp: string
  currency: string
  address: string
  country: string
  province: string
  city: string
  postalCode: string
  images: CompanyImages
}

export interface CompanySettingUpdatePayload extends Partial<Omit<CompanySetting, 'images'>> {
  images?: Partial<CompanyImages>
}
