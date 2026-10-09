export interface FooterLink {
  id?: string
  text: string
  href: string
}

export interface FooterConfig {
  judul: string
  desc: string
  copyright: string
  infoKami: FooterLink[]
  panduan: FooterLink[]
  alamat: string
  telepon: string
  email: string
  socials: {
    facebook: string
    instagram: string
    twitter: string
    linkedin: string
    youtube: string
  }
}

// Backwards compatibility
export interface FooterLinkItem {
  id: string
  sectionName: string
  linkTitle: string
  url: string
  order: number
  status: 'Active' | 'Inactive'
  target?: '_self' | '_blank'
}

export interface FooterLinkFormData {
  id?: string
  sectionName: string
  linkTitle: string
  url: string
  order?: number
  status?: 'Active' | 'Inactive'
  target?: '_self' | '_blank'
}
