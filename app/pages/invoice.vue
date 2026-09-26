<script setup lang="ts">
import type { Invoice, InvoiceFormData } from '~/types/invoice'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Invoices - Faktur Tagihan',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { invoices, pending, refresh, saveInvoice, deleteInvoice } = useInvoices()

const searchQuery = ref('')
const filterStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<Invoice | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const filteredList = computed(() => {
  return invoices.value.filter((inv) => {
    const matchesSearch =
      !searchQuery.value ||
      inv.invoiceNo?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inv.customer?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !filterStatus.value || inv.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const handleAdd = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (inv: Invoice) => {
  isEdit.value = true
  editData.value = inv
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus tagihan invoice ini?')) {
    try {
      await deleteInvoice(id)
      showToast('Invoice deleted successfully')
    } catch (err) {
      console.error('Failed to delete invoice:', err)
      alert('Failed to delete invoice')
    }
  }
}

const handleSubmit = async (formData: InvoiceFormData) => {
  try {
    const res = await saveInvoice(formData)
    showToast(res?.message || 'Invoice saved successfully')
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save invoice:', err)
    alert('Failed to save invoice')
  }
}

const printTable = () => {
  window.print()
}

const exportPdf = () => {
  showToast('Exporting Invoices to PDF...')
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
          <h4 class="fw-bold mb-1">Invoices / Faktur Tagihan</h4>
          <h6 class="text-muted mb-0">Kelola penagihan pembayaran dan status lunas invoice pelanggan</h6>
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
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <PagesInvoiceTable
        v-else
        :invoices="filteredList"
        :search-query="searchQuery"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:filter-status="filterStatus = $event"
        @add-invoice="handleAdd"
        @edit-invoice="handleEdit"
        @delete-invoice="handleDelete"
        @export-pdf="exportPdf"
        @print-table="printTable"
        @refresh="refresh"
      />
    </div>

    <PagesInvoiceModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />
  </div>
</template>
