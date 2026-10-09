import { ref } from 'vue'
import type { SmsGatewaysRecord, GatewayKey, GatewayConfig } from '#server/types/sms-gateway'

export function useSmsGateway() {
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
      const res = await apiFetch<{ success: boolean; data: SmsGatewaysRecord }>('/api/sms-gateways')
      if (res && res.data) {
        gateways.value = res.data
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch SMS gateways'
    } finally {
      pending.value = false
    }
  }

  async function saveGateways(payload: SmsGatewaysRecord) {
    pending.value = true
    try {
      const res = await apiFetch<{ success: boolean; data: SmsGatewaysRecord }>('/api/sms-gateways', {
        method: 'POST',
        body: payload
      })
      gateways.value = res.data
      return res.data
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

