import { readData, writeData } from '~/server/utils/data'
import type { PrintingMachine } from '~/types/printing-machine'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = readData<PrintingMachine>('printing-machines.json')

  const updated = items.filter((m) => String(m.id) !== String(id))

  if (updated.length === items.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Printing machine not found'
    })
  }

  writeData('printing-machines.json', updated)

  return {
    success: true,
    data: { id }
  }
})

