import { readJSON, writeJSON } from '~/server/utils/data'
import type { CetakFullColorConfig } from '~/types/cetak-full-color'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CetakFullColorConfig>>(event)
  const current = readJSON<CetakFullColorConfig>('cetak-full-color.json')

  const updated: CetakFullColorConfig = {
    ...current,
    ...body,
    logTransactions: current.logTransactions,
  }

  const requiredArrays: Array<keyof CetakFullColorConfig> = [
    'products', 'sizes', 'papers', 'machines', 'laminates', 'folds', 'printSides',
    'components', 'workflowSteps', 'profitTiers', 'logTransactions'
  ]
  for (const key of requiredArrays) {
    if (!Array.isArray(updated[key])) throw createError({ statusCode: 400, statusMessage: `${key} must be an array` })
  }
  for (const tier of updated.profitTiers) {
    if (tier.minQty < 0 || tier.maxQty < tier.minQty || tier.profitPosPercent < 0 || tier.profitWebstorePercent < 0) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid profit tier range or percentage' })
    }
  }
  const money = [
    ...updated.papers.map(item => item.pricePlano),
    ...updated.machines.flatMap(item => [item.plateCost, item.runChargeMin]),
    ...updated.laminates.map(item => item.costPerSide),
    ...updated.folds.map(item => item.costPer1000),
    ...updated.logTransactions.flatMap(item => [item.totalCost, item.sellingPrice]),
  ]
  if (money.some(value => !Number.isFinite(value) || value < 0)) {
    throw createError({ statusCode: 400, statusMessage: 'Monetary values must be non-negative numbers' })
  }

  writeJSON('cetak-full-color.json', updated)

  return {
    success: true,
    data: updated,
    message: 'Cetak full color settings updated successfully'
  }
})

