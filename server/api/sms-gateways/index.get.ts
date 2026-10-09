import { defineEventHandler } from 'h3'
import { readJSON } from '~~/server/utils/data'
import type { SmsGatewaysRecord } from '~~/server/types/sms-gateway'

export default defineEventHandler(async () => {
  try {
    const data = await readJSON<SmsGatewaysRecord>('sms-gateways.json', {
      nexmo: { name: 'Nexmo (Vonage)', desc: 'Global SMS & OTP API provider', enabled: true, apiKey: 'nx_live_89823472', apiSecret: '••••••••••••', senderId: 'KACETAK' },
      twoFactor: { name: '2Factor SMS', desc: 'High speed transactional SMS service', enabled: false, apiKey: '', apiSecret: '', senderId: 'KACETAK' },
      twilio: { name: 'Twilio SMS', desc: 'Enterprise communications platform', enabled: false, apiKey: '', apiSecret: '', senderId: '+1234567890' },
      zenziva: { name: 'Zenziva SMS / WhatsApp', desc: 'Indonesian local SMS & WA Gateway', enabled: true, apiKey: 'zen_live_091823', apiSecret: '••••••••••••', senderId: 'KACETAK' }
    })
    return {
      success: true,
      data
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to load SMS gateways'
    }
  }
})

