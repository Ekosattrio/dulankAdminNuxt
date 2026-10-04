<script setup lang="ts">
import type { MyIncentiveFilterParams } from '#server/types/my-incentive'
import { useMyIncentives } from '~/composables/useMyIncentives'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import MyIncentiveStatsWidgets from '~/components/pages/my-incentive/MyIncentiveStatsWidgets.vue'
import MyIncentiveRecordsTable from '~/components/pages/my-incentive/MyIncentiveRecordsTable.vue'
import type { DateRangeValue } from '~/composables/useDateRange'

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

    <!-- Error State -->
    <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
      Gagal memuat daftar insentif: {{ error.message }}
      <button class="ml-2 underline font-semibold" @click="refresh">Coba lagi</button>
    </div>

    <!-- Incentive Records Table (7 columns, tfoot sum, NO Action column) -->
    <MyIncentiveRecordsTable
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
  </div>
</template>
