import { getPaymentGateways } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async () => {
  try {
    const data = getPaymentGateways()
    return {
      success: true,
      data,
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to load payment gateways',
    }
  }
})
