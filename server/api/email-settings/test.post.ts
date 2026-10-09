import type { TestEmailPayload } from '#server/types/system-settings'
import { testEmailConfig } from '~~/server/utils/settingsDomainData'

export default defineEventHandler(async (event) => {
  const body = await readBody<TestEmailPayload & { to?: string }>(event)
  const targetEmail = body?.toEmail || body?.to
  const result = testEmailConfig(targetEmail)

  return {
    success: true,
    data: result,
    message: result.message,
  }
})
