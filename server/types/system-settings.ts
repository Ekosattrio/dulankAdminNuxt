export interface EmailConfig {
  mailHost: string
  mailPort: number
  mailUsername: string
  mailPassword?: string
  mailEncryption: 'tls' | 'ssl' | 'none'
  fromEmail: string
  fromName: string
  mailEngine?: 'smtp' | 'sendgrid' | 'phpmailer'
  status?: boolean
  updatedAt?: string
}

export interface TestEmailPayload {
  toEmail: string
  subject?: string
}

export interface TestEmailResult {
  success: boolean
  message: string
  sentTo: string
  timestamp: string
}

export interface LanguageItem {
  id: string
  code: string
  name: string
  flag?: string
  rtl: boolean
  totalKeys: number
  doneKeys: number
  progress?: number
  status: 'active' | 'inactive'
  isDefault?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LanguageFormData {
  id?: string
  code: string
  name: string
  flag?: string
  rtl?: boolean
  totalKeys?: number
  doneKeys?: number
  status?: 'active' | 'inactive'
  isDefault?: boolean
}

export interface OtpConfig {
  isEnabled: boolean
  provider: 'whatsapp' | 'sms' | 'email' | 'all'
  otpType?: 'numeric' | 'alphanumeric'
  digitLimit: number
  expireMinutes: number
  resendDelaySeconds: number
  updatedAt?: string
}

export interface PrefixItem {
  id: string
  key: string
  name: string
  prefix: string
  format?: string
  sample?: string
  description?: string
  updatedAt?: string
}

export interface PrefixFormData {
  id?: string
  key: string
  name: string
  prefix: string
  format?: string
  sample?: string
  description?: string
}
