import type { CalculatorPartnerRow, CalculatorPartnerKind } from '#server/types/calculator-marketplace'
/** Adapter for Laravel fields and legacy rows, including partners without metric records. */
export function normalizeCalculatorPartner(value: unknown): CalculatorPartnerRow | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, any>
  if (row.id === null || row.id === undefined) return null
  const kind: CalculatorPartnerKind = row.kind || (row.type === 'paper_store' ? 'paper_shop' : row.type === 'printing_shop' ? 'printing_shop' : 'listing_source')
  const metrics = row.metrics && typeof row.metrics === 'object' ? row.metrics : {}
  const count = (...keys: string[]) => {
    const raw = keys.map(key => metrics[key]).find(item => item !== null && item !== undefined)
    const number = Number(raw ?? 0)
    return Number.isFinite(number) && number >= 0 ? number : 0
  }
  return {
    ...row, id: String(row.id), kind, name: String(row.name || ''), address: String(row.address || ''),
    subscribed: row.subscribed === true || row.subscribed === 1, joinDate: row.joinDate || row.join_date || '',
    moderationStatus: row.moderationStatus || (row.status === 'Inactive' ? 'banned' : row.status === 'Flagged' ? 'frozen' : 'active'),
    capabilities: Array.isArray(row.capabilities) ? row.capabilities : [],
    createdAt: row.createdAt || '', updatedAt: row.updatedAt || '',
    metrics: {
      id: String(metrics.id || ''), partnerId: String(row.id), recordedAt: metrics.recordedAt || '',
      paper: count('paper', 'paperCount'), group: count('group', 'groupCount'), size: count('size', 'sizeCount'), type: count('type', 'typeCount'),
      offset: count('offset', 'printingCount'), laminate: count('laminate', 'laminationCount'), dieCutting: count('dieCutting', 'dieCuttingCount'), hotPrint: count('hotPrint', 'foilCount'),
    },
  }
}
