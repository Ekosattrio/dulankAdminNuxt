import { ref } from 'vue'
import type { SmsGatewaysRecord, GatewayKey, GatewayConfig } from '#server/types/sms-gateway'

interface GatewayItem {
  id?: string
  name: string
  code: string
  status: string
  config: Record<string, unknown>
}

const LIST_URL = '/api/v1/admin/gateways/sms-gateways'

const readConfig = (item: GatewayItem): GatewayConfig => {
  const cfg = (item.config ?? {}) as Record<string, unknown>

  return {
    name: (cfg.name as string) ?? item.name ?? '',
    desc: (cfg.desc as string) ?? '',
    enabled: item.status === 'Active',
    apiKey: (cfg.apiKey as string) ?? '',
    apiSecret: (cfg.apiSecret as string) ?? '',
    senderId: (cfg.senderId as string) ?? '',
  }
}

export function useSmsGateway() {
  const ids = new Map<string, string>()
  const gateways = ref<SmsGatewaysRecord>({
    nexmo: { name: 'Nexmo (Vonage)', desc: 'Global SMS & OTP API provider', enabled: true, apiKey: '', apiSecret: '', senderId: '' },
    twoFactor: { name: '2Factor SMS', desc: 'High speed transactional SMS service', enabled: false, apiKey: '', apiSecret: '', senderId: '' },
    twilio: { name: 'Twilio SMS', desc: 'Enterprise communications platform', enabled: false, apiKey: '', apiSecret: '', senderId: '' },
    zenziva: { name: 'Zenziva SMS / WhatsApp', desc: 'Indonesian local SMS & WA Gateway', enabled: true, apiKey: '', apiSecret: '', senderId: '' }
  })
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchGateways() {
    pending.value = true
    error.value = null
    try {
      const res = await apiFetch<{ success: boolean; data: GatewayItem[] }>(LIST_URL)
      const dict = {} as SmsGatewaysRecord
      ids.clear()

      for (const item of res.data ?? []) {
        if (item.id) ids.set(item.code, item.id)
        dict[item.code as GatewayKey] = readConfig(item)
      }

      gateways.value = Object.keys(dict).length > 0 ? dict : gateways.value
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch SMS gateways'
    } finally {
      pending.value = false
    }
  }

  async function saveGateways(payload: SmsGatewaysRecord) {
    pending.value = true
    try {
      for (const [key, cfg] of Object.entries(payload)) {
        const body = {
          name: cfg.name,
          code: key,
          status: cfg.enabled ? 'Active' : 'Inactive',
          config: { name: cfg.name, desc: cfg.desc, apiKey: cfg.apiKey, apiSecret: cfg.apiSecret, senderId: cfg.senderId },
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
      error.value = err.message || 'Failed to save SMS gateways'
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