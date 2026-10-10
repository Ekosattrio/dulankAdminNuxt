<script setup lang="ts">
import type { CustomerReportItem } from '~~/server/types/reports-stakeholders'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { formatIDR } from '~/utils/currency'

defineProps<{
  open: boolean
  customer: CustomerReportItem | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    :title="`Ringkasan Pelanggan: ${customer?.customerName || '-'}`"
    size="lg"
    @close="emit('close')"
  >
    <div v-if="customer" class="space-y-6">
      <!-- Customer Meta Grid -->
      <div class="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-gray-50/75 p-4 sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-800/50">
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Nama Pelanggan</span>
          <p class="font-semibold text-gray-900 dark:text-white">{{ customer.customerName }}</p>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Total Order Percetakan</span>
          <p class="font-semibold text-gray-900 dark:text-white">{{ customer.totalOrder }} Pesanan</p>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Akumulasi Belanja</span>
          <p class="font-mono font-bold text-emerald-600">{{ formatIDR(customer.amount) }}</p>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Rata-rata Waktu Pengerjaan</span>
          <p class="font-semibold text-gray-900 dark:text-white">{{ customer.avgLeadTime }}</p>
        </div>
      </div>

      <!-- History Order Table -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white">Riwayat Transaksi Pelanggan</h4>
          <span class="text-xs text-gray-500">History Orders</span>
        </div>
        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
            <thead class="bg-gray-50 border-b border-gray-200 font-semibold dark:bg-gray-800 dark:border-gray-700">
              <tr>
                <th class="px-3 py-2 text-start">Tanggal</th>
                <th class="px-3 py-2 text-start">No. Faktur</th>
                <th class="px-3 py-2 text-start">Produk Pesanan</th>
                <th class="px-3 py-2 text-center">Qty</th>
                <th class="px-3 py-2 text-end">Nilai Transaksi</th>
                <th class="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="(h, idx) in (customer.history || [{ date: '01/03/2026', invoiceNo: 'INV-202603-001', product: 'Pesanan Percetakan Custom', qty: customer.totalOrder, amount: customer.amount, status: customer.status || 'Paid' }])"
                :key="idx"
              >
                <td class="px-3 py-2">{{ h.date }}</td>
                <td class="px-3 py-2 font-mono font-medium">{{ h.invoiceNo }}</td>
                <td class="px-3 py-2">{{ h.product }}</td>
                <td class="px-3 py-2 text-center">{{ h.qty }}</td>
                <td class="px-3 py-2 text-end font-mono">{{ formatIDR(h.amount) }}</td>
                <td class="px-3 py-2 text-center">
                  <span class="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {{ h.status }}
                  </span>
                </td>
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

