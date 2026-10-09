<script setup lang="ts">
import { ref, computed } from 'vue'
import type { District, DistrictFormData } from '#server/types/location'
import { useDistricts, useRegencies, useProvinces } from '~/composables/useLocations'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import DistrictModal from '~/components/pages/location/DistrictModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const { districts, pending: districtsPending, error: districtsError, refresh: refreshDistricts, saveDistrict, deleteDistrict } = useDistricts()
const { regencies, refresh: refreshRegencies } = useRegencies()
const { provinces, refresh: refreshProvinces } = useProvinces()

const pending = computed(() => districtsPending.value)
const error = computed(() => districtsError.value)

// Filters & search
const searchQuery = ref('')
const filterProvince = ref('')
const filterRegency = ref('')
const filterStatus = ref('')
const sortOrder = ref<'newest' | 'oldest' | 'name-asc' | 'name-desc'>('newest')

// Modal states
const isModalOpen = ref(false)
const isEditMode = ref(false)
const activeDistrictForEdit = ref<District | null>(null)
const districtToDelete = ref<District | null>(null)
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

// Regency options based on selected province filter
const regencyOptions = computed(() => {
  if (!filterProvince.value) {
    return Array.from(new Set(regencies.value.map((r) => r.name)))
  }
  const pName = filterProvince.value.toLowerCase()
  return regencies.value
    .filter((r) => r.province.toLowerCase() === pName)
    .map((r) => r.name)
})

// Columns
const columns = [
  { key: 'province', label: 'Province', sortable: true },
  { key: 'regency', label: 'Regency / City', sortable: true },
  { key: 'name', label: 'District', sortable: true },
  { key: 'added', label: 'Added', sortable: true },
  { key: 'createdBy', label: 'Created by', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

const printColumns = [
  { key: 'id', label: 'ID' },
  { key: 'province', label: 'Province' },
  { key: 'regency', label: 'Regency / City' },
  { key: 'name', label: 'District' },
  { key: 'postalCode', label: 'Postal Code' },
  { key: 'added', label: 'Added' },
  { key: 'createdBy', label: 'Created by' },
  { key: 'status', label: 'Status', align: 'center' as const },
]

// Filtered and sorted items
const filteredDistricts = computed(() => {
  let list = [...districts.value]

  if (filterProvince.value) {
    list = list.filter((d) => d.province.toLowerCase() === filterProvince.value.toLowerCase())
  }

  if (filterRegency.value) {
    list = list.filter((d) => d.regency.toLowerCase() === filterRegency.value.toLowerCase())
  }

  if (filterStatus.value) {
    list = list.filter((d) => d.status?.toLowerCase() === filterStatus.value.toLowerCase())
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.regency.toLowerCase().includes(q) ||
        d.province.toLowerCase().includes(q) ||
        (d.postalCode && d.postalCode.includes(q)) ||
        d.createdBy.toLowerCase().includes(q)
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
  await Promise.all([refreshDistricts(), refreshRegencies(), refreshProvinces()])
}

function handleAdd() {
  isEditMode.value = false
  activeDistrictForEdit.value = null
  isModalOpen.value = true
}

function handleEdit(dist: District) {
  isEditMode.value = true
  activeDistrictForEdit.value = dist
  isModalOpen.value = true
}

function handleDeleteRequest(dist: District) {
  districtToDelete.value = dist
}

async function confirmDelete() {
  if (!districtToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteDistrict(districtToDelete.value.id)
    showToast(res?.message || 'District deleted successfully')
    districtToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete district')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: DistrictFormData) {
  isBusy.value = true
  try {
    const res = await saveDistrict(formData)
    showToast(res?.message || 'District saved successfully')
    isModalOpen.value = false
    activeDistrictForEdit.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save district')
  } finally {
    isBusy.value = false
  }
}

// Print & PDF
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

// CSV Export
function exportCsv() {
  if (filteredDistricts.value.length === 0) {
    showToast('No district data to export')
    return
  }

  const header = ['ID', 'Province', 'Regency / City', 'District', 'Postal Code', 'Added Date', 'Created By', 'Status']
  const rows = filteredDistricts.value.map((d) => [
    `"${d.id}"`,
    `"${d.province}"`,
    `"${d.regency}"`,
    `"${d.name}"`,
    `"${d.postalCode || ''}"`,
    `"${d.added || ''}"`,
    `"${d.createdBy || ''}"`,
    `"${d.status || 'Active'}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((row) => row.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `districts_export_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('District list exported to CSV successfully')
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
      title="District / Kecamatan List"
      subtitle="Manage your District / Kecamatan"
      add-label="Add New District"
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
      :skeleton-cols="7"
      :error="error ? 'Unable to load district records. Please try again.' : ''"
      @retry="refreshAll"
    />

    <!-- Main Data Table -->
    <SalesDataTable
      v-if="!pending && !error"
      :columns="columns"
      :items="filteredDistricts"
      :search="searchQuery"
      search-placeholder="Search District, Regency, Province..."
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
          @update:model-value="filterRegency = ''"
        />

        <!-- Regency Filter -->
        <TableFilterSelect
          v-model="filterRegency"
          :options="regencyOptions"
          placeholder="All Regencies"
          aria-label="Filter regency"
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

      <template #cell(regency)="{ item }">
        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ item.regency }}</span>
      </template>

      <template #cell(name)="{ item }">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span>
          <span
            v-if="item.postalCode"
            class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          >
            {{ item.postalCode }}
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
            label="Edit District"
            @click="handleEdit(item)"
          />
          <SalesActionButton
            icon="trash-2"
            label="Delete District"
            @click="handleDeleteRequest(item)"
          />
        </div>
      </template>
    </SalesDataTable>

    <!-- Add/Edit Modal with Cascading Province & Regency Selection -->
    <DistrictModal
      :open="isModalOpen"
      :is-edit="isEditMode"
      :district-data="activeDistrictForEdit"
      :provinces="provinces"
      :regencies="regencies"
      :busy="isBusy"
      @close="isModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="!!districtToDelete"
      :busy="isBusy"
      title="Delete District"
      :message="`Are you sure you want to delete '${districtToDelete?.name}'?`"
      @close="districtToDelete = null"
      @confirm="confirmDelete"
    />

    <!-- Document Print / PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="District / Kecamatan List Report"
      :columns="printColumns"
      :items="filteredDistricts"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

