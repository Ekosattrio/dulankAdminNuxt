<script setup lang="ts">
import type { SupplierDueReportItem } from '~~/server/types/reports-stakeholders'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { formatIDR } from '~/utils/currency'

defineProps<{
  open: boolean
  supplier: SupplierDueReportItem | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    :title="`Detail Hutang: ${supplier?.supplierName || '-'}`"
    size="lg"
    @close="emit('close')"
  >
    <div v-if="supplier" class="space-y-6">
      <!-- Supplier Meta Grid -->
      <div class="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-gray-50/75 p-4 sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-800/50">
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Nama Supplier</span>
          <p class="font-semibold text-gray-900 dark:text-white">{{ supplier.supplierName }}</p>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Order Due</span>
          <p class="font-semibold text-gray-900 dark:text-white">{{ supplier.purchasesDue }} Transaksi</p>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Jumlah Hutang Due</span>
          <p class="font-mono font-bold text-rose-600">{{ formatIDR(supplier.amountDue) }}</p>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Rata-rata Lead Time</span>
          <p class="font-semibold text-gray-900 dark:text-white">{{ supplier.avgLeadTime || '6 Days' }}</p>
        </div>
      </div>

      <!-- History Purchase Due Table -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white">Riwayat Tagihan Pembelian</h4>
          <span class="text-xs text-gray-500">History Transaction</span>
        </div>
        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
            <thead class="bg-gray-50 border-b border-gray-200 font-semibold dark:bg-gray-800 dark:border-gray-700">
              <tr>
                <th class="px-3 py-2 text-start">Tanggal</th>
                <th class="px-3 py-2 text-start">No. Purchase</th>
                <th class="px-3 py-2 text-end">Total Amount</th>
                <th class="px-3 py-2 text-end">Terbayar</th>
                <th class="px-3 py-2 text-end">Sisa Hutang</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="(h, idx) in (supplier.history || [{ date: supplier.date, purchaseNo: 'PR-2603000001', amount: supplier.amountDue, paid: 0, due: supplier.amountDue }])"
                :key="idx"
              >
                <td class="px-3 py-2">{{ h.date }}</td>
                <td class="px-3 py-2 font-mono font-medium">{{ h.purchaseNo }}</td>
                <td class="px-3 py-2 text-end font-mono">{{ formatIDR(h.amount) }}</td>
                <td class="px-3 py-2 text-end font-mono text-emerald-600">{{ formatIDR(h.paid) }}</td>
                <td class="px-3 py-2 text-end font-mono font-bold text-rose-600">{{ formatIDR(h.due) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <template #footer>
      <button
        type="button"
        class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        @click="emit('close')"
      >
        Tutup
      </button>
    </template>
  </SalesDialog>
</template>

