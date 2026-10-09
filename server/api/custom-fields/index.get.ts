import { defineEventHandler } from 'h3'
import { getCustomFields } from '#server/utils/customFieldsData'

export default defineEventHandler(async () => {
  const data = getCustomFields()
  return {
    success: true,
    data
  }
})

