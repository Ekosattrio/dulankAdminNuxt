import seedConfig from '../data/cetak-full-color.json'
import type {
  CetakFullColorConfig,
  CetakFullColorWorkflow,
  ProductCustom,
  VisibilityStatus,
} from '../types/cetak-full-color'
import { readJSON, writeJSON } from './data'

const filename = 'cetak-full-color.json'

function cloneSeed(): CetakFullColorConfig {
  return structuredClone(seedConfig) as CetakFullColorConfig
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isKnownPreviousFixture(value: Record<string, unknown>): boolean {
  if (!Array.isArray(value.products)) return false
  return value.products.map(item => isRecord(item) ? item.name : '').join('|') === 'Brosur|Kartu Nama|Flyer|Kalender Meja'
}

function migratePreviousConfig(value: Record<string, unknown>): CetakFullColorConfig {
  if (isKnownPreviousFixture(value)) return cloneSeed()

  const seed = cloneSeed()
  const now = new Date().toISOString()
  if (Array.isArray(value.products)) {
    seed.products = value.products.filter(isRecord).map((item, index): ProductCustom => ({
      id: String(item.id || `cfc-product-${index + 1}`),
      name: String(item.name || `Product ${index + 1}`),
      defaultSize: String(item.defaultSize || ''),
      paperTypes: String(item.paperTypes || ''),
      laminates: typeof item.laminates === 'string' ? item.laminates : seed.products[0]?.laminates || '',
      printSides: typeof item.printSides === 'string' ? item.printSides : 'Cetak 1 Sisi (default), Cetak Bolak Balik',
      folds: typeof item.folds === 'string' ? item.folds : seed.products[0]?.folds || '',
      description: String(item.description || ''),
      displayPos: Boolean(item.displayPos),
      displayWebsite: typeof item.displayWebsite === 'boolean' ? item.displayWebsite : Boolean(item.active),
      active: typeof item.active === 'boolean' ? item.active : true,
      image: String(item.image || '/assets/img/products/brosur.png'),
      images: Array.isArray(item.images) ? item.images.map(String) : undefined,
      createdAt: String(item.createdAt || now),
      updatedAt: String(item.updatedAt || now),
    }))
  }
  return seed
}

export function normalizeCetakFullColorConfig(value: unknown): CetakFullColorConfig {
  if (!isRecord(value)) throw new Error('cetak-full-color.json must contain an object')
  if (value.schemaVersion !== 2) return migratePreviousConfig(value)
  return value as unknown as CetakFullColorConfig
}

function assertArray(value: unknown, field: string): asserts value is unknown[] {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`)
}

function assertText(value: unknown, field: string): asserts value is string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${field} is required`)
}

function assertOptionalNumber(value: unknown, field: string) {
  if (value !== null && (typeof value !== 'number' || !Number.isFinite(value) || value < 0)) {
    throw new Error(`${field} must be a non-negative number or empty`)
  }
}

function assertUniqueIds(items: Array<{ id?: string }>, field: string) {
  const ids = items.map(item => item.id)
  if (ids.some(id => typeof id !== 'string' || !id.trim()) || new Set(ids).size !== ids.length) {
    throw new Error(`${field} must contain unique stable IDs`)
  }
}

function assertVisibility(value: unknown, field: string): asserts value is VisibilityStatus {
  if (value !== 'Show' && value !== 'Hide') throw new Error(`${field} must be Show or Hide`)
}

function validateWorkflows(items: CetakFullColorWorkflow[], field: string) {
  assertUniqueIds(items, field)
  for (const [index, item] of items.entries()) {
    assertText(item.category, `${field}[${index}].category`)
    assertText(item.name, `${field}[${index}].name`)
    assertText(item.assignee, `${field}[${index}].assignee`)
    assertText(item.incentiveUnit, `${field}[${index}].incentiveUnit`)
    assertOptionalNumber(item.incentiveAmount, `${field}[${index}].incentiveAmount`)
    assertArray(item.targets, `${field}[${index}].targets`)
    if (!item.targets.length || item.targets.some(target => typeof target !== 'string' || !target.trim())) {
      throw new Error(`${field}[${index}].targets must contain at least one value`)
    }
  }
}

