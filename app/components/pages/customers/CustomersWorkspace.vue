<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Customer, CustomerFormData } from '#server/types/customer'
import { type DateRangeValue, isDateInRange } from '~/composables/useDateRange'
import { useCustomers } from '~/composables/useCustomers'
import { useTablePrint } from '~/composables/useTablePrint'
import CustomerRecordsTable from '~/components/pages/customers/CustomerRecordsTable.vue'
import CustomerFormModal from '~/components/pages/customers/CustomerFormModal.vue'
import CustomerViewModal from '~/components/pages/customers/CustomerViewModal.vue'
import CustomerAddAddressModal from '~/components/pages/customers/CustomerAddAddressModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

// Filter states
const searchQuery = ref('')
const filterType = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const { customers, pending, error, refresh, saveCustomer, deleteCustomer } = useCustomers()

const filteredCustomers = computed(() => {
  return customers.value.filter((c) => {
    if (filterType.value && filterType.value !== 'All' && filterType.value !== '') {
      if (c.type?.toLowerCase() !== filterType.value.toLowerCase()) return false
    }
    if (filterDateRange.value) {
      if (!isDateInRange(c.dateJoin, filterDateRange.value)) return false
    }
    return true
  })
})

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeCustomerForEdit = ref<Customer | null>(null)

const isViewModalOpen = ref(false)
const activeCustomerForView = ref<Customer | null>(null)

const isAddAddressModalOpen = ref(false)
const activeCustomerForAddress = ref<Customer | null>(null)

const customerToDelete = ref<Customer | null>(null)
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
  activeCustomerForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(customer: Customer) {
  isEditMode.value = true
  activeCustomerForEdit.value = customer
  isFormModalOpen.value = true
}

function handleView(customer: Customer) {
  activeCustomerForView.value = customer
  isViewModalOpen.value = true
}

function handleAddAddress(customer: Customer) {
  activeCustomerForAddress.value = customer
  isAddAddressModalOpen.value = true
}

function handleDeleteRequest(customer: Customer) {
  customerToDelete.value = customer
}

async function confirmDelete() {
  if (!customerToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteCustomer(customerToDelete.value.id)
    showToast(res?.message || 'Customer deleted successfully')
    customerToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete customer')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: CustomerFormData) {
  isBusy.value = true
  try {
    const res = await saveCustomer(formData)
    showToast(res?.message || (formData.id ? 'Customer updated successfully' : 'Customer created successfully'))
    isFormModalOpen.value = false
    activeCustomerForEdit.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save customer')
  } finally {
    isBusy.value = false
  }
}

// Print & PDF Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'customerId', label: 'Customer ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'type', label: 'Customer Type' },
  { key: 'balance', label: 'Balance', align: 'right' as const },
  { key: 'phone', label: 'Contact No' },
  { key: 'channel', label: 'Join Channel' },
  { key: 'dateJoin', label: 'Date Join' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Success / Info Toast -->
    <div
      v-if="toastMessage"
      class="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-xl transition-all"
    >
      <FeatherIcon name="check-circle" size="16" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Header Toolbar -->
    <SalesListHeader
      title="Customer List"
      subtitle="Manage your customers & contacts"
      add-label="Add New Customer"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- Loading / Error Feedback with Skeleton Loader -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="10"
      :error="error ? 'Unable to load customers data. Please try again.' : ''"
      @retry="refresh()"
    />

    <!-- Main Table -->
    <CustomerRecordsTable
      v-if="!pending && !error"
      :customers="filteredCustomers"
      :search-query="searchQuery"
      :filter-type="filterType"
      :filter-date-range="filterDateRange"
      @update:search-query="searchQuery = $event"
      @update:filter-type="filterType = $event"
      @update:filter-date-range="filterDateRange = $event"
      @add-address="handleAddAddress"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Add / Edit Modal -->
    <CustomerFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :customer-data="activeCustomerForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- View Customer Details Modal -->
    <CustomerViewModal
      :open="isViewModalOpen"
      :customer="activeCustomerForView"
      @close="isViewModalOpen = false"
    />

    <!-- Add Address Modal -->
    <CustomerAddAddressModal
      :open="isAddAddressModalOpen"
      :customer="activeCustomerForAddress"
      @close="isAddAddressModalOpen = false"
      @success="showToast"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="!!customerToDelete"
      title="Delete Customer"
      :message="`Are you sure you want to delete customer '${customerToDelete?.name}' (${customerToDelete?.customerId})?`"
      :busy="isBusy"
      @confirm="confirmDelete"
      @close="customerToDelete = null"
    />

    <!-- Document Print / PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Customers Report"
      :columns="printColumns"
      :items="filteredCustomers"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

