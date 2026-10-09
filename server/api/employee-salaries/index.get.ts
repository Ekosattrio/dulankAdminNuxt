import { readData } from '~/server/utils/data'
import type { EmployeeSalaryItem } from '~/server/types/employeeSalary'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const items = readData<EmployeeSalaryItem>('employeeSalaries.json')

  let filtered = [...items]

  if (query.search) {
    const s = String(query.search).toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(s) ||
        item.employeeId.toLowerCase().includes(s)
    )
  }

  if (query.system) {
    filtered = filtered.filter((item) => item.system.toLowerCase() === String(query.system).toLowerCase())
  }

  if (query.status) {
    filtered = filtered.filter((item) => item.status.toLowerCase() === String(query.status).toLowerCase())
  }

  return {
    success: true,
    data: filtered
  }
})
