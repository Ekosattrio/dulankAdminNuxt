<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Province, ProvinceFormData } from '#server/types/location'
import { useProvinces } from '~/composables/useLocations'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import ProvinceModal from '~/components/pages/location/ProvinceModal.vue'
import ProvinceTable from '~/components/pages/location/ProvinceTable.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const { provinces, pending, error, refresh, saveProvince, deleteProvince } = useProvinces()

// Filter and search
const searchQuery = ref('')
const filterStatus = ref('')
const sortOrder = ref<'newest' | 'oldest' | 'name-asc' | 'name-desc'>('newest')

// Modal states
const isModalOpen = ref(false)
const isEditMode = ref(false)
const activeProvinceForEdit = ref<Province | null>(null)
const provinceToDelete = ref<Province | null>(null)
const isBusy = ref(false)

// Toast notification
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

const statusOptions = ['Active', 'Inactive']

const printColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Province' },
  { key: 'code', label: 'Code' },
  { key: 'added', label: 'Added' },
  { key: 'createdBy', label: 'Created by' },
  { key: 'status', label: 'Status', align: 'center' as const },
]

const filteredProvinces = computed(() => {
  let list = [...provinces.value]

  if (filterStatus.value) {
    list = list.filter((p) => p.status?.toLowerCase() === filterStatus.value.toLowerCase())
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.code && p.code.toLowerCase().includes(q)) ||
        p.createdBy.toLowerCase().includes(q)
    )
  }

  if (sortOrder.value === 'newest') {
    list.sort((a, b) => (b.added || '').localeCompare(a.added || ''))
  } else if (sortOrder.value === 'oldest') {
    list.sort((a, b) => (a.added || '').localeCompare(b.added || ''))
  } else if (sortOrder.value === 'name-asc') {
    list.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortOrder.value === 'name-desc') {
    list.sort((a, b) => b.name.localeCompare(a.name))
  }

  return list
})

function handleAdd() {
  isEditMode.value = false
  activeProvinceForEdit.value = null
  isModalOpen.value = true
}

function handleEdit(prov: Province) {
  isEditMode.value = true
  activeProvinceForEdit.value = prov
  isModalOpen.value = true
}

function handleDeleteRequest(prov: Province) {
  provinceToDelete.value = prov
}

async function confirmDelete() {
  if (!provinceToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteProvince(provinceToDelete.value.id)
    showToast(res?.message || 'Province deleted successfully')
    provinceToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete province')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: ProvinceFormData) {
  isBusy.value = true
  try {
    const res = await saveProvince(formData)
    showToast(res?.message || 'Province saved successfully')
    isModalOpen.value = false
    activeProvinceForEdit.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save province')
  } finally {
    isBusy.value = false
  }
}

// Print & PDF
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

// CSV Export
function exportCsv() {
  if (filteredProvinces.value.length === 0) {
    showToast('No province data to export')
    return
  }

  const header = ['ID', 'Province Name', 'Code', 'Added Date', 'Created By', 'Status']
  const rows = filteredProvinces.value.map((p) => [
    `"${p.id}"`,
    `"${p.name}"`,
    `"${p.code || ''}"`,
    `"${p.added || ''}"`,
    `"${p.createdBy || ''}"`,
    `"${p.status || 'Active'}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((p) => p.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `provinces_export_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Province list exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Success Toast -->
    <div
      v-if="toastMessage"
      class="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-xl transition-all"
    >
      <FeatherIcon name="check-circle" size="16" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Header Toolbar -->
    <SalesListHeader
      title="Province List"
      subtitle="Manage your Province"
      add-label="Add New Province"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <button
          type="button"
          title="Export CSV"
          aria-label="Export CSV"
          class="inline-flex min-h-9 items-center gap-1.5 rounded border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          @click="exportCsv"
        >
          <FeatherIcon name="download" :size="14" />
          <span>Export CSV</span>
        </button>
      </template>
    </SalesListHeader>

    <!-- Feedback / Skeleton when pending -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="5"
      :error="error ? 'Unable to load province records. Please try again.' : ''"
      @retry="refresh"
    />

    <!-- Main Data Table Component -->
    <ProvinceTable
      v-if="!pending && !error"
      :items="filteredProvinces"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      :sort-order="sortOrder"
      :status-options="statusOptions"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @update:sort-order="sortOrder = $event"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Add/Edit Modal -->
    <ProvinceModal
      :open="isModalOpen"
      :is-edit="isEditMode"
      :province-data="activeProvinceForEdit"
      :busy="isBusy"
      @close="isModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="!!provinceToDelete"
      :busy="isBusy"
      title="Delete Province"
      :message="`Are you sure you want to delete '${provinceToDelete?.name}'?`"
      @close="provinceToDelete = null"
      @confirm="confirmDelete"
    />

    <!-- Document Print / PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Province List Report"
      :columns="printColumns"
      :items="filteredProvinces"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
