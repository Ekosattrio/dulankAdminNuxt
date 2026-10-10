<script setup lang="ts">
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { formatIDR } from '~/utils/currency'
import type { SupplierReportItem } from '~~/server/types/reports-stakeholders'

defineProps<{
  open: boolean
  item: SupplierReportItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    :title="`Detail Supplier: ${item?.supplierName || '-'}`"
    size="lg"
    @close="emit('close')"
  >
    <div v-if="item" class="space-y-6">
      <!-- Supplier Meta Grid -->
      <div class="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-gray-50/75 p-4 sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-800/50">
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Nama Supplier</span>
          <p class="font-semibold text-gray-900 dark:text-white">{{ item.supplierName }}</p>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Total Transaksi</span>
          <p class="font-semibold text-gray-900 dark:text-white">{{ item.totalTransactions || 20 }} Transaksi</p>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Total Pembelian</span>
          <p class="font-mono font-bold text-primary">{{ formatIDR(item.totalPurchased || item.amount) }}</p>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Rata-rata Lead Time</span>
          <p class="font-semibold text-gray-900 dark:text-white">{{ item.avgLeadTime || '6 Days' }}</p>
        </div>
      </div>

      <!-- History Transaction Table -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white">Riwayat Transaksi Pemasok</h4>
          <span class="text-xs text-gray-500">Periode Berjalan</span>
        </div>
        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
            <thead class="bg-gray-50 border-b border-gray-200 font-semibold dark:bg-gray-800 dark:border-gray-700">
              <tr>
                <th class="px-3 py-2 text-start">Tanggal</th>
                <th class="px-3 py-2 text-start">Kategori</th>
                <th class="px-3 py-2 text-start">Item Pembelian</th>
                <th class="px-3 py-2 text-center">Qty</th>
                <th class="px-3 py-2 text-end">Jumlah</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="(h, idx) in (item.history || [{ date: item.date, category: item.category, purchaseItem: item.purchaseItem, qty: item.qty, amount: item.amount }])"
                :key="idx"
              >
                <td class="px-3 py-2">{{ h.date }}</td>
                <td class="px-3 py-2">{{ h.category }}</td>
                <td class="px-3 py-2 font-medium">{{ h.purchaseItem }}</td>
                <td class="px-3 py-2 text-center">{{ h.qty }}</td>
                <td class="px-3 py-2 text-end font-mono">{{ formatIDR(h.amount) }}</td>
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

