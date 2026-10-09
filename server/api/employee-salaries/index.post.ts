import { readData, writeData } from '~/server/utils/data'
import type { EmployeeSalaryItem, EmployeeSalaryFormData } from '~/server/types/employeeSalary'

export default defineEventHandler(async (event) => {
  const body = await readBody<EmployeeSalaryFormData>(event)
  const items = readData<EmployeeSalaryItem>('employeeSalaries.json')

  const totalAllowance = (body.allowances || []).reduce((sum, a) => sum + (Number(a.amount) || 0), 0)

  if (body.id) {
    const index = items.findIndex((item) => String(item.id) === String(body.id))
    if (index !== -1) {
      const current = items[index]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Employee salary not found' })
      const updated: EmployeeSalaryItem = {
        ...current,
        employeeId: body.employeeId || current.employeeId,
        name: body.name || current.name,
        salary: Number(body.salary) || 0,
        system: body.system || current.system,
        allowanceTotal: totalAllowance,
        overtimeRate: Number(body.overtimeRate) || 0,
        status: body.status || current.status,
        allowances: body.allowances || []
      }
      items[index] = updated
      writeData('employeeSalaries.json', items)
      return { success: true, data: updated, message: 'Employee salary updated successfully' }
    }
  }

  const nextId = String(items.length > 0 ? Math.max(...items.map((i) => Number(i.id) || 0)) + 1 : 1)
  const newSalary: EmployeeSalaryItem = {
    id: nextId,
    employeeId: body.employeeId || `ST${String(nextId).padStart(3, '0')}`,
    name: body.name || '',
    salary: Number(body.salary) || 0,
    system: body.system || 'Monthly',
    allowanceTotal: totalAllowance,
    overtimeRate: Number(body.overtimeRate) || 15000,
    status: body.status || 'Active',
    allowances: body.allowances || []
  }

  items.push(newSalary)
  writeData('employeeSalaries.json', items)

  return {
    success: true,
    data: newSalary,
    message: 'Employee salary created successfully'
  }
})
