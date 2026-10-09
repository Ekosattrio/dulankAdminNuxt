import { readJSON, writeJSON } from '~/server/utils/data'
import type { CalendarConfig } from '~/types/calendar-setting'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CalendarConfig>>(event)
  const current = readJSON<CalendarConfig>('calendar-settings.json')

  const updated: CalendarConfig = {
    ...current,
    ...body,
    calendarLogs: current.calendarLogs,
  }

  const requiredArrays: Array<keyof CalendarConfig> = [
    'calendarProducts', 'sheetOptions', 'calendarSizes', 'papers', 'machines', 'printTypes',
    'laminates', 'hangers', 'components', 'profitTiers', 'calendarLogs'
  ]
  for (const key of requiredArrays) {
    if (!Array.isArray(updated[key])) {
      throw createError({ statusCode: 400, statusMessage: `${key} must be an array` })
    }
  }
  for (const tier of updated.profitTiers) {
    if (tier.minQty < 0 || tier.maxQty < tier.minQty || tier.profitPosPercent < 0 || tier.profitWebstorePercent < 0) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid profit tier range or percentage' })
    }
  }
  const monetaryValues = [
    ...updated.papers.map(item => item.price),
    ...updated.machines.flatMap(item => [item.minimumPrice, item.druckPrice]),
    ...updated.laminates.map(item => item.price),
    ...updated.hangers.map(item => item.price),
    ...updated.components.map(item => item.price),
    ...updated.calendarLogs.flatMap(item => [item.productionCost, item.sellingPrice]),
  ]
  if (monetaryValues.some(value => !Number.isFinite(value) || value < 0)) {
    throw createError({ statusCode: 400, statusMessage: 'Monetary values must be non-negative numbers' })
  }

  writeJSON('calendar-settings.json', updated)

  return {
    success: true,
    data: updated,
    message: 'Calendar settings updated successfully'
  }
})

