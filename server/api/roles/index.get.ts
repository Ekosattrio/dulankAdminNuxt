import { initialRoles } from '~~/server/utils/userManagementStore'
import type { SystemRole } from '~~/server/types/user-management'
import { readJSON } from '~~/server/utils/data'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = String(query.search || '').trim().toLowerCase()
  const sort = String(query.sort || 'newest').trim()

  const roles = readJSON<SystemRole[]>('roles.json', initialRoles)
  let result = [...roles]

  if (search) {
    result = result.filter((r) => r.name.toLowerCase().includes(search))
  }

  if (sort === 'oldest') {
    result.reverse()
  }

  return {
    success: true,
    data: result,
  }
})
