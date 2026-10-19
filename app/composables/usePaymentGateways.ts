import { ref } from 'vue'
import type { PaymentGatewaysRecord, PaymentGatewayKey, PaymentGatewayConfig } from '#server/types/payment-gateway'

interface GatewayItem {
  id?: string
  name: string
  code: string
  status: string
  config: Record<string, unknown>
}

const LIST_URL = '/api/v1/admin/gateways/payment-gateways'

const readConfig = (item: GatewayItem): PaymentGatewayConfig => {
  const cfg = (item.config ?? {}) as Record<string, unknown>

  return {
    name: (cfg.name as string) ?? item.name ?? '',
    desc: (cfg.desc as string) ?? '',
    enabled: item.status === 'Active',
    clientKey: (cfg.clientKey as string) ?? '',
    secretKey: (cfg.secretKey as string) ?? '',
    mode: (cfg.mode as PaymentGatewayConfig['mode']) ?? 'sandbox',
  }
}

export function usePaymentGateways() {
  const ids = new Map<string, string>()
  const gateways = ref<PaymentGatewaysRecord>({
    midtrans: { name: 'Midtrans', desc: 'Payment gateway Indonesia', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
    xendit: { name: 'Xendit', desc: 'Pembayaran digital Indonesia', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
    paypal: { name: 'PayPal', desc: 'Pembayaran internasional', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
    stripe: { name: 'Stripe', desc: 'Payment platform global', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
    braintree: { name: 'Braintree', desc: 'Payment platform PayPal', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
    wise: { name: 'Wise', desc: 'Transfer internasional', enabled: false, clientKey: '', secretKey: '', mode: 'sandbox' },
  })
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchGateways() {
    pending.value = true
    error.value = null
    try {
      const res = await apiFetch<{ success: boolean; data: GatewayItem[] }>(LIST_URL)
      const dict = {} as PaymentGatewaysRecord
      ids.clear()

      for (const item of res.data ?? []) {
        if (item.id) ids.set(item.code, item.id)
        dict[item.code as PaymentGatewayKey] = readConfig(item)
      }

      gateways.value = Object.keys(dict).length > 0 ? dict : gateways.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch payment gateways'
    } finally {
      pending.value = false
    }
  }

  async function saveGateways(payload: PaymentGatewaysRecord) {
    pending.value = true
    try {
      for (const [key, cfg] of Object.entries(payload)) {
        const body = {
          name: cfg.name,
          code: key,
          status: cfg.enabled ? 'Active' : 'Inactive',
          config: { name: cfg.name, desc: cfg.desc, clientKey: cfg.clientKey, secretKey: cfg.secretKey, mode: cfg.mode },
        }
        const existingId = ids.get(key)

        await apiFetch(existingId ? `${LIST_URL}/${encodeURIComponent(existingId)}` : LIST_URL, {
          method: existingId ? 'PUT' : 'POST',
          body,
        })
      }
      await fetchGateways()
      return gateways.value
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