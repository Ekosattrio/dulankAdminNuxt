<script setup lang="ts">
import type { PaymentFlowKind, PaymentFlowRecord } from '#server/types/payment-flow'

defineProps<{ kind: PaymentFlowKind; record: PaymentFlowRecord | null }>()
defineEmits<{ close: [] }>()
const { formatNumber } = useFormatters()
</script>

<template>
  <SalesDialog :open="!!record" :title="`View Payment ${kind === 'inflow' ? 'Inflow' : 'Outflow'}`" medium @close="$emit('close')">
    <div v-if="record" class="space-y-6">
      <section>
        <h3 class="mb-4 text-base font-semibold">Transaction Detail</h3>
        <div class="mb-4 grid gap-2 text-sm sm:grid-cols-[8rem_1rem_1fr]">
          <strong>Name</strong><strong>:</strong><strong>{{ record.name }}</strong>
        </div>
        <div class="grid gap-4 lg:grid-cols-2">
          <table :class="salesDocumentTable">
            <tbody>
              <tr><td>Date</td><td>{{ record.date }}</td></tr>
              <tr><td>No Reff</td><td>{{ record.refNo }}</td></tr>
              <tr><td>Source</td><td>{{ record.source }}</td></tr>
            </tbody>
          </table>
          <table :class="salesDocumentTable">
            <tbody>
              <tr><td>Due Date</td><td>{{ record.dueDate || record.paymentDate || record.date }}</td></tr>
              <tr><td>Amount</td><td>{{ formatNumber(record.amount) }}</td></tr>
              <tr><td>Status</td><td><SalesStatusBadge :status="record.status" /></td></tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 grid gap-2 text-sm sm:grid-cols-[8rem_1rem_1fr]">
          <span>Note</span><span>:</span><span>{{ record.note || '-' }}</span>
        </div>
      </section>

      <section>
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-base font-semibold">Payment {{ kind === 'inflow' ? 'Inflow' : 'Outflow' }}</h3>
          <h3 class="text-base font-semibold text-[#ff9f43]">
            Due Amount : {{ formatNumber(Math.max(0, record.amount - (record.payments?.reduce((sum, item) => sum + item.amount, 0) || 0))) }}
          </h3>
        </div>
        <div v-if="record.payments?.length" class="space-y-4">
          <div v-for="payment in record.payments" :key="payment.id" class="border-b border-gray-200 pb-4 text-sm dark:border-gray-700">
            <div class="grid gap-2 sm:grid-cols-[11rem_1fr]"><span>Payment</span><strong>{{ formatNumber(payment.amount) }}</strong></div>
            <div class="grid gap-2 sm:grid-cols-[11rem_1fr]"><span>Date Payment</span><span>{{ payment.datePayment }}</span></div>
            <div class="grid gap-2 sm:grid-cols-[11rem_1fr]">
              <span>Payment Method</span>
              <span>
                <template v-if="payment.method === 'Transfer'">
                  <span v-if="payment.fromAccount">From : {{ payment.fromAccount }}</span>
                  <br v-if="payment.fromAccount && payment.toAccount" />
                  <span v-if="payment.toAccount">To : {{ payment.toAccount }}</span>
                </template>
                <template v-else>{{ payment.method }}</template>
              </span>
            </div>
            <div class="grid gap-2 sm:grid-cols-[11rem_1fr]"><span>Created Payment</span><span>{{ payment.createdPayment }}</span></div>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500">No payment has been recorded.</p>
      </section>

      <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c] focus:outline-none"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none"
          @click="$emit('close')"
        >
          Submit
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
