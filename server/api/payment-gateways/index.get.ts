import { defineEventHandler } from 'h3'
import { readJSON } from '~~/server/utils/data'
import type { PaymentGatewaysRecord } from '~~/server/types/payment-gateway'

export default defineEventHandler(async () => {
  try {
    const data = await readJSON<PaymentGatewaysRecord>('payment-gateways.json', {
      midtrans: { name: 'Midtrans SNAP', desc: 'Indonesian gateway', enabled: true, clientKey: '', secretKey: '', mode: 'sandbox' },
      xendit: { name: 'Xendit Payment', desc: 'Accept direct debit', enabled: true, clientKey: '', secretKey: '', mode: 'sandbox' },
      paypal: { name: 'PayPal', desc: 'Worldwide payment gateway', enabled: true, clientKey: '', secretKey: '', mode: 'production' },
      stripe: { name: 'Stripe', desc: 'APIs for credit cards', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
      braintree: { name: 'Braintree', desc: 'Enterprise card processing', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
      wise: { name: 'Wise', desc: 'Multi-currency payouts', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' }
    })
    return {
      success: true,
      data
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to load payment gateways'
    }
  }
})

