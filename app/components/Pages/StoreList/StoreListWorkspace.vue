<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Store, StoreFormData } from '#server/types/store'
import { useStores } from '~/composables/useStores'
import { useTablePrint } from '~/composables/useTablePrint'
import StoreListRecordsTable from '~/components/Pages/StoreList/StoreListRecordsTable.vue'
import StoreListFormModal from '~/components/Pages/StoreList/StoreListFormModal.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')

const { stores, pending, error, refresh, saveStore, deleteStore } = useStores()

const filteredStores = computed(() => {
  return stores.value.filter((item) => {
    if (filterStatus.value && filterStatus.value !== 'All' && filterStatus.value !== '') {
      if (item.status?.toLowerCase() !== filterStatus.value.toLowerCase()) return false
    }
    return true
  })
})

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeStoreForEdit = ref<Store | null>(null)

const storeToDelete = ref<Store | null>(null)
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

// Handlers
function handleAdd() {
  isEditMode.value = false
  activeStoreForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(store: Store) {
  isEditMode.value = true
  activeStoreForEdit.value = store
  isFormModalOpen.value = true
}

function handleDeleteRequest(store: Store) {
  storeToDelete.value = store
}

async function confirmDelete() {
  if (!storeToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteStore(storeToDelete.value.id)
    showToast(res?.message || 'Store deleted successfully')
    storeToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete store')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: StoreFormData) {
  isBusy.value = true
  try {
    const res = await saveStore(formData)
    showToast(res?.message || (isEditMode.value ? 'Store updated successfully' : 'Store created successfully'))
    isFormModalOpen.value = false
    activeStoreForEdit.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save store')
  } finally {
    isBusy.value = false
  }
}

// Print & PDF
const {
  isPrintModalOpen,
  printTitle,
  printColumns,
  printRows,
  openPrintModal,
} = useTablePrint()

function handlePrint() {
  openPrintModal({
    title: 'Stores Report - Toko & Cabang Percetakan',
    columns: [
      { key: 'storeName', label: 'Store Name' },
      { key: 'userName', label: 'Manager / User' },
      { key: 'address', label: 'Address' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' },
    ],
    rows: filteredStores.value.map(s => ({
      storeName: s.storeName,
      userName: s.userName,
      address: s.address || '-',
      phone: s.phone || '-',
      email: s.email || '-',
      status: s.status,
    })),
  })
}

function handleExportPdf() {
  handlePrint()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Toast notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="toastMessage"
        class="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-xl"
        role="alert"
      >
        <FeatherIcon name="check-circle" size="18" />
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Header bar -->
    <SalesListHeader
      title="Stores / Cabang Toko"
      subtitle="Kelola gerai fisik dan cabang percetakan online"
      add-label="Add Store"
      :refreshing="pending"
      @refresh="refresh()"
      @print="handlePrint"
      @pdf="handleExportPdf"
      @add="handleAdd"
    />

    <!-- Table content with skeleton -->
    <SalesFeedback
      :pending="pending"
      :error="error ? 'Unable to load stores data. Please try again.' : ''"
      skeleton="table"
      :skeleton-cols="7"
      :skeleton-rows="5"
      @retry="refresh()"
    />

    <StoreListRecordsTable
      v-if="!pending && !error"
      :stores="filteredStores"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Modals -->
    <StoreListFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :store-data="activeStoreForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <SalesConfirmDelete
      :open="!!storeToDelete"
      title="Delete Store"
      :message="`Are you sure you want to delete branch '${storeToDelete?.storeName}'? This action cannot be undone.`"
      :busy="isBusy"
      @close="storeToDelete = null"
      @confirm="confirmDelete"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      :title="printTitle"
      :columns="printColumns"
      :rows="printRows"
      @close="isPrintModalOpen = false"
    />
  </div>
</template>

