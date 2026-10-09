<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Regency, RegencyFormData } from '#server/types/location'
import { useRegencies, useProvinces } from '~/composables/useLocations'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import RegencyModal from '~/components/pages/location/RegencyModal.vue'
import RegencyTable from '~/components/pages/location/RegencyTable.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const { regencies, pending: regenciesPending, error: regenciesError, refresh: refreshRegencies, saveRegency, deleteRegency } = useRegencies()
const { provinces, refresh: refreshProvinces } = useProvinces()

const pending = computed(() => regenciesPending.value)
const error = computed(() => regenciesError.value)

// Filter & search
const searchQuery = ref('')
const filterProvince = ref('')
const filterStatus = ref('')
const sortOrder = ref<'newest' | 'oldest' | 'name-asc' | 'name-desc'>('newest')

// Modal states
const isModalOpen = ref(false)
const isEditMode = ref(false)
const activeRegencyForEdit = ref<Regency | null>(null)
const regencyToDelete = ref<Regency | null>(null)
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
const provinceOptions = computed(() => provinces.value.map((p) => p.name))

const printColumns = [
  { key: 'id', label: 'ID' },
  { key: 'province', label: 'Province' },
  { key: 'name', label: 'Regency / City' },
  { key: 'type', label: 'Type' },
  { key: 'added', label: 'Added' },
  { key: 'createdBy', label: 'Created by' },
  { key: 'status', label: 'Status', align: 'center' as const },
]

const filteredRegencies = computed(() => {
  let list = [...regencies.value]

  if (filterProvince.value) {
    list = list.filter((r) => r.province.toLowerCase() === filterProvince.value.toLowerCase())
  }

  if (filterStatus.value) {
    list = list.filter((r) => r.status?.toLowerCase() === filterStatus.value.toLowerCase())
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.province.toLowerCase().includes(q) ||
        (r.type && r.type.toLowerCase().includes(q)) ||
        r.createdBy.toLowerCase().includes(q)
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

async function refreshAll() {
  await Promise.all([refreshRegencies(), refreshProvinces()])
}

function handleAdd() {
  isEditMode.value = false
  activeRegencyForEdit.value = null
  isModalOpen.value = true
}

function handleEdit(reg: Regency) {
  isEditMode.value = true
  activeRegencyForEdit.value = reg
  isModalOpen.value = true
}

function handleDeleteRequest(reg: Regency) {
  regencyToDelete.value = reg
}

async function confirmDelete() {
  if (!regencyToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteRegency(regencyToDelete.value.id)
    showToast(res?.message || 'Regency deleted successfully')
    regencyToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete regency')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: RegencyFormData) {
  isBusy.value = true
  try {
    const res = await saveRegency(formData)
    showToast(res?.message || 'Regency saved successfully')
    isModalOpen.value = false
    activeRegencyForEdit.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save regency')
  } finally {
    isBusy.value = false
  }
}

// Print & PDF
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

// CSV Export
function exportCsv() {
  if (filteredRegencies.value.length === 0) {
    showToast('No regency data to export')
    return
  }

  const header = ['ID', 'Province', 'Regency / City', 'Type', 'Added Date', 'Created By', 'Status']
  const rows = filteredRegencies.value.map((r) => [
    `"${r.id}"`,
    `"${r.province}"`,
    `"${r.name}"`,
    `"${r.type || 'Kota'}"`,
    `"${r.added || ''}"`,
    `"${r.createdBy || ''}"`,
    `"${r.status || 'Active'}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((row) => row.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `regencies_export_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Regency list exported to CSV successfully')
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
      title="Regency / City List"
      subtitle="Manage your Regency / City"
      add-label="Add New Regency"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refreshAll"
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
      :skeleton-cols="6"
      :error="error ? 'Unable to load regency records. Please try again.' : ''"
      @retry="refreshAll"
    />

    <!-- Main Data Table Component -->
    <RegencyTable
      v-if="!pending && !error"
      :items="filteredRegencies"
      :search-query="searchQuery"
      :filter-province="filterProvince"
      :filter-status="filterStatus"
      :sort-order="sortOrder"
      :province-options="provinceOptions"
      :status-options="statusOptions"
      @update:search-query="searchQuery = $event"
      @update:filter-province="filterProvince = $event"
      @update:filter-status="filterStatus = $event"
      @update:sort-order="sortOrder = $event"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Add/Edit Modal with Cascading Province Selection -->
    <RegencyModal
      :open="isModalOpen"
      :is-edit="isEditMode"
      :regency-data="activeRegencyForEdit"
      :provinces="provinces"
      :busy="isBusy"
      @close="isModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="!!regencyToDelete"
      :busy="isBusy"
      title="Delete Regency"
      :message="`Are you sure you want to delete '${regencyToDelete?.name}'?`"
      @close="regencyToDelete = null"
      @confirm="confirmDelete"
    />

    <!-- Document Print / PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Regency / City List Report"
      :columns="printColumns"
      :items="filteredRegencies"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