export function validateCetakFullColorConfig(config: CetakFullColorConfig): CetakFullColorConfig {
  const arrayFields: Array<keyof CetakFullColorConfig> = [
    'products', 'sizes', 'paperGroups', 'machines', 'laminates', 'folds', 'printSides',
    'components', 'workflowSteps', 'paperWorkflows', 'machineWorkflows', 'laminateWorkflows',
    'foldWorkflows', 'printSideWorkflows', 'componentWorkflows', 'logTransactions',
  ]
  for (const field of arrayFields) assertArray(config[field], field)

  assertUniqueIds(config.products, 'products')
  assertUniqueIds(config.sizes, 'sizes')
  assertUniqueIds(config.paperGroups, 'paperGroups')
  assertUniqueIds(config.machines, 'machines')
  assertUniqueIds(config.laminates, 'laminates')
  assertUniqueIds(config.folds, 'folds')
  assertUniqueIds(config.printSides, 'printSides')
  assertUniqueIds(config.components, 'components')
  assertUniqueIds(config.workflowSteps, 'workflowSteps')
  assertUniqueIds(config.logTransactions, 'logTransactions')

  for (const [index, product] of config.products.entries()) {
    assertText(product.name, `products[${index}].name`)
    assertText(product.defaultSize, `products[${index}].defaultSize`)
    assertText(product.paperTypes, `products[${index}].paperTypes`)
    assertText(product.printSides, `products[${index}].printSides`)
    assertText(product.image, `products[${index}].image`)
  }
  for (const [index, size] of config.sizes.entries()) assertVisibility(size.status, `sizes[${index}].status`)
  for (const [index, item] of config.machines.entries()) assertVisibility(item.status, `machines[${index}].status`)
  for (const [index, item] of [...config.laminates, ...config.folds, ...config.printSides].entries()) {
    assertVisibility(item.status, `visibilityOptions[${index}].status`)
  }
  for (const [index, item] of config.components.entries()) assertOptionalNumber(item.value, `components[${index}].value`)

  validateWorkflows(config.paperWorkflows, 'paperWorkflows')
  validateWorkflows(config.machineWorkflows, 'machineWorkflows')
  validateWorkflows(config.laminateWorkflows, 'laminateWorkflows')
  validateWorkflows(config.foldWorkflows, 'foldWorkflows')
  validateWorkflows(config.printSideWorkflows, 'printSideWorkflows')
  validateWorkflows(config.componentWorkflows, 'componentWorkflows')

  const profit = config.profitSettings
  if (!isRecord(profit)) throw new Error('profitSettings must be an object')
  if (profit.mode !== 'production-cost' && profit.mode !== 'production-cost-range') throw new Error('Invalid profit markup option')
  assertOptionalNumber(profit.productionCostPosPercent, 'profitSettings.productionCostPosPercent')
  assertOptionalNumber(profit.productionCostWebstorePercent, 'profitSettings.productionCostWebstorePercent')
  assertArray(profit.ranges, 'profitSettings.ranges')
  assertArray(profit.additionalFees, 'profitSettings.additionalFees')
  assertArray(profit.taxes, 'profitSettings.taxes')
  assertUniqueIds(profit.ranges, 'profitSettings.ranges')
  assertUniqueIds(profit.additionalFees, 'profitSettings.additionalFees')
  assertUniqueIds(profit.taxes, 'profitSettings.taxes')
  for (const [index, range] of profit.ranges.entries()) {
    assertOptionalNumber(range.from, `profitSettings.ranges[${index}].from`)
    assertOptionalNumber(range.to, `profitSettings.ranges[${index}].to`)
    assertOptionalNumber(range.posPercent, `profitSettings.ranges[${index}].posPercent`)
    assertOptionalNumber(range.webstorePercent, `profitSettings.ranges[${index}].webstorePercent`)
  }
  for (const [index, fee] of profit.additionalFees.entries()) assertOptionalNumber(fee.amount, `profitSettings.additionalFees[${index}].amount`)
  for (const [index, tax] of profit.taxes.entries()) assertOptionalNumber(tax.percent, `profitSettings.taxes[${index}].percent`)

  return config
}

export function readCetakFullColorConfig(): CetakFullColorConfig {
  return validateCetakFullColorConfig(normalizeCetakFullColorConfig(readJSON<unknown>(filename)))
}

export function saveCetakFullColorConfig(command: Partial<CetakFullColorConfig>): CetakFullColorConfig {
  const current = readCetakFullColorConfig()
  const updated = validateCetakFullColorConfig({
    ...current,
    ...command,
    schemaVersion: 2,
    logTransactions: current.logTransactions,
  })
  writeJSON(filename, updated)
  return updated
}
