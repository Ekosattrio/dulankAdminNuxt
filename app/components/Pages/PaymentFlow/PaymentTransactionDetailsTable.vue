<script setup lang="ts">
import type { PaymentTransactionDetail } from '#server/types/payment-flow'

const props = defineProps<{
  details: PaymentTransactionDetail[]
  paymentAmount: number
}>()

const { formatNumber } = useFormatters()

const displayedDetails = computed(() => {
  const rows: PaymentTransactionDetail[] = props.details.map((detail) => ({ ...detail, status: 'Paid' }))
  const total = rows.reduce((sum, detail) => sum + Number(detail.amount || 0), 0)
  let remaining = Math.max(0, total - Math.max(0, props.paymentAmount || 0))
  for (let index = rows.length - 1; index >= 0 && remaining > 0; index -= 1) {
    const row = rows[index]
    if (!row) continue
    row.status = 'Partial'
    remaining = Math.max(0, remaining - row.amount)
  }
  return rows
})
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
    <table :class="salesDocumentTable">
      <thead>
        <tr>
          <th>No Reff</th>
          <th>Source</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="detail in displayedDetails" :key="`${detail.refNo}-${detail.amount}`">
          <td>{{ detail.refNo }}</td>
          <td>{{ detail.source }}</td>
          <td>{{ formatNumber(detail.amount) }}</td>
          <td><SalesStatusBadge :status="detail.status" /></td>
        </tr>
        <tr v-if="!displayedDetails.length">
          <td colspan="4" class="text-center text-gray-500">Transaction details are not available for this record.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
