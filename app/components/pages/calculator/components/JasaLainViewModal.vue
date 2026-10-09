<script setup lang="ts">
import type { JasaLainItem } from '#server/types/calculator-components'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'

defineProps<{
  open: boolean
  item: JasaLainItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    title="Detail Jasa Cetak & Finishing"
    size="md"
    @close="emit('close')"
  >
    <div v-if="item" class="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
      <div class="py-2.5 flex justify-between items-center">
        <span class="text-gray-500 dark:text-gray-400">Nama Jasa</span>
        <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</span>
      </div>
      <div class="py-2.5 flex justify-between items-center">
        <span class="text-gray-500 dark:text-gray-400">Tarif Satuan</span>
        <div class="flex items-center gap-1">
          <CurrencyDisplay :value="item.harga" align="right" />
          <span class="text-gray-500">/ {{ item.satuan }}</span>
        </div>
      </div>
      <div class="py-2.5 flex justify-between items-center">
        <span class="text-gray-500 dark:text-gray-400">Minimal Charge (Floor)</span>
        <CurrencyDisplay :value="item.minimHarga" align="right" class="font-bold text-primary-600 dark:text-primary-400" />
      </div>
      <div class="py-2.5 flex justify-between items-center">
        <span class="text-gray-500 dark:text-gray-400">Satuan Pengukuran</span>
        <span class="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          {{ item.satuan }}
        </span>
      </div>
      <div class="py-2.5 flex justify-between items-center">
        <span class="text-gray-500 dark:text-gray-400">Status</span>
        <SalesStatusBadge :status="item.status" />
      </div>
      <div v-if="item.updatedAt" class="py-2.5 flex justify-between items-center">
        <span class="text-gray-500 dark:text-gray-400">Terakhir Diperbarui</span>
        <span class="text-xs text-gray-500 font-mono">{{ item.updatedAt }}</span>
      </div>
    </div>

    <div class="flex justify-end pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
      <button
        type="button"
        class="h-9 px-4 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        @click="emit('close')"
      >
        Tutup
      </button>
    </div>
  </SalesDialog>
</template>

