import { readData, writeData } from '~/server/utils/data'
import type { Designation } from '~/types/designation'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<Designation>>(event)
  const items = readData<Designation>('designations.json')

  const nowFormatted = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  if (body.id) {
    const index = items.findIndex((d) => String(d.id) === String(body.id))
    if (index !== -1) {
      const members = body.members || items[index].members || []
      items[index] = {
        ...items[index],
        ...body,
        members,
        totalMembers: members.length
      } as Designation
      writeData('designations.json', items)
      return { success: true, data: items[index], message: 'Designation updated successfully' }
    }
  }

  const nextNum = items.length + 1
  const members = body.members || ['user-01.jpg']
  const newDesignation: Designation = {
    id: body.id || `DS${String(nextNum).padStart(2, '0')}`,
    name: body.name || '',
    members,
    createdOn: body.createdOn || nowFormatted,
    totalMembers: members.length,
    status: body.status || 'Active'
  }

  items.push(newDesignation)
  writeData('designations.json', items)

  return {
    success: true,
    data: newDesignation,
    message: 'Designation created successfully'
  }
})

