<script setup lang="ts">
import type { PurchaseReturn } from '#server/types/purchase-return'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { formatNumber } from '~/composables/useFormatters'

const props = defineProps<{
  open: boolean
  returnData: PurchaseReturn | null
}>()

const emit = defineEmits<{
  close: []
  edit: [item: PurchaseReturn]
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    wide
    title="Purchase Return Detail"
    @close="emit('close')"
  >
    <div v-if="returnData" class="space-y-6 text-xs">
      <!-- Header Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
        <div>
          <h4 class="font-bold text-sm text-gray-900 dark:text-gray-100">DATA SUPPLIER RETUR:</h4>
          <p class="font-bold text-primary mt-1 text-sm">{{ returnData.supplier }}</p>
          <p class="text-gray-500 mt-2">Catatan Masalah:</p>
          <p class="text-gray-800 dark:text-gray-200 font-medium italic">{{ returnData.notes || 'Tidak ada catatan' }}</p>
        </div>

        <div class="space-y-1.5 md:text-right">
          <p class="text-gray-500">No. Return: <span class="font-bold font-mono text-gray-900 dark:text-gray-100">{{ returnData.noPR }}</span></p>
          <p class="text-gray-500">No. Purchase Asal: <span class="font-semibold text-gray-900 dark:text-gray-100">{{ returnData.noPurchase }}</span></p>
          <p class="text-gray-500">Tanggal Retur: <span class="font-medium text-gray-800 dark:text-gray-200">{{ returnData.date }}</span></p>
          <p class="text-gray-500">Dibuat Oleh: <span class="font-medium text-gray-800 dark:text-gray-200">{{ returnData.created }}</span></p>
          <p class="text-gray-500">Status Retur: 
            <span class="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              {{ returnData.status }}
            </span>
          </p>
        </div>
      </div>

      <!-- Items Table -->
      <div>
        <h5 class="font-bold text-gray-900 dark:text-gray-100 mb-2">Rincian Barang yang Diretur</h5>
        <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table class="w-full text-left">
            <thead class="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-400">
              <tr>
                <th class="w-10 px-3 py-2 text-center">#</th>
                <th class="px-3 py-2">Nama Barang</th>
                <th class="w-24 px-3 py-2 text-center">Qty Retur</th>
                <th class="w-20 px-3 py-2 text-center">Unit</th>
                <th class="w-32 px-3 py-2 text-right">Harga Beli</th>
                <th class="w-32 px-3 py-2 text-right">Total Retur</th>
                <th class="px-3 py-2">Alasan Pengembalian</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="(item, idx) in (returnData.items || [])" :key="idx">
                <td class="px-3 py-2 text-center text-gray-400 font-mono">{{ idx + 1 }}</td>
                <td class="px-3 py-2 font-medium text-gray-800 dark:text-gray-200">{{ item.name }}</td>
                <td class="px-3 py-2 text-center font-bold text-rose-600">{{ item.returnQty }}</td>
                <td class="px-3 py-2 text-center">{{ item.unit }}</td>
                <td class="px-3 py-2 text-right font-mono">Rp {{ formatNumber(item.price) }}</td>
                <td class="px-3 py-2 text-right font-mono font-semibold text-gray-900 dark:text-gray-100">
                  Rp {{ formatNumber(item.amount || (item.returnQty * item.price)) }}
                </td>
                <td class="px-3 py-2 text-gray-600 dark:text-gray-300">{{ item.reason || '-' }}</td>
              </tr>
            </tbody>
            <tfoot class="border-t border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/40 font-bold">
              <tr>
                <td colspan="5" class="px-3 py-2.5 text-right">Total Nilai Retur:</td>
                <td class="px-3 py-2.5 text-right font-mono text-primary text-sm">
                  Rp {{ formatNumber(returnData.amount) }}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Financial Calculation Summary -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-gray-200/80 p-4 dark:border-gray-800">
        <div>
          <span class="text-gray-500">Total Retur:</span>
          <p class="font-bold text-base font-mono text-gray-900 dark:text-gray-100">Rp {{ formatNumber(returnData.amount) }}</p>
        </div>
        <div>
          <span class="text-gray-500">Dana Dikembalikan (Paid):</span>
          <p class="font-bold text-base font-mono text-emerald-600">Rp {{ formatNumber(returnData.paid) }}</p>
        </div>
        <div>
          <span class="text-gray-500">Sisa Tagihan (Due):</span>
          <p class="font-bold text-base font-mono" :class="returnData.due > 0 ? 'text-amber-500' : 'text-gray-600'">
            Rp {{ formatNumber(returnData.due) }}
          </p>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="emit('close')"
        >
          Tutup
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary/90"
          @click="emit('edit', returnData); emit('close')"
        >
          <i data-feather="edit" class="h-3.5 w-3.5"></i>
          Edit Retur
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
