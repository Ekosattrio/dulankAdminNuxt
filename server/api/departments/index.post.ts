import { readData, writeData } from '~/server/utils/data'
import type { Department } from '~/types/department'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Department>>(event)
  const items = readData<Department>('departments.json')

  const nowFormatted = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  if (body.id) {
    const index = items.findIndex((d) => String(d.id) === String(body.id))
    if (index !== -1) {
      const current = items[index]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Department not found' })
      const members = body.members || current.members || []
      const updated: Department = {
        ...current,
        ...body,
        members,
        totalMembers: members.length
      }
      items[index] = updated
      writeData('departments.json', items)
      return { success: true, data: updated, message: 'Department updated successfully' }
    }
  }

  const nextNum = items.length + 1
  const members = body.members || []
  const newDept: Department = {
    id: body.id || `D${String(nextNum).padStart(2, '0')}`,
    name: body.name || '',
    members,
    totalMembers: members.length,
    createdDate: body.createdDate || nowFormatted,
    status: body.status || 'Active'
  }

  items.push(newDept)
  writeData('departments.json', items)

  return {
    success: true,
    data: newDept,
    message: 'Department created successfully'
  }
})

