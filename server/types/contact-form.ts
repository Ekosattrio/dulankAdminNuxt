export interface ContactFormItem {
  id: string
  name: string
  email: string
  phone: string
  subject?: string
  message: string
  date: string
  status?: 'Unread' | 'Read' | 'Replied'
}

export interface ContactFormStats {
  totalContact: number
}

export interface ContactFormFilterQuery {
  search?: string
  startDate?: string
  endDate?: string
}
