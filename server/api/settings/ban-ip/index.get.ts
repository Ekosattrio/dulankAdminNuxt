import { defineEventHandler } from 'h3'
import { getBanIpList } from '#server/utils/banIpData'

export default defineEventHandler(async () => {
  const data = getBanIpList()
  return {
    success: true,
    data
  }
})

