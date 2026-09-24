import { readData, writeData } from '~/server/utils/data'
import type { EmployeeItem } from '~/types/employee'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<EmployeeItem>>(event)
  const items = readData<EmployeeItem>('employees.json')

  const nowFormatted = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  if (body.id) {
    const index = items.findIndex((e) => String(e.id) === String(body.id))
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...body
      } as EmployeeItem
      writeData('employees.json', items)
      return { success: true, data: items[index], message: 'Employee updated successfully' }
    }
  }

  const nextNum = items.length + 1
  const newEmp: EmployeeItem = {
    id: body.id || `ST${String(nextNum).padStart(3, '0')}`,
    name: body.name || '',
    department: body.department || 'Produksi',
    address: body.address || '',
    detailAddress: body.detailAddress || '',
    phone: body.phone || '',
    joinDate: body.joinDate || nowFormatted,
    status: body.status || 'Active',
    gender: body.gender || 'Male',
    dob: body.dob || '',
    joinChannel: body.joinChannel || 'Offline',
    contact1Name: body.contact1Name || '',
    contact1Phone: body.contact1Phone || '',
    contact2Name: body.contact2Name || '',
    contact2Phone: body.contact2Phone || '',
    email: body.email || ''
  }

  items.unshift(newEmp)
  writeData('employees.json', items)

  return {
    success: true,
    data: newEmp,
    message: 'Employee created successfully'
  }
})

