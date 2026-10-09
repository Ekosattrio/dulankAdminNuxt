import { defineEventHandler } from 'h3'
import { readJSON } from '~~/server/utils/data'
import type { GdprSetting } from '~~/server/types/gdpr-setting'

export default defineEventHandler(async () => {
  try {
    const data = await readJSON<GdprSetting>('gdpr-settings.json', {
      consentText: 'We use cookies to improve your user experience and analyze website traffic.',
      position: 'Right',
      agreeText: 'Agree',
      declineText: 'Decline',
      showDecline: true,
      policyLink: 'https://kacetak.com/privacy-policy'
    })
    return {
      success: true,
      data
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to load GDPR settings'
    }
  }
})

