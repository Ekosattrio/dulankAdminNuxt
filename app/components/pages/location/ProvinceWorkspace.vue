<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Province, ProvinceFormData } from '#server/types/location'
import { useProvinces } from '~/composables/useLocations'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import ProvinceModal from '~/components/pages/location/ProvinceModal.vue'
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
let toastTimer: any = null

function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

const statusOptions = ['Active', 'Inactive']

// Columns configuration
const columns = [
  { key: 'name', label: 'Province', sortable: true },
  { key: 'added', label: 'Added', sortable: true },
  { key: 'createdBy', label: 'Created by', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

// Print columns
const printColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Province' },
  { key: 'code', label: 'Code' },
  { key: 'added', label: 'Added' },
  { key: 'createdBy', label: 'Created by' },
  { key: 'status', label: 'Status', align: 'center' as const },
]

// Filtered and sorted items
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

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n')
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
      @refresh="refresh()"
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

    <!-- Feedback / TableSkeleton when pending -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="5"
      :error="error ? 'Unable to load province records. Please try again.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table -->
    <SalesDataTable
      v-if="!pending && !error"
      :columns="columns"
      :items="filteredProvinces"
      :search="searchQuery"
      search-placeholder="Search Province..."
      @update:search="searchQuery = $event"
    >
      <!-- Custom Filters Slot -->
      <template #filters>
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
      <template #cell(name)="{ item }">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span>
          <span
            v-if="item.code"
            class="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary dark:bg-primary/20"
          >
            {{ item.code }}
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
            label="Edit Province"
            @click="handleEdit(item)"
          />
          <SalesActionButton
            icon="trash-2"
            label="Delete Province"
            @click="handleDeleteRequest(item)"
          />
        </div>
      </template>
    </SalesDataTable>

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

