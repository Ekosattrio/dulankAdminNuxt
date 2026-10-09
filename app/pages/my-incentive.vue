<<<<<<< HEAD
<script setup lang="ts">import { formatRupiah } from "~/composables/useFormatters";

const { data: myIncentiveData } = await useFetch<MyIncentiveItem[]>('/api/my-incentive')
const items = ref<MyIncentiveItem[]>(myIncentiveData.value ?? [])
useMockSync('my-incentive', items);

const searchQuery = ref("");
const selectedProcess = ref("");

const filteredItems = computed(() => {
  return items.value.filter((i) => {
    const matchSearch = !searchQuery.value || i.code.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchProcess = !selectedProcess.value || i.process === selectedProcess.value;
    return matchSearch && matchProcess;
  });
});

const columns = [
  { key: "code", label: "# Incentive" },
  { key: "process", label: "Name Of Process" },
  { key: "date", label: "Date" },
  { key: "qty", label: "Qty" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="My Incentive List" subtitle="Manage My Incentive" />

    <!-- Stat widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-primary dark:bg-orange-950/40">
          <CommonFeatherIcon name="award" size="24" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500">Total Count Incentive</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">307,144</h4>
        </div>
      </div>

      <div
        class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
          <CommonFeatherIcon name="dollar-sign" size="24" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500">Amount Incentive</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">Rp4.385.000</h4>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search code..." />

        <CommonFilterSelect v-model="selectedProcess" :options="[{ value: 'Printing', label: 'Printing' }, { value: 'Cutting', label: 'Cutting' }, { value: 'Laminasi', label: 'Laminasi' }]" />
      </div>

      <TablesDataTable :columns="columns" :items="filteredItems">
        <template #cell(code)="{ item }">
          <span class="font-semibold text-primary">{{ item.code }}</span>
        </template>

        <template #cell(process)="{ item }">
          <span
            class="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {{ item.process }}
          </span>
        </template>

        <template #cell(date)="{ item }">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ item.date }}</span>
        </template>

        <template #cell(qty)="{ item }">
          <span class="font-bold text-gray-900 dark:text-gray-100">{{ item.qty }}</span>
        </template>

        <template #cell(amount)="{ item }">
          <span class="font-mono font-medium text-gray-900 dark:text-gray-100">{{ formatRupiah(item.amount) }}</span>
        </template>

        <template #cell(status)="{ item }">
          <CommonStatusPill :status="item.status" />
        </template>
      </TablesDataTable>
    </div>
=======
<script setup lang="ts">
import type { MyIncentiveFilterParams } from '#server/types/my-incentive'
import { useMyIncentives } from '~/composables/useMyIncentives'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import MyIncentiveStatsWidgets from '~/components/pages/my-incentive/MyIncentiveStatsWidgets.vue'
import MyIncentiveRecordsTable from '~/components/pages/my-incentive/MyIncentiveRecordsTable.vue'
import type { DateRangeValue } from '~/composables/useDateRange'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'My Incentive List - Dulank Admin',
  sweetAlert: false
})

const searchQuery = ref('')
const selectedProcess = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const filterParams = computed<MyIncentiveFilterParams>(() => ({
  search: searchQuery.value || undefined,
  process: selectedProcess.value && selectedProcess.value !== 'All Process' ? selectedProcess.value : undefined,
  startDate: filterDateRange.value?.start || undefined,
  endDate: filterDateRange.value?.end || undefined
}))

const { myIncentives, stats, pending, error, refresh } = useMyIncentives(filterParams)
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const incentivePrintColumns = [
  { key: 'date', label: 'Date' },
  { key: 'jobTitle', label: 'Job Title' },
  { key: 'flowName', label: 'Flow Name' },
  { key: 'incentive', label: 'Incentive', align: 'right' as const },
  { key: 'unit', label: 'Unit', align: 'center' as const },
  { key: 'qty', label: 'Qty', align: 'center' as const },
  { key: 'amount', label: 'Amount', align: 'right' as const }
]
</script>

<template>
  <div class="dulank-page dulank-page-my-incentive max-w-7xl mx-auto px-4 py-6">
    <!-- Header with literal titles from legacy HTML (Pdf, Print, Refresh icons, NO add button) -->
    <SalesListHeader
      title="My Incentive List"
      subtitle="Manage My Incentive"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- KPI Widgets matching exact legacy row & styling -->
    <MyIncentiveStatsWidgets :stats="stats" />

    <!-- Error & Skeleton Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="7"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Gagal memuat daftar insentif. Silakan coba lagi.') : ''"
      @retry="refresh"
    />

    <!-- Incentive Records Table (7 columns, tfoot sum, NO Action column) -->
    <MyIncentiveRecordsTable
      v-if="!pending && !error"
      :items="myIncentives"
      :loading="pending"
      v-model:search-query="searchQuery"
      v-model:selected-process="selectedProcess"
      v-model:date-range="filterDateRange"
      @refresh="refresh"
      @print="openPrintModal('print')"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Insentif Karyawan (My Incentive List)"
      :columns="incentivePrintColumns"
      :items="myIncentives"
      date-field="date"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
>>>>>>> origin/eko
  </div>
</template>
