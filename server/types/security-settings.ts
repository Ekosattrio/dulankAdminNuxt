export interface SecurityDevice {
  id: string
  name: string
  ip: string
  lastActive: string
}

export interface SecurityActivity {
  id: string
  action: string
  device: string
  date: string
}

export interface SecuritySettings {
  passwordLastChanged: string
  twoFactor: boolean
  googleAuth: boolean
  phone: string
  email: string
  devices: SecurityDevice[]
  activities: SecurityActivity[]
}

export interface SecuritySettingsResponse {
  success: boolean
  data: SecuritySettings
  message?: string
}

