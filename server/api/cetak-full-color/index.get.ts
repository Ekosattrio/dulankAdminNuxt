import { readJSON } from '~/server/utils/data'
import type { CetakFullColorConfig } from '~/types/cetak-full-color'

export default defineEventHandler(async () => {
  const config = readJSON<CetakFullColorConfig>('cetak-full-color.json')

  return {
    success: true,
    data: config
  }
})

