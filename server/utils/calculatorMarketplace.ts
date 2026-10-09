import type {
  CalculatorListing,
  CalculatorListingCategory,
  CalculatorListingRow,
  CalculatorModerationHistory,
  CalculatorModerationInput,
  CalculatorPartner,
  CalculatorPartnerKind,
  CalculatorPartnerMetric,
  CalculatorPartnerRow,
} from '../types/calculator-marketplace'
import { readJSON, writeJSON } from './data'

const emptyMetric = (partnerId: string): CalculatorPartnerMetric => ({
  id: `metric-${partnerId}`,
  partnerId,
  paper: 0,
  group: 0,
  size: 0,
  type: 0,
  offset: 0,
  laminate: 0,
  dieCutting: 0,
  hotPrint: 0,
  recordedAt: new Date(0).toISOString(),
})

export function listCalculatorPartners(kind: CalculatorPartnerKind): CalculatorPartnerRow[] {
  const partners = readJSON<CalculatorPartner[]>('calculator-partners.json', [])
  const metrics = readJSON<CalculatorPartnerMetric[]>('calculator-partner-metrics.json', [])
  const metricByPartner = new Map(metrics.map(metric => [metric.partnerId, metric]))

  return partners
    .filter(partner => partner.kind === kind && partner.moderationStatus !== 'archived')
    .map(partner => ({ ...partner, metrics: metricByPartner.get(partner.id) ?? emptyMetric(partner.id) }))
}

export function listCalculatorListings(category: CalculatorListingCategory): CalculatorListingRow[] {
  const partners = readJSON<CalculatorPartner[]>('calculator-partners.json', [])
  const listings = readJSON<CalculatorListing[]>('calculator-listings.json', [])
  const partnerById = new Map(partners.map(partner => [partner.id, partner]))

  return listings
    .filter(listing => listing.category === category && !listing.archivedAt)
    .map((listing) => {
      const source = partnerById.get(listing.sourcePartnerId)
      return {
        ...listing,
        sourceName: source?.name ?? 'Unknown source',
        sourceAddress: source?.address ?? '-',
      }
    })
}

export function moderateCalculatorPartner(partnerId: string, input: CalculatorModerationInput) {
  if (!['warning', 'ban', 'freeze'].includes(input.action)) throw new Error('Tindakan tidak valid')
  if (!['no', 'whatsapp', 'email'].includes(input.notification)) throw new Error('Notifikasi tidak valid')
  if (!input.message?.trim()) throw new Error('Pesan wajib diisi')
  if (input.action === 'freeze' && (!Number.isInteger(input.freezeDays) || Number(input.freezeDays) < 1)) {
    throw new Error('Durasi bekukan minimal 1 hari')
  }

  const partners = readJSON<CalculatorPartner[]>('calculator-partners.json', [])
  const index = partners.findIndex(partner => partner.id === partnerId && partner.moderationStatus !== 'archived')
  if (index < 0) throw new Error('Partner tidak ditemukan')

  const now = new Date()
  const existing = partners[index]!
  const frozenUntil = input.action === 'freeze'
    ? new Date(now.getTime() + Number(input.freezeDays) * 86_400_000).toISOString()
    : null
  const partner: CalculatorPartner = {
    ...existing,
    moderationStatus: input.action === 'ban' ? 'banned' : input.action === 'freeze' ? 'frozen' : existing.moderationStatus,
    frozenUntil,
    updatedAt: now.toISOString(),
  }
  partners[index] = partner

  const history = readJSON<CalculatorModerationHistory[]>('calculator-moderation-history.json', [])
  history.unshift({
    id: `moderation-${now.getTime()}`,
    partnerId,
    action: input.action,
    ...(input.action === 'freeze' ? { freezeDays: Number(input.freezeDays) } : {}),
    notification: input.notification,
    message: input.message.trim(),
    createdAt: now.toISOString(),
  })

  writeJSON('calculator-partners.json', partners)
  writeJSON('calculator-moderation-history.json', history)
  return partner
}

export function archiveCalculatorPartner(partnerId: string) {
  const partners = readJSON<CalculatorPartner[]>('calculator-partners.json', [])
  const index = partners.findIndex(partner => partner.id === partnerId && partner.moderationStatus !== 'archived')
  if (index < 0) throw new Error('Partner tidak ditemukan')
  const partner: CalculatorPartner = {
    ...partners[index]!,
    moderationStatus: 'archived',
    updatedAt: new Date().toISOString(),
  }
  partners[index] = partner
  writeJSON('calculator-partners.json', partners)
  return partner
}

export function archiveCalculatorListing(listingId: string) {
  const listings = readJSON<CalculatorListing[]>('calculator-listings.json', [])
  const index = listings.findIndex(listing => listing.id === listingId && !listing.archivedAt)
  if (index < 0) throw new Error('Listing tidak ditemukan')
  const listing: CalculatorListing = { ...listings[index]!, archivedAt: new Date().toISOString() }
  listings[index] = listing
  writeJSON('calculator-listings.json', listings)
  return listing
}
