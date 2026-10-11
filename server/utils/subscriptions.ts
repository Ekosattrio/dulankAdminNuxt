import type {
  SubscriptionBillingCycle,
  SubscriptionFilterQuery,
  SubscriptionPaymentMethod,
  SubscriptionPlanTier,
  SubscriptionRecord,
  SubscriptionStatus,
  SubscriptionStore,
  SubscriptionUpdateCommand,
} from '#server/types/subscription'
import { isDateWithinRange } from './dateRange'
import { readJSON, writeJSON } from './data'

const planTiers = new Set<SubscriptionPlanTier>(['Basic', 'Advanced', 'Enterprise'])
const billingCycles = new Set<SubscriptionBillingCycle>(['30 Days', '365 Days'])
const paymentMethods = new Set<SubscriptionPaymentMethod>(['Credit Card', 'Debit Card', 'Paypal'])
const statuses = new Set<SubscriptionStatus>(['Paid', 'Unpaid'])
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

function invalid(message: string, statusCode = 400): never {
  throw createError({ statusCode, statusMessage: message })
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateStore(store: SubscriptionStore) {
  if (!store || !store.summary || !Array.isArray(store.records)) invalid('Subscription data is invalid', 500)
  const summaryValues = Object.values(store.summary)
  if (summaryValues.some(value => typeof value !== 'number' || !Number.isFinite(value) || value < 0)) {
    invalid('Subscription summary is invalid', 500)
  }
  const ids = new Set<string>()
  for (const record of store.records) {
    if (!record.id || !record.subscriberId || !record.subscriber || ids.has(record.id)) invalid('Subscription record is invalid', 500)
    if (!planTiers.has(record.planTier) || !billingCycles.has(record.billingCycle) || !paymentMethods.has(record.paymentMethod) || !statuses.has(record.status)) {
      invalid('Subscription record contains an invalid option', 500)
    }
    if (!Number.isFinite(record.amount) || record.amount < 0 || !isoDatePattern.test(record.createdDate) || !isoDatePattern.test(record.expiringOn)) {
      invalid('Subscription record contains invalid values', 500)
    }
    ids.add(record.id)
  }
  return store
}

function readStore() {
  return validateStore(readJSON<SubscriptionStore>('subscriptions.json'))
}

export function listSubscriptions(query: SubscriptionFilterQuery) {
  const store = readStore()
  const search = clean(query.search).toLowerCase()
  const data = store.records.filter(record =>
    (!search || [record.subscriber, record.plan, record.paymentMethod, record.status].some(value => value.toLowerCase().includes(search)))
    && (!query.plan || record.planTier === query.plan)
    && (!query.paymentMethod || record.paymentMethod === query.paymentMethod)
    && (!query.status || record.status === query.status)
    && (!(query.startDate || query.endDate) || isDateWithinRange(record.createdDate, query.startDate, query.endDate)),
  )
  return { data, summary: store.summary }
}

export function getSubscription(id: string) {
  const record = readStore().records.find(item => item.id === id)
  if (!record) invalid('Subscription not found', 404)
  return record
}

export function updateSubscription(id: string, command: SubscriptionUpdateCommand) {
  const store = readStore()
  const index = store.records.findIndex(item => item.id === id)
  if (index < 0) invalid('Subscription not found', 404)
  const current = store.records[index]!
  const subscriber = command.subscriber === undefined ? current.subscriber : clean(command.subscriber)
  if (!subscriber) invalid('Subscriber is required')
  if (command.planTier && !planTiers.has(command.planTier)) invalid('Plan is invalid')
  if (command.billingCycle && !billingCycles.has(command.billingCycle)) invalid('Billing cycle is invalid')
  if (command.paymentMethod && !paymentMethods.has(command.paymentMethod)) invalid('Payment method is invalid')
  if (command.status && !statuses.has(command.status)) invalid('Status is invalid')
  if (command.amount !== undefined && (!Number.isFinite(command.amount) || command.amount < 0)) invalid('Amount must be a non-negative number')
  if (command.createdDate && !isoDatePattern.test(command.createdDate)) invalid('Created date is invalid')
  if (command.expiringOn && !isoDatePattern.test(command.expiringOn)) invalid('Expiring date is invalid')

  const planTier = command.planTier ?? current.planTier
  const billingCycle = command.billingCycle ?? current.billingCycle
  const cycleLabel = billingCycle === '365 Days' ? 'Yearly' : 'Monthly'
  const updated: SubscriptionRecord = {
    ...current,
    subscriber,
    planTier,
    plan: `${planTier} (${cycleLabel})`,
    billingCycle,
    paymentMethod: command.paymentMethod ?? current.paymentMethod,
    amount: command.amount ?? current.amount,
    createdDate: command.createdDate ?? current.createdDate,
    expiringOn: command.expiringOn ?? current.expiringOn,
    status: command.status ?? current.status,
    updatedAt: new Date().toISOString(),
  }
  store.records[index] = updated
  writeJSON('subscriptions.json', store)
  return updated
}

export function deleteSubscription(id: string) {
  const store = readStore()
  const index = store.records.findIndex(item => item.id === id)
  if (index < 0) invalid('Subscription not found', 404)
  const [deleted] = store.records.splice(index, 1)
  writeJSON('subscriptions.json', store)
  return deleted!
}
