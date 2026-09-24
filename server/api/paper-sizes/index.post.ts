import { readData, writeData } from '~/server/utils/data'
import type { PaperSize } from '~/types/paper-size'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<PaperSize>>(event)
  const items = readData<PaperSize>('paper-sizes.json')

  const nowFormatted = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\./g, ':')

  const length = Number(body.length || 0)
  const width = Number(body.width || 0)
  const dimension = `${length} x ${width}`

  if (body.id) {
    const index = items.findIndex((i) => String(i.id) === String(body.id))
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...body,
        length,
        width,
        dimension,
        update: nowFormatted
      } as PaperSize
      writeData('paper-sizes.json', items)
      return { success: true, data: items[index], message: 'Paper size updated successfully' }
    }
  }

  const newSize: PaperSize = {
    id: Date.now().toString(),
    name: body.name || '',
    dimension,
    length,
    width,
    unit: body.unit || 'cm',
    update: nowFormatted,
    status: body.status || 'Active'
  }

  items.unshift(newSize)
  writeData('paper-sizes.json', items)

  return {
    success: true,
    data: newSize,
    message: 'Paper size created successfully'
  }
})

