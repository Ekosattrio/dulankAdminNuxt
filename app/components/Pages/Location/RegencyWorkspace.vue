<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Regency, RegencyFormData } from '#server/types/location'
import { useRegencies, useProvinces } from '~/composables/useLocations'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import RegencyModal from '~/components/Pages/Location/RegencyModal.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

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
let toastTimer: any = null

function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

const statusOptions = ['Active', 'Inactive']
const provinceOptions = computed(() => provinces.value.map((p) => p.name))

const columns = [
  { key: 'province', label: 'Province', sortable: true },
  { key: 'name', label: 'Regency / City', sortable: true },
  { key: 'added', label: 'Added', sortable: true },
  { key: 'createdBy', label: 'Created by', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

const printColumns = [
  { key: 'id', label: 'ID' },
  { key: 'province', label: 'Province' },
  { key: 'name', label: 'Regency / City' },
  { key: 'type', label: 'Type' },
  { key: 'added', label: 'Added' },
  { key: 'createdBy', label: 'Created by' },
  { key: 'status', label: 'Status', align: 'center' as const },
]

// Filtered and sorted items
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

    <!-- Main Data Table -->
    <SalesDataTable
      v-if="!pending && !error"
      :columns="columns"
      :items="filteredRegencies"
      :search="searchQuery"
      search-placeholder="Search Regency, Province..."
      @update:search="searchQuery = $event"
    >
      <!-- Filters slot -->
      <template #filters>
        <!-- Province Filter -->
        <TableFilterSelect
          v-model="filterProvince"
          :options="provinceOptions"
          placeholder="All Provinces"
          aria-label="Filter province"
        />

        <!-- Status Filter -->
        <TableFilterSelect
          v-model="filterStatus"
          :options="statusOptions"
          placeholder="All Status"
          aria-label="Filter status"
        />

        <!-- Sort Select -->
        <select
          v-model="sortOrder"
          aria-label="Sort order"
          class="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </template>

      <!-- Custom Cells -->
      <template #cell(province)="{ item }">
        <span class="inline-flex items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
          <FeatherIcon name="map-pin" :size="13" class="text-primary/70" />
          {{ item.province }}
        </span>
      </template>

      <template #cell(name)="{ item }">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span>
          <span
            class="rounded px-1.5 py-0.5 text-[10px] font-semibold"
            :class="item.type === 'Kabupaten' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'"
          >
            {{ item.type || 'Kota' }}
          </span>
        </div>
      </template>

      <template #cell(added)="{ item }">
        <span class="text-xs text-gray-600 dark:text-gray-400">{{ item.added }}</span>
      </template>

      <template #cell(createdBy)="{ item }">
        <div class="flex items-center gap-2">
          <img
            :src="item.avatar || '/assets/img/users/user-30.jpg'"
            :alt="item.createdBy"
            class="size-7 rounded-full object-cover border border-gray-200 dark:border-gray-700"
            @error="($event.target as HTMLImageElement).src = '/assets/img/users/user-30.jpg'"
          />
          <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ item.createdBy }}</span>
        </div>
      </template>

      <template #cell(status)="{ item }">
        <span
          class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium"
          :class="item.status === 'Inactive' ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'"
        >
          {{ item.status || 'Active' }}
        </span>
      </template>

      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center gap-1.5">
          <SalesActionButton
            icon="edit"
            label="Edit Regency"
            @click="handleEdit(item)"
          />
          <SalesActionButton
            icon="trash-2"
            label="Delete Regency"
            @click="handleDeleteRequest(item)"
          />
        </div>
      </template>
    </SalesDataTable>

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

