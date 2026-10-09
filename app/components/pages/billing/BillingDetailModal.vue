<script setup lang="ts">
import type { BillingItem } from '#server/types/billing'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formatIDR } from '~/utils/currency'

defineProps<{
  open: boolean
  billing: BillingItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'print', billing: BillingItem): void
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    :title="billing ? `Billing Detail - ${billing.billingId}` : 'Billing Detail'"
    max-width-class="max-w-lg"
    @close="emit('close')"
  >
    <div v-if="billing" class="space-y-4">
      <div class="grid grid-cols-2 gap-2 text-sm">
        <span class="text-gray-500">ID Transaksi</span>
        <span class="text-end font-medium text-gray-900 dark:text-white">{{ billing.txId }}</span>

        <span class="text-gray-500">User Email</span>
        <span class="text-end text-xs text-gray-700 dark:text-gray-300">{{ billing.userEmail }}</span>

        <span class="text-gray-500">Tanggal</span>
        <span class="text-end text-gray-700 dark:text-gray-300">{{ billing.date }}</span>

        <span class="text-gray-500">Jumlah Tagihan</span>
        <span class="text-end tabular-nums text-gray-900 dark:text-white">{{ formatIDR(billing.subtotal) }}</span>

        <span class="text-gray-500">Diskon</span>
        <span class="text-end tabular-nums text-rose-600">- {{ formatIDR(billing.discount) }}</span>

        <span class="text-gray-500">Pajak</span>
        <span class="text-end tabular-nums text-gray-700 dark:text-gray-300">{{ formatIDR(billing.tax) }}</span>

        <span class="text-gray-500">Biaya Kirim</span>
        <span class="text-end tabular-nums text-gray-700 dark:text-gray-300">{{ formatIDR(billing.shipping) }}</span>
      </div>

      <div class="border-t border-gray-200 pt-3 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <span class="font-bold text-gray-900 dark:text-white">Total Pembayaran</span>
          <span class="text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {{ formatIDR(billing.total) }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-sm pt-2">
        <span class="text-gray-500">Metode</span>
        <span class="text-end text-gray-700 dark:text-gray-300">{{ billing.method }}</span>

        <span class="text-gray-500">Status</span>
        <span class="text-end">
          <span
            :class="[
              'inline-block px-2 py-0.5 rounded-full text-xs font-semibold',
              billing.status === 'Berhasil'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            ]"
          >
            {{ billing.status }}
          </span>
        </span>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Tutup
        </button>
        <button
          v-if="billing"
          type="button"
          class="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          @click="emit('print', billing)"
        >
          <FeatherIcon name="printer" size="14" />
          <span>Cetak</span>
        </button>
      </div>
    </template>
  </SalesDialog>
</template>

