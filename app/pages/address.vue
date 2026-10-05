<script setup lang="ts">
import type { CustomerAddress, SupplierAddress, AddressFormData } from '~/types/address'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useAddress } from '~/composables/useAddress'
import { useTablePrint } from '~/composables/useTablePrint'
import AddressStatsWidgets from '~/components/pages/address/AddressStatsWidgets.vue'
import AddressRecordsTable from '~/components/pages/address/AddressRecordsTable.vue'
import AddressFormModal from '~/components/pages/address/AddressFormModal.vue'
import AddressViewModal from '~/components/pages/address/AddressViewModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

useLegacyPage({ title: 'Address List', sweetAlert: false })

const { stats, customers, suppliers, pending, error, refresh, saveAddress, deleteAddress } = useAddress()

// Filters
const activeTab = ref<'customer' | 'supplier'>('customer')
const searchQuery = ref('')
const filterStatus = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeAddressForEdit = ref<any | null>(null)

const isViewModalOpen = ref(false)
const activeAddressForView = ref<any | null>(null)

const addressToDelete = ref<any | null>(null)
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

const currentItems = computed(() => {
  const sourceList = activeTab.value === 'customer' ? customers.value : suppliers.value
  return sourceList.filter((item: any) => {
    const q = searchQuery.value.toLowerCase().trim()
    const name = (item.name || item.user || '').toLowerCase()
    const city = (item.city || '').toLowerCase()
    const province = (item.province || '').toLowerCase()
    const contact = (item.contact || item.phone || '').toLowerCase()
    const detail = (item.detailAddress || '').toLowerCase()
    const entityId = (item.customerId || item.supplierId || item.id || '').toLowerCase()

    const matchSearch = !q || name.includes(q) || city.includes(q) || province.includes(q) || contact.includes(q) || detail.includes(q) || entityId.includes(q)
    const matchStatus = !filterStatus.value || (item.status || '').toLowerCase() === filterStatus.value.toLowerCase()

    return matchSearch && matchStatus
  })
})

function handleAdd() {
  isEditMode.value = false
  activeAddressForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: any) {
  isEditMode.value = true
  activeAddressForEdit.value = item
  isFormModalOpen.value = true
}

function handleView(item: any) {
  activeAddressForView.value = item
  isViewModalOpen.value = true
}

function handleDeleteRequest(item: any) {
  addressToDelete.value = item
}

async function confirmDelete() {
  if (!addressToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteAddress(addressToDelete.value.id, activeTab.value)
    showToast(res?.message || 'Address successfully deleted')
    addressToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete address')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: any) {
  isBusy.value = true
  try {
    const res = await saveAddress(formData, activeTab.value)
    showToast(res?.message || 'Address saved successfully')
    isFormModalOpen.value = false
    activeAddressForEdit.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save address')
  } finally {
    isBusy.value = false
  }
}

// Print & PDF
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'id', label: 'ID Address' },
  { key: 'customerId', label: 'Entity ID' },
  { key: 'name', label: 'Name' },
  { key: 'contact', label: 'Contact' },
  { key: 'province', label: 'Province' },
  { key: 'city', label: 'City' },
  { key: 'district', label: 'District' },
  { key: 'detailAddress', label: 'Detail Address' },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'date', label: 'Date' },
]
</script>

<template>
  <div class="dulank-page dulank-page-address space-y-6">
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
      title="Address List"
      subtitle="Manage your Addresses & Locations"
      add-label="Add New Address"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- KPI Widgets -->
    <AddressStatsWidgets :stats="stats" />

    <!-- Loading Feedback with Skeleton Loader -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="12"
      :error="error ? 'Unable to load address records. Please try again.' : ''"
      @retry="refresh()"
    />

    <!-- Main Table with Tab Customers / Supplier -->
    <AddressRecordsTable
      v-if="!pending && !error"
      v-model:active-tab="activeTab"
      v-model:search-query="searchQuery"
      v-model:filter-status="filterStatus"
      v-model:filter-date-range="filterDateRange"
      :items="currentItems"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Add / Edit Modal -->
    <AddressFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :address-data="activeAddressForEdit"
      :active-type="activeTab"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- View Modal -->
    <AddressViewModal
      :open="isViewModalOpen"
      :address-data="activeAddressForView"
      @close="isViewModalOpen = false"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="!!addressToDelete"
      title="Delete Address"
      :message="`Are you sure you want to delete address '${addressToDelete?.id}' (${addressToDelete?.name || addressToDelete?.user})?`"
      :busy="isBusy"
      @confirm="confirmDelete"
      @close="addressToDelete = null"
    />

    <!-- Print & PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Address Report"
      :columns="printColumns"
      :items="currentItems"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
