import { readData, writeData } from '~/server/utils/data'
import type { EmployeeSalaryItem } from '~/server/types/employeeSalary'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<EmployeeSalaryItem>('employeeSalaries.json')

  const index = items.findIndex((item) => String(item.id) === String(id) || String(item.employeeId) === String(id))
  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Employee salary record not found'
    })
  }

  const deleted = items.splice(index, 1)[0]
  writeData('employeeSalaries.json', items)

  return {
    success: true,
    data: deleted,
    message: 'Employee salary record deleted successfully'
  }
})
