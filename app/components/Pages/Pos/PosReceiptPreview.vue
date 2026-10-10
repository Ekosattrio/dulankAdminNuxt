<script setup lang="ts">
import type { POSReceipt } from '#server/types/pos'
defineProps<{ receipt: POSReceipt | null }>()
const receiptModalOpen = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ newSale: []; print: [] }>()
const { formatRupiah } = useFormatters()
</script>
<template>
  <SalesDialog
    :open="receiptModalOpen"
    v-if="receipt"
    title="Order Completed"
    @close="receiptModalOpen = false"
  >
    <div class="p-5 text-center text-xs space-y-4">
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50"
      >
        <FeatherIcon name="check" :size="24" />
      </div>
      <h4 class="text-base font-bold text-gray-900 dark:text-white">Transaction Successful!</h4>

      <!-- Mini Receipt -->
      <div
        id="receipt-preview"
        class="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-start font-mono text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      >
        <div class="text-center font-bold">KACETAK SYSTEM</div>
        <p class="text-center">{{ receipt.saleNo }}</p>
        <div class="text-center text-[10px] text-gray-500">Jl. Arif Rahman Hakim Karawang</div>
        <div class="my-2 border-b border-dashed border-gray-300 dark:border-gray-700"></div>

        <div v-for="item in receipt.items" :key="item.id" class="flex justify-between py-0.5">
          <span>{{ item.qty }}x {{ item.name }}</span>
          <span>{{ formatRupiah(item.price * item.qty) }}</span>
        </div>

        <div class="my-2 border-b border-dashed border-gray-300 dark:border-gray-700"></div>
        <div class="flex justify-between font-bold">
          <span>TOTAL:</span>
          <span>{{ formatRupiah(receipt.total) }}</span>
        </div>
        <div class="flex justify-between">
          <span>PAID:</span>
          <span>{{ formatRupiah(receipt.paid) }}</span>
        </div>
        <div class="flex justify-between">
          <span>CHANGE:</span>
          <span>{{ formatRupiah(receipt.change) }}</span>
        </div>
        <div class="mt-3 text-center text-[9px] text-gray-400">Thank You For Shopping With Us!</div>
      </div>

      <div class="flex justify-center gap-2 pt-2">
        <button
          type="button"
          @click="emit('print')"
          class="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90"
        >
          Print Receipt
        </button>
        <button
          type="button"
          class="rounded-lg border border-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300"
          @click="emit('newSale')"
        >
          New Sale
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
