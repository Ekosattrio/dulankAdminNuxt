export type PaymentGatewayKey = 'midtrans' | 'xendit' | 'paypal' | 'stripe' | 'braintree' | 'wise'

export interface PaymentGatewayConfig {
  name: string
  desc: string
  enabled: boolean
  clientKey: string
  secretKey: string
  mode: 'sandbox' | 'production'
}

export type PaymentGatewaysRecord = Record<PaymentGatewayKey, PaymentGatewayConfig>

