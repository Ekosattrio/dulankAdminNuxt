import { readData } from '~/server/utils/data'
import type { EmployeeItem } from '~/types/employee'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = readData<EmployeeItem>('employees.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (e) =>
        e.name.toLowerCase().includes(s) ||
        e.id.toLowerCase().includes(s) ||
        e.phone.includes(s) ||
        (e.email && e.email.toLowerCase().includes(s))
    )
  }

  if (query.department) {
    filtered = filtered.filter((e) => e.department.toLowerCase() === String(query.department).toLowerCase())
  }

  if (query.status) {
    filtered = filtered.filter((e) => e.status.toLowerCase() === String(query.status).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})

