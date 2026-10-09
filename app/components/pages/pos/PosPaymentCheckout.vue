<script setup lang="ts">
import type { POSPaymentMethod } from '#server/types/pos'
defineProps<{ totalPayable: number; changeDue: number; busy: boolean; error: string }>()
const paymentModalOpen = defineModel<boolean>('open', { required: true })
const paymentMethod = defineModel<POSPaymentMethod>('method', { required: true })
const cashReceived = defineModel<number>('received', { required: true })
const emit = defineEmits<{ pay: [] }>()
const { formatRupiah } = useFormatters()
</script>
<template>
  <SalesDialog
    :open="paymentModalOpen"
    title="Payment Checkout"
    :busy="busy"
    @close="!busy && (paymentModalOpen = false)"
  >
    <div class="p-5 text-xs space-y-4">
      <p v-if="error" role="alert" class="text-sm text-red-600">{{ error }}</p>
      <!-- Method Selector -->
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="method in ['cash', 'card', 'bank', 'qris'] as const"
          :key="method"
          type="button"
          :class="[
            'rounded-lg border p-2 font-semibold uppercase text-xs transition',
            paymentMethod === method
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400',
          ]"
          @click="paymentMethod = method"
        >
          {{ method }}
        </button>
      </div>

      <div class="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
        <span class="text-gray-500">Total Payable Amount</span>
        <h2 class="text-2xl font-bold text-primary">{{ formatRupiah(totalPayable) }}</h2>
      </div>

      <!-- Cash input & quick increments -->
      <div v-if="paymentMethod === 'cash'" class="space-y-3">
        <div>
          <label class="font-semibold text-gray-700 dark:text-gray-300">Cash Received</label>
          <input
            v-model.number="cashReceived"
            type="number"
            class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-base font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            class="rounded border px-2.5 py-1 text-xs"
            @click="cashReceived = totalPayable"
          >
            Exact
          </button>
          <button
            type="button"
            class="rounded border px-2.5 py-1 text-xs"
            @click="cashReceived = totalPayable + 10000"
          >
            +10k
          </button>
          <button
            type="button"
            class="rounded border px-2.5 py-1 text-xs"
            @click="cashReceived = totalPayable + 50000"
          >
            +50k
          </button>
          <button
            type="button"
            class="rounded border px-2.5 py-1 text-xs"
            @click="cashReceived = totalPayable + 100000"
          >
            +100k
          </button>
        </div>

        <div
          class="flex justify-between rounded-lg bg-emerald-50 p-3 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          <span class="font-semibold">Change Due:</span>
          <span class="font-bold">{{ formatRupiah(changeDue) }}</span>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        <button type="button" class="rounded border px-4 py-2" @click="paymentModalOpen = false">
          Cancel
        </button>
        <button
          type="button"
          class="rounded-lg bg-primary px-6 py-2 font-bold text-white hover:bg-primary/90"
          @click="emit('pay')"
          :disabled="busy || (paymentMethod === 'cash' && cashReceived < totalPayable)"
        >
          {{ busy ? 'Saving…' : 'Complete Order' }}
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
