<script setup lang="ts">
import type { JobProgressItem } from '~/components/pages/job-progress/JobProgressTable.vue'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import JobProgressStatsWidget from '~/components/pages/job-progress/JobProgressStatsWidget.vue'
import JobProgressTable from '~/components/pages/job-progress/JobProgressTable.vue'

definePageMeta({
  layout: 'default',
  alias: ['/job-progress.html'],
})
useLegacyPage({ title: 'Job Progress List', sweetAlert: false })

const progressList = ref<JobProgressItem[]>([
  {
    id: 1,
    progressCode: 'PROG-001',
    product: 'Kartu Nama',
    description: 'Kartu Nama 90x55mm, Art Carton 310gr, Laminasi Glossy 2 Sisi',
    process: 'Printing',
    completedBy: 'Eko Satrio',
    time: '2025-10-01 09:30',
    note: 'Selesai cetak, kualitas baik.',
    isCompleted: true,
  },
  {
    id: 2,
    progressCode: 'PROG-002',
    product: 'Kartu Nama',
    description: 'Kartu Nama 90x55mm, Art Carton 310gr, Laminasi Glossy 2 Sisi',
    process: 'Cutting',
    completedBy: 'Desman Dwi',
    time: '2025-10-01 11:45',
    note: 'Sudah di potong, siap laminasi.',
    isCompleted: true,
  },
  {
    id: 3,
    progressCode: 'PROG-003',
    product: 'Flyer',
    description: 'Flyer A5, Art Carton 260gr, Laminasi Doff 1 Sisi',
    process: 'Printing',
    completedBy: '',
    time: '',
    note: '',
    isCompleted: false,
  },
  {
    id: 4,
    progressCode: 'PROG-004',
    product: 'Flyer',
    description: 'Flyer A5, Art Carton 260gr, Laminasi Doff 1 Sisi',
    process: 'Cutting',
    completedBy: 'Adi Nugroho',
    time: '',
    note: 'Sedang proses potong, antrian panjang.',
    isCompleted: false,
  },
  {
    id: 5,
    progressCode: 'PROG-005',
    product: 'Banner',
    description: 'Spanduk Flexi 280gr, Ukuran 3x1 Meter, Mata Ayam di Setiap Sudut',
    process: 'Printing',
    completedBy: 'Eko Satrio',
    time: '2025-09-30 18:00',
    note: 'Hasil cetak oke, warna sesuai.',
    isCompleted: true,
  },
])

const searchQuery = ref('')
const filterProcess = ref('')
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'progressCode', label: '# Progress' },
  { key: 'product', label: 'Product' },
  { key: 'description', label: 'Product Description' },
  { key: 'process', label: 'Job Process' },
  { key: 'completedBy', label: 'Completed By' },
  { key: 'time', label: 'Time Completed' },
  { key: 'note', label: 'Note' },
]

const filteredList = computed(() => {
  return progressList.value.filter((p) => {
    const matchSearch =
      !searchQuery.value ||
      p.progressCode.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.completedBy.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchProc = !filterProcess.value || p.process === filterProcess.value
    return matchSearch && matchProc
  })
})

function toggleComplete(item: JobProgressItem) {
  item.isCompleted = !item.isCompleted
  if (item.isCompleted) {
    item.completedBy = 'Current User'
    item.time = new Date().toLocaleString()
  } else {
    item.completedBy = ''
    item.time = ''
  }
}

function refresh() {
  searchQuery.value = ''
  filterProcess.value = ''
}
</script>

<template>
  <div class="dulank-page dulank-page-job-progress space-y-4 p-4 md:p-6">
    <SalesListHeader
      title="Job Progress List"
      subtitle="Monitor real-time status of individual production stages"
      :show-add-button="false"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <JobProgressStatsWidget :total-count="filteredList.length" />

    <JobProgressTable
      :items="filteredList"
      :search-query="searchQuery"
      :filter-process="filterProcess"
      @update:search-query="searchQuery = $event"
      @update:filter-process="filterProcess = $event"
      @toggle-complete="toggleComplete"
    />

    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Job Progress List"
      :columns="printColumns"
      :items="filteredList"
      :default-action="defaultPrintAction"
      :show-date-range="false"
      @close="closePrintModal"
    />
  </div>
</template>
