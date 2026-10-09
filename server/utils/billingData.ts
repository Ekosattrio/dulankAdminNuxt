import type { BillingItem, BillingStats } from '../types/billing'

const BILLING_FILE = 'billings.json'

export async function getBillings(): Promise<BillingItem[]> {
  const data = await readJSON<BillingItem[]>(BILLING_FILE)
  return Array.isArray(data) ? data : []
}

export async function getBillingStats(): Promise<BillingStats> {
  const billings = await getBillings()
  let totalTransaction = billings.length
  let totalSuccess = 0
  let totalFailed = 0

  for (const b of billings) {
    if (b.status === 'Berhasil') {
      totalSuccess++
    } else {
      totalFailed++
    }
  }

  return {
    totalTransaction,
    totalSuccess,
    totalFailed
  }
}

