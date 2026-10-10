<script setup lang="ts">
import type { PaperItem } from '#server/types/paper-shop'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'

defineProps<{
  open: boolean
  item: PaperItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    title="View Paper Item Details"
    size="md"
    @close="emit('close')"
  >
    <div v-if="item" class="space-y-4">
      <div class="grid grid-cols-12 gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Paper Name</span>
        <span class="col-span-7 text-sm font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</span>
      </div>

      <div class="grid grid-cols-12 gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Merk / Brand</span>
        <span class="col-span-7 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.merk }}</span>
      </div>

      <div class="grid grid-cols-12 gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Price</span>
        <div class="col-span-7">
          <CurrencyDisplay :value="item.price" class="font-bold text-gray-900 dark:text-gray-100" />
          <span class="text-xs text-gray-500 ml-1">/ {{ item.unitPrice }}</span>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Gramatur</span>
        <span class="col-span-7 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.gsm }} GSM</span>
      </div>

      <div class="grid grid-cols-12 gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Paper Size</span>
        <span class="col-span-7 text-sm font-mono text-gray-700 dark:text-gray-300">{{ item.paperSize }}</span>
      </div>

      <div class="grid grid-cols-12 gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Stock Tersedia</span>
        <span class="col-span-7 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {{ item.stock.toLocaleString('id-ID') }} {{ item.unitStock }}
        </span>
      </div>

      <div class="grid grid-cols-12 gap-3 py-2 border-b border-gray-100 dark:border-gray-800">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Terakhir Update</span>
        <span class="col-span-7 text-sm font-mono text-gray-700 dark:text-gray-300">{{ item.update }}</span>
      </div>

      <div class="grid grid-cols-12 gap-3 py-2">
        <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
        <div class="col-span-7">
          <SalesStatusBadge :status="item.status" />
        </div>
      </div>

      <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="h-9 px-4 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </SalesDialog>
</template>

