import { defineEventHandler, getQuery } from 'h3'
import { getUsers } from '~~/server/utils/usersData'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = String(query.search || '').trim()
  const status = String(query.status || '').trim()
  const startDate = query.startDate ? String(query.startDate).trim() : null
  const endDate = query.endDate ? String(query.endDate).trim() : null

  const data = getUsers({ search, status, startDate, endDate })

  return {
    success: true,
    data,
  }
})
