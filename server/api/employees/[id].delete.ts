import type { EmployeeItem } from '../../types/employee'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<EmployeeItem>('employees.json')

  const updated = items.filter((e) => String(e.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Employee not found'
    })
  }

  writeData('employees.json', updated)

  return {
    success: true,
    data: { id }
  }
})

