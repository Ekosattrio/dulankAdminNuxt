export interface BanIpItem {
  id: number
  ip: string
  reason: string
  date: string
  status: boolean
}

export type BanIpInput = Omit<BanIpItem, 'id' | 'date'>

export interface BanIpResponse {
  success: boolean
  data: BanIpItem[]
  message?: string
}

