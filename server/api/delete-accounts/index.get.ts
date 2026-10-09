import { initialDeleteRequests } from '~~/server/utils/userManagementStore'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const search = String(query.search || '').trim().toLowerCase()
  const sort = String(query.sort || 'newest').trim()

  let result = [...initialDeleteRequests]

  if (search) {
    result = result.filter(
      (r) =>
        r.userName.toLowerCase().includes(search) ||
        r.email.toLowerCase().includes(search)
    )
  }

  if (sort === 'oldest') {
    result.reverse()
  }

  return {
    success: true,
    data: result,
  }
})
