import { readJSON, writeJSON } from '~/server/utils/data'
import type { CetakFullColorConfig } from '~/types/cetak-full-color'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CetakFullColorConfig>>(event)
  const current = readJSON<CetakFullColorConfig>('cetak-full-color.json')

  const updated: CetakFullColorConfig = {
    ...current,
    ...body
  }

  writeJSON('cetak-full-color.json', updated)

  return {
    success: true,
    data: updated,
    message: 'Cetak full color settings updated successfully'
  }
})

