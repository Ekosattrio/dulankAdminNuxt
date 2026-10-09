import { getCetakFullColorConfig } from '~~/server/utils/calculatorComponentsData'

export default defineEventHandler(async () => {
  const config = getCetakFullColorConfig()

  return {
    success: true,
    data: config,
  }
})
