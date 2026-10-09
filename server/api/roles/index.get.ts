import { getRoles } from '~~/server/utils/rolesData'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = String(query.search || '').trim()
  const sort = String(query.sort || 'newest').trim()

  const data = getRoles({ search, sort })

  return {
    success: true,
    data,
  }
})
