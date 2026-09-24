<script setup lang="ts">
import type { Customer, CustomerFormData } from '~/types/customer'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Customers',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { customers, pending, refresh, saveCustomer, deleteCustomer } = useCustomers()

const searchQuery = ref('')
const filterStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<Customer | null>(null)

const isViewOpen = ref(false)
const viewData = ref<Customer | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const filteredCustomers = computed(() => {
  return customers.value.filter((c) => {
    const matchesSearch =
      !searchQuery.value ||
      c.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.customerId?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.phone?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !filterStatus.value || c.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const handleAdd = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (c: Customer) => {
  isEdit.value = true
  editData.value = c
  isModalOpen.value = true
}

const handleView = (c: Customer) => {
  viewData.value = c
  isViewOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus data customer ini?')) {
    try {
      await deleteCustomer(id)
      showToast('Customer deleted successfully')
    } catch (err) {
      console.error('Failed to delete customer:', err)
      alert('Failed to delete customer')
    }
  }
}

const handleSubmit = async (formData: CustomerFormData) => {
  try {
    const res = await saveCustomer(formData)
    showToast(res?.message || 'Customer saved successfully')
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save customer:', err)
    alert('Failed to save customer')
  }
}

const printTable = () => {
  window.print()
}

const exportPdf = () => {
  showToast('Exporting Customers to PDF...')
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <div v-if="toastMessage" class="alert alert-success position-fixed top-0 end-0 m-4 shadow-lg z-3 d-flex align-items-center gap-2" role="alert">
        <FeatherIcon name="check-circle" size="18" />
        <div>{{ toastMessage }}</div>
      </div>

      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Customers / Pelanggan</h4>
          <h6 class="text-muted mb-0">Kelola informasi kontak, profil, dan riwayat pelanggan</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <ul class="table-top-head d-flex align-items-center list-unstyled gap-2 mb-0">
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Print" @click="printTable">
                <FeatherIcon name="printer" size="16" />
              </button>
            </li>
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
                <FeatherIcon name="rotate-cw" size="16" />
              </button>
            </li>
          </ul>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="handleAdd">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add New Customer</span>
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <PagesCustomerTable
        v-else
        :customers="filteredCustomers"
        :search-query="searchQuery"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:filter-status="filterStatus = $event"
        @add-customer="handleAdd"
        @edit-customer="handleEdit"
        @view-customer="handleView"
        @delete-customer="handleDelete"
        @export-pdf="exportPdf"
        @print-table="printTable"
        @refresh="refresh"
      />
    </div>

    <PagesCustomerModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />

    <PagesCustomerViewModal
      :is-open="isViewOpen"
      :customer-data="viewData"
      @close="isViewOpen = false"
    />
  </div>
</template>
