<script setup lang="ts">
import type { PaperItem } from '#server/types/paper-shop'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import { formatIDR } from '~/utils/currency'

const props = defineProps<{
  open: boolean
  item: PaperItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const activeTab = ref<'detail' | 'history'>('detail')

watch(
  () => props.open,
  (val) => {
    if (val) activeTab.value = 'detail'
  }
)

const defaultHistory = [
  { date: '25/12/2025, 15:14', reff: 'Sales', qty: -100, unit: 'Pcs', created: 'Admin' },
  { date: '25/12/2025, 15:14', reff: 'Update Stock', qty: 8, unit: 'Pcs', created: 'Admin' },
  { date: '25/12/2025, 15:14', reff: 'Sales', qty: -500, unit: 'Pcs', created: 'Admin' },
  { date: '25/12/2025, 15:14', reff: 'Update Stock', qty: -3, unit: 'Pcs', created: 'Admin' },
  { date: '25/12/2025, 15:14', reff: 'Purchase', qty: 500, unit: 'Pcs', created: 'Admin' },
  { date: '25/12/2025, 15:14', reff: 'Sales', qty: -750, unit: 'Pcs', created: 'Admin' }
]

const historyItems = computed(() => {
  if (props.item?.stockHistory && props.item.stockHistory.length > 0) {
    return props.item.stockHistory
  }
  return defaultHistory
})
</script>

<template>
  <SalesDialog
    :open="open"
    title="View Paper List"
    size="lg"
    @close="emit('close')"
  >
    <div v-if="item" class="space-y-4">
      <!-- Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          class="px-5 py-2.5 text-sm font-bold border-b-2 transition-all"
          :class="
            activeTab === 'detail'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          "
          @click="activeTab === 'detail'"
        >
          Detail
        </button>
        <button
          type="button"
          class="px-5 py-2.5 text-sm font-bold border-b-2 transition-all"
          :class="
            activeTab === 'history'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
          "
          @click="activeTab === 'history'"
        >
          Stock History
        </button>
      </div>

      <!-- Tab 1: Detail -->
      <div v-show="activeTab === 'detail'" class="space-y-2.5 pt-1">
        <div class="grid grid-cols-12 gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
          <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Paper Name</span>
          <span class="col-span-7 text-sm font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</span>
        </div>

        <div class="grid grid-cols-12 gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
          <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Merk</span>
          <span class="col-span-7 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.merk }}</span>
        </div>

        <div class="grid grid-cols-12 gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
          <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Price</span>
          <span class="col-span-7 text-sm font-semibold text-gray-900 dark:text-gray-100">{{ formatIDR(item.price) }}</span>
        </div>

        <div class="grid grid-cols-12 gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
          <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Price Unit</span>
          <span class="col-span-7 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.unitPrice }}</span>
        </div>

        <div class="grid grid-cols-12 gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
          <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Gramature</span>
          <span class="col-span-7 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.gsm }}</span>
        </div>

        <div class="grid grid-cols-12 gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
          <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Paper Width</span>
          <span class="col-span-7 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.paperWidth || '-' }}</span>
        </div>

        <div class="grid grid-cols-12 gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
          <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Paper Height</span>
          <span class="col-span-7 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.paperHeight || '-' }}</span>
        </div>

        <div class="grid grid-cols-12 gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
          <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Minimum Order</span>
          <span class="col-span-7 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.minOrder || '-' }}</span>
        </div>

        <div class="grid grid-cols-12 gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
          <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Step Order</span>
          <span class="col-span-7 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.stepOrder || '-' }}</span>
        </div>

        <div class="grid grid-cols-12 gap-3 py-1.5 border-b border-gray-100 dark:border-gray-800">
          <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Minimum Transaction</span>
          <span class="col-span-7 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {{ item.minTransaction ? formatIDR(item.minTransaction) : '-' }}
          </span>
        </div>

        <div class="grid grid-cols-12 gap-3 py-1.5">
          <span class="col-span-5 text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
          <div class="col-span-7">
            <SalesStatusBadge :status="item.status" />
          </div>
        </div>
      </div>

      <!-- Tab 2: Stock History -->
      <div v-show="activeTab === 'history'" class="pt-1">
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead class="bg-gray-50 dark:bg-gray-800/60 font-semibold text-gray-700 dark:text-gray-300">
              <tr>
                <th class="px-3 py-2 text-left">Date</th>
                <th class="px-3 py-2 text-left">Reff</th>
                <th class="px-3 py-2 text-right">Qty</th>
                <th class="px-3 py-2 text-left">Unit</th>
                <th class="px-3 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              <tr v-for="(h, idx) in historyItems" :key="idx" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                <td class="px-3 py-2 text-xs text-gray-600 dark:text-gray-400 font-mono">{{ h.date }}</td>
                <td class="px-3 py-2 text-xs font-medium text-gray-800 dark:text-gray-200">{{ h.reff }}</td>
                <td
                  class="px-3 py-2 text-xs font-mono font-bold text-right"
                  :class="h.qty > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
                >
                  {{ h.qty > 0 ? `+${h.qty}` : h.qty }}
                </td>
                <td class="px-3 py-2 text-xs text-gray-600 dark:text-gray-400">{{ h.unit }}</td>
                <td class="px-3 py-2 text-xs text-gray-600 dark:text-gray-400">{{ h.created }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-800">
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
