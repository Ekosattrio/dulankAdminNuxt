import { initialUserAdmins } from '~~/server/utils/userManagementStore'
import type { UserAdmin } from '~~/server/types/user-management'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = String(query.search || '').trim().toLowerCase()
  const role = String(query.role || '').trim()
  const status = String(query.status || '').trim()

  let result = [...initialUserAdmins]

  if (search) {
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.email.toLowerCase().includes(search) ||
        a.userId.toLowerCase().includes(search)
    )
  }

  if (role) {
    result = result.filter((a) => a.role === role)
  }

  if (status) {
    result = result.filter((a) => a.status === status)
  }

  return {
    success: true,
    data: result,
  }
})
