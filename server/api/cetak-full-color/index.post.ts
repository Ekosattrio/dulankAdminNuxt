import type { CetakFullColorConfig } from '#server/types/cetak-full-color'
import { saveCetakFullColorConfig } from '~~/server/utils/calculatorComponentsData'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CetakFullColorConfig>>(event)
  const updated = saveCetakFullColorConfig(body)

  return {
    success: true,
    data: updated,
    message: 'Cetak full color settings updated successfully',
  }
})
