import { ref } from 'vue'
import type { PaymentGatewaysRecord, PaymentGatewayKey, PaymentGatewayConfig } from '#server/types/payment-gateway'

export function usePaymentGateways() {
  const gateways = ref<PaymentGatewaysRecord>({
    midtrans: { name: 'Midtrans SNAP', desc: '', enabled: true, clientKey: '', secretKey: '', mode: 'sandbox' },
    xendit: { name: 'Xendit Payment', desc: '', enabled: true, clientKey: '', secretKey: '', mode: 'sandbox' },
    paypal: { name: 'PayPal', desc: '', enabled: true, clientKey: '', secretKey: '', mode: 'production' },
    stripe: { name: 'Stripe', desc: '', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
    braintree: { name: 'Braintree', desc: '', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
    wise: { name: 'Wise', desc: '', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' }
  })
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchGateways() {
    pending.value = true
    error.value = null
    try {
      const res = await $fetch<{ success: boolean; data: PaymentGatewaysRecord }>('/api/payment-gateways')
      if (res && res.data) {
        gateways.value = res.data
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch payment gateways'
    } finally {
      pending.value = false
    }
  }

  async function saveGateways(payload: PaymentGatewaysRecord) {
    pending.value = true
    try {
      const res = await $fetch<{ success: boolean; data: PaymentGatewaysRecord }>('/api/payment-gateways', {
        method: 'POST',
        body: payload
      })
      gateways.value = res.data
      return res.data
    } catch (err: any) {
      error.value = err.message || 'Failed to save payment gateways'
      throw err
    } finally {
      pending.value = false
    }
  }

  fetchGateways()

  return {
    gateways,
    pending,
    error,
    refresh: fetchGateways,
    saveGateways
  }
}

