<script setup lang="ts">
import type { PurchaseOrder } from '#server/types/purchase-order'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { formatNumber } from '~/composables/useFormatters'

const props = defineProps<{
  open: boolean
  order: PurchaseOrder | null
}>()

const emit = defineEmits<{
  close: []
  edit: [order: PurchaseOrder]
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    wide
    title="Purchase Order Detail"
    @close="emit('close')"
  >
    <div v-if="order" class="space-y-6 text-xs">
      <!-- Header Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-gray-200/80 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
        <div>
          <h4 class="font-bold text-sm text-gray-900 dark:text-gray-100">PURCHASE ORDER TO:</h4>
          <p class="font-bold text-primary mt-1 text-sm">{{ order.supplier }}</p>
          <p class="text-gray-500 mt-1">Alamat Pengiriman:</p>
          <p class="text-gray-800 dark:text-gray-200 font-medium">{{ order.deliveryAddress || '-' }}</p>
          <p class="text-gray-500 mt-1">Term of Payment: <span class="font-semibold text-gray-800 dark:text-gray-200">{{ order.termOfPayment || '30 Days' }}</span></p>
        </div>

        <div class="space-y-1.5 md:text-right">
          <p class="text-gray-500">No. PO: <span class="font-bold font-mono text-gray-900 dark:text-gray-100">{{ order.noPO }}</span></p>
          <p class="text-gray-500">No. PR (Purchase): <span class="font-semibold text-gray-900 dark:text-gray-100">{{ order.noPurchase }}</span></p>
          <p class="text-gray-500">PO Date: <span class="font-medium text-gray-800 dark:text-gray-200">{{ order.date }}</span></p>
          <p class="text-gray-500">Created By: <span class="font-medium text-gray-800 dark:text-gray-200">{{ order.created }}</span></p>
          <p class="text-gray-500">Status Dokumen: 
            <span class="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              {{ order.poStatus }}
            </span>
          </p>
        </div>
      </div>

      <!-- Items Table -->
      <div>
        <h5 class="font-bold text-gray-900 dark:text-gray-100 mb-2">Item Spesifikasi Pesanan</h5>
        <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table class="w-full text-left">
            <thead class="border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-400">
              <tr>
                <th class="w-10 px-3 py-2 text-center">#</th>
                <th class="px-3 py-2">Nama Barang</th>
                <th class="w-24 px-3 py-2 text-center">Qty</th>
                <th class="w-24 px-3 py-2 text-center">Unit</th>
                <th class="w-32 px-3 py-2 text-right">Harga Satuan</th>
                <th class="w-36 px-3 py-2 text-right">Sub Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="(item, idx) in (order.items || [])" :key="idx">
                <td class="px-3 py-2 text-center text-gray-400 font-mono">{{ idx + 1 }}</td>
                <td class="px-3 py-2 font-medium text-gray-800 dark:text-gray-200">{{ item.name }}</td>
                <td class="px-3 py-2 text-center">{{ item.qty }}</td>
                <td class="px-3 py-2 text-center">{{ item.unit }}</td>
                <td class="px-3 py-2 text-right font-mono">Rp {{ formatNumber(item.price) }}</td>
                <td class="px-3 py-2 text-right font-mono font-semibold text-gray-900 dark:text-gray-100">
                  Rp {{ formatNumber(item.qty * item.price) }}
                </td>
              </tr>
            </tbody>
            <tfoot class="border-t border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/40 font-bold">
              <tr>
                <td colspan="5" class="px-3 py-2.5 text-right">Total Order (IDR)</td>
                <td class="px-3 py-2.5 text-right font-mono text-primary text-sm">
                  Rp {{ formatNumber(order.amount) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Receiving Status Information -->
      <div class="rounded-xl border border-gray-200/80 p-4 dark:border-gray-800 space-y-2">
        <h5 class="font-bold text-gray-900 dark:text-gray-100">Status Penerimaan Barang (Goods Receiving)</h5>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span class="text-gray-500">Status Penerimaan:</span>
            <p class="font-semibold text-gray-800 dark:text-gray-200">{{ order.goodsStatus || '-' }}</p>
          </div>
          <div>
            <span class="text-gray-500">Tanggal Diterima:</span>
            <p class="font-semibold text-gray-800 dark:text-gray-200">{{ order.goodsDate || '-' }}</p>
          </div>
          <div>
            <span class="text-gray-500">Penerima (Goods By):</span>
            <p class="font-semibold text-gray-800 dark:text-gray-200">{{ order.goodsBy || '-' }}</p>
          </div>
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
          @click="emit('edit', order); emit('close')"
        >
          <i data-feather="edit" class="h-3.5 w-3.5"></i>
          Edit Order
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
