<script setup lang="ts">
import type { CustomerDueReportItem } from '~~/server/types/reports-stakeholders'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { formatIDR } from '~/utils/currency'

defineProps<{
  open: boolean
  customer: CustomerDueReportItem | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    :title="`Detail Tagihan Piutang: ${customer?.customerName || '-'}`"
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
          <span class="text-xs text-gray-500 dark:text-gray-400">Faktur Jatuh Tempo</span>
          <p class="font-semibold text-gray-900 dark:text-white">{{ customer.orderDue }} Faktur</p>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Total Piutang Belum Lunas</span>
          <p class="font-mono font-bold text-rose-600">{{ formatIDR(customer.amountDue) }}</p>
        </div>
        <div>
          <span class="text-xs text-gray-500 dark:text-gray-400">Hari Keterlambatan</span>
          <p class="font-semibold text-rose-600">{{ customer.daysDue }} Hari Terlewat</p>
        </div>
      </div>

      <!-- History Invoice Due Table -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white">Daftar Faktur Tertunggak</h4>
          <span class="text-xs text-gray-500">Aging List</span>
        </div>
        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
            <thead class="bg-gray-50 border-b border-gray-200 font-semibold dark:bg-gray-800 dark:border-gray-700">
              <tr>
                <th class="px-3 py-2 text-start">Tanggal Faktur</th>
                <th class="px-3 py-2 text-start">No. Faktur</th>
                <th class="px-3 py-2 text-end">Total Tagihan</th>
                <th class="px-3 py-2 text-end">Terbayar</th>
                <th class="px-3 py-2 text-end">Sisa Piutang</th>
                <th class="px-3 py-2 text-center">Overdue</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="(h, idx) in (customer.history || [{ date: customer.date || '20/02/2026', invoiceNo: 'INV-202602-099', amount: customer.amountDue, paid: 0, due: customer.amountDue, daysOverdue: customer.daysDue }])"
                :key="idx"
              >
                <td class="px-3 py-2">{{ h.date }}</td>
                <td class="px-3 py-2 font-mono font-medium">{{ h.invoiceNo }}</td>
                <td class="px-3 py-2 text-end font-mono">{{ formatIDR(h.amount) }}</td>
                <td class="px-3 py-2 text-end font-mono text-emerald-600">{{ formatIDR(h.paid) }}</td>
                <td class="px-3 py-2 text-end font-mono font-bold text-rose-600">{{ formatIDR(h.due) }}</td>
                <td class="px-3 py-2 text-center text-rose-600 font-semibold">{{ h.daysOverdue }} Hari</td>
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

