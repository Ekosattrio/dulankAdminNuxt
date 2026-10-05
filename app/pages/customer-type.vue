<script setup lang="ts">
import type { CustomerType, CustomerTypeFormData } from '#server/types/customer-type'
import { useCustomerTypes } from '~/composables/useCustomerTypes'
import { useTablePrint } from '~/composables/useTablePrint'
import CustomerTypeRecordsTable from '~/components/pages/customer-type/CustomerTypeRecordsTable.vue'
import CustomerTypeFormModal from '~/components/pages/customer-type/CustomerTypeFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

useLegacyPage({ title: 'Customer Type', sweetAlert: false })

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  status: filterStatus.value,
}))

const { customerTypes, pending, error, refresh, saveCustomerType, deleteCustomerType } = useCustomerTypes(filterParams)

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeTypeForEdit = ref<CustomerType | null>(null)
const typeToDelete = ref<CustomerType | null>(null)
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

function handleAdd() {
  isEditMode.value = false
  activeTypeForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: CustomerType) {
  isEditMode.value = true
  activeTypeForEdit.value = item
  isFormModalOpen.value = true
}

function handleDeleteRequest(item: CustomerType) {
  typeToDelete.value = item
}

async function confirmDelete() {
  if (!typeToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteCustomerType(typeToDelete.value.id)
    showToast(res?.message || 'Customer type deleted successfully')
    typeToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete customer type')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: CustomerTypeFormData) {
  isBusy.value = true
  try {
    const res = await saveCustomerType(formData)
    showToast(res?.message || (formData.id ? 'Customer type updated successfully' : 'Customer type created successfully'))
    isFormModalOpen.value = false
    activeTypeForEdit.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save customer type')
  } finally {
    isBusy.value = false
  }
}

// Print & PDF Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'name', label: 'Customer Type' },
  { key: 'status', label: 'Status', align: 'center' as const },
]
</script>

<template>
  <div class="dulank-page dulank-page-customer-type space-y-6">
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
      title="Customer Type"
      subtitle="Manage your Customer Types"
      add-label="Add Customer Type"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- Loading Feedback with Table Skeleton -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="3"
      :error="error ? 'Unable to load customer types. Please try again.' : ''"
      @retry="refresh()"
    />

    <!-- Main Table -->
    <CustomerTypeRecordsTable
      v-if="!pending && !error"
      :customer-types="customerTypes"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Add / Edit Modal -->
    <CustomerTypeFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :type-data="activeTypeForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!typeToDelete"
      title="Delete Customer Type"
      :message="`Are you sure you want to delete customer type '${typeToDelete?.name}'?`"
      :busy="isBusy"
      @confirm="confirmDelete"
      @close="typeToDelete = null"
    />

    <!-- Print & PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Customer Types Report"
      :columns="printColumns"
      :items="customerTypes"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
