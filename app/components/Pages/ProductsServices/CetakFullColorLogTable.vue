<script setup lang="ts">
import type { CalculationLogTransaction } from '#server/types/cetak-full-color'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesDialog from '~/components/Sales/SalesDialog.vue'

defineProps<{ logs: CalculationLogTransaction[] }>()
const selected = ref<CalculationLogTransaction | null>(null)

const columns = [
  { key: 'noSales', label: 'No Sales', sortable: true },
  { key: 'customer', label: 'Customers', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'channel', label: 'Chanel', sortable: true },
  { key: 'productName', label: 'Product Name', sortable: true },
  { key: 'price', label: 'Price', align: 'end' as const, sortable: true },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <section class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <h4 class="app-section-title text-gray-900 dark:text-white">Log Transaction</h4>
      <span class="text-sm italic text-gray-500">Update : 19:30 - 20 Januari 2024</span>
    </div>
    <SalesDataTable :columns="columns" :items="logs" search-placeholder="Search transaction...">
      <template #cell(noSales)="{ item }"><span class="font-mono tabular-nums">{{ item.noSales }}</span></template>
      <template #cell(price)="{ item }"><CurrencyDisplay :value="item.price" prefix="" /></template>
      <template #cell(actions)="{ item }"><div class="flex justify-center"><SalesActionButton action="view" :label="`View ${item.noSales}`" @click="selected = item" /></div></template>
    </SalesDataTable>

    <SalesDialog :open="!!selected" title="Calculation Detail" large @close="selected = null">
      <div v-if="selected" class="space-y-4">
        <h4 class="app-section-title">Order Spesification</h4>
        <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="w-full text-left text-sm">
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr><th class="w-1/2 bg-gray-50 px-4 py-3">No Sales</th><td class="px-4 py-3 font-mono">{{ selected.noSales }}</td></tr>
              <tr><th class="bg-gray-50 px-4 py-3">Customers</th><td class="px-4 py-3">{{ selected.customer }}</td></tr>
              <tr><th class="bg-gray-50 px-4 py-3">Date</th><td class="px-4 py-3">{{ selected.date }}</td></tr>
              <tr><th class="bg-gray-50 px-4 py-3">Chanel</th><td class="px-4 py-3">{{ selected.channel }}</td></tr>
              <tr><th class="bg-gray-50 px-4 py-3">Product Name</th><td class="px-4 py-3">{{ selected.productName }}</td></tr>
              <tr><th class="bg-gray-50 px-4 py-3">Price</th><td class="px-4 py-3"><CurrencyDisplay :value="selected.price" /></td></tr>
            </tbody>
          </table>
        </div>
        <p class="rounded-md bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">Rincian kalkulasi produksi belum tersimpan pada transaksi legacy ini.</p>
      </div>
    </SalesDialog>
  </section>
</template>
