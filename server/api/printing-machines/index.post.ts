import { readData, writeData } from '~/server/utils/data'
import type { PrintingMachine } from '~/types/printing-machine'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<PrintingMachine>>(event)
  const items = readData<PrintingMachine>('printing-machines.json')

  const nowFormatted = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ' Admin'

  if (body.id) {
    const index = items.findIndex((m) => String(m.id) === String(body.id))
    if (index !== -1) {
      const current = items[index]
      if (!current) throw createError({ statusCode: 404, statusMessage: 'Printing machine not found' })
      const updated: PrintingMachine = {
        ...current,
        ...body,
        colors: Number(body.colors ?? current.colors),
        plateCost: Number(body.plateCost ?? current.plateCost),
        minim: Number(body.minim ?? current.minim),
        druck: Number(body.druck ?? current.druck),
        update: nowFormatted
      }
      items[index] = updated
      writeData('printing-machines.json', items)
      return { success: true, data: updated, message: 'Printing machine updated successfully' }
    }
  }

  const newMachine: PrintingMachine = {
    id: Date.now().toString(),
    type: body.type || 'Offset',
    name: body.name || '',
    colors: Number(body.colors || 4),
    maxArea: body.maxArea || '36 x 52 cm',
    plateCost: Number(body.plateCost || 0),
    minim: Number(body.minim || 0),
    druck: Number(body.druck || 0),
    update: nowFormatted,
    status: body.status || 'Active'
  }

  items.unshift(newMachine)
  writeData('printing-machines.json', items)

  return {
    success: true,
    data: newMachine,
    message: 'Printing machine created successfully'
  }
})

