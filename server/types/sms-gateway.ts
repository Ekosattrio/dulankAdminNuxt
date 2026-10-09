export type GatewayKey = 'nexmo' | 'twoFactor' | 'twilio' | 'zenziva'

export interface GatewayConfig {
  name: string
  desc: string
  enabled: boolean
  apiKey: string
  apiSecret: string
  senderId: string
}

export type SmsGatewaysRecord = Record<GatewayKey, GatewayConfig>

