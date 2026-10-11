import { readCetakFullColorConfig } from '~/server/utils/cetakFullColor'

export default defineEventHandler(async () => {
  const config = readCetakFullColorConfig()

  return {
    success: true,
    data: config
  }
})

