<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBestSellerReport } from '~/composables/useSalesReports'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatIDR } from '~/utils/currency'

// Components
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const { items, search, category, dateRange, pending, error, refresh, stats } = useBestSellerReport()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

// Toast
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

// Columns definition for SalesDataTable
const columns = [
  { key: 'rank', label: 'Rank', sortable: true, align: 'center' as const },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'product', label: 'Product', sortable: true },
  { key: 'soldQty', label: 'Sold', sortable: true, align: 'center' as const },
  { key: 'unit', label: 'Unit', sortable: true },
  { key: 'total', label: 'Total', sortable: true, align: 'end' as const },
]

// Print columns
const printColumns = [
  { key: 'rank', label: 'Rank', align: 'center' as const },
  { key: 'category', label: 'Category' },
  { key: 'product', label: 'Product' },
  { key: 'soldQty', label: 'Sold', align: 'center' as const },
  { key: 'unit', label: 'Unit' },
  { key: 'total', label: 'Total', align: 'right' as const, format: (v: number) => formatIDR(v) },
]

// Category options
const categoryOptions = computed(() => {
  const set = new Set(items.value.map(i => i.category))
  return Array.from(set)
})

// Export CSV
function exportCsv() {
  if (items.value.length === 0) {
    showToast('No bestseller report data to export')
    return
  }

  const headers = ['Rank', 'Category', 'Product', 'Sold', 'Unit', 'Total']
  const rows = items.value.map(item => [
    item.rank,
    `"${item.category}"`,
    `"${item.product}"`,
    item.soldQty,
    `"${item.unit}"`,
    item.total,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `bestseller_report_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Bestseller report exported to CSV successfully')
}
</script>

<template>
  <div class="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <SalesListHeader
      title="Bestseller Products Report"
      subtitle="View rankings and total revenue of best selling products"
      :refreshing="pending"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <button
          type="button"
          title="Export CSV"
          aria-label="Export CSV"
          class="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          @click="exportCsv"
        >
          <FeatherIcon name="download" :size="14" />
          <span>Export CSV</span>
        </button>
      </template>
    </SalesListHeader>

    <!-- 4 KPI Summary Cards -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          <FeatherIcon name="award" :size="22" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Top Product</p>
          <h3 class="truncate text-base font-bold text-gray-900 dark:text-white" :title="stats.topProduct">
            {{ stats.topProduct }}
          </h3>
        </div>
      </div>

      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <FeatherIcon name="package" :size="22" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Ranked Items</p>
          <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            {{ stats.totalProducts }} Products
          </h3>
        </div>
      </div>

      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
          <FeatherIcon name="shopping-bag" :size="22" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Quantity Sold</p>
          <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            {{ stats.totalSoldQty.toLocaleString('id-ID') }}
          </h3>
        </div>
      </div>

      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <FeatherIcon name="dollar-sign" :size="22" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Bestseller Value</p>
          <h3 class="truncate text-lg font-bold text-emerald-600 dark:text-emerald-400">
            <CurrencyDisplay :value="stats.totalSalesValue" :bold="true" align="left" />
          </h3>
        </div>
      </div>
    </div>

    <!-- Feedback & Skeleton -->
    <SalesFeedback
      :pending="pending"
      :error="error?.message || ''"
      :message="toastMessage"
      skeleton="table"
      :skeleton-rows="6"
      :skeleton-cols="6"
      @retry="refresh"
      @dismiss="toastMessage = ''"
    >
      <!-- SalesDataTable directly mounted without double cards -->
      <SalesDataTable
        :columns="columns"
        :items="items"
        v-model:search="search"
        search-placeholder="Search bestseller product..."
      >
        <!-- Filter slot -->
        <template #filters>
          <DateRangePicker v-model="dateRange" placeholder="Date" />
          <TableFilterSelect
            v-model="category"
            :options="categoryOptions"
            placeholder="All Categories"
            aria-label="Filter by Category"
          />
        </template>

        <!-- Cell overrides -->
        <template #cell(rank)="{ item }">
          <span
            :class="[
              'inline-flex size-6 items-center justify-center rounded-full text-xs font-bold',
              item.rank === 1
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                : item.rank === 2
                  ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  : item.rank === 3
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            ]"
          >
            {{ item.rank }}
          </span>
        </template>

        <template #cell(category)="{ item }">
          <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            {{ item.category }}
          </span>
        </template>

        <template #cell(product)="{ item }">
          <span class="font-semibold text-gray-900 dark:text-white">
            {{ item.product }}
          </span>
        </template>

        <template #cell(soldQty)="{ item }">
          <span class="font-medium text-gray-900 dark:text-white">
            {{ Number(item.soldQty).toLocaleString('id-ID') }}
          </span>
        </template>

        <template #cell(total)="{ item }">
          <CurrencyDisplay :value="item.total" />
        </template>

        <!-- Footer Total -->
        <template #footer="{ items: filteredList }">
          <tr class="font-bold text-gray-900 dark:text-white">
            <td colspan="3" class="px-4 py-3">Total</td>
            <td class="px-4 py-3 text-center">
              {{ filteredList.reduce((acc, i) => acc + (i.soldQty || 0), 0).toLocaleString('id-ID') }}
            </td>
            <td class="px-4 py-3 text-gray-500">-</td>
            <td class="px-4 py-3 text-end text-emerald-600 dark:text-emerald-400">
              <CurrencyDisplay :value="filteredList.reduce((acc, i) => acc + (i.total || 0), 0)" :bold="true" />
            </td>
          </tr>
        </template>
      </SalesDataTable>
    </SalesFeedback>

    <!-- Standard Document Print & PDF Modal (Kop Surat PT. DULANK SEMESTA CIDA) -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Bestseller Products Report"
      subtitle="Laporan Produk Terlaris (Bestseller)"
      :columns="printColumns"
      :items="items"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

