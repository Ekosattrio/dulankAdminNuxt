import { defineEventHandler, getQuery } from 'h3'
import type { MemberUser } from '~~/server/types/user-management'
import { readJSON } from '~~/server/utils/data'
import { isDateWithinRange } from '~~/server/utils/dateRange'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = String(query.search || '').trim().toLowerCase()
  const status = String(query.status || '').trim()
  const startDate = query.startDate ? String(query.startDate).trim() : null
  const endDate = query.endDate ? String(query.endDate).trim() : null

  let result = readJSON<MemberUser[]>('users.json', [])

  if (search) {
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(search) ||
        m.email.toLowerCase().includes(search) ||
        m.customerId.toLowerCase().includes(search) ||
        (m.phone && m.phone.toLowerCase().includes(search))
    )
  }

  if (status && status !== 'All Statuses' && status !== 'All') {
    result = result.filter((m) => m.status === status)
  }

  if (startDate || endDate) {
    result = result.filter((m) => {
      const dateVal = m.createdAt || ''
      return isDateWithinRange(dateVal, startDate, endDate)
    })
  }

  return {
    success: true,
    data: result,
  }
})
