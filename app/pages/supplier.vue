<script setup lang="ts">
import type { Supplier, SupplierFormData } from '~/types/supplier'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Suppliers - Pemasok Kertas & Bahan',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { suppliers, pending, refresh, saveSupplier, deleteSupplier } = useSuppliers()

const searchQuery = ref('')
const filterStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<Supplier | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const filteredList = computed(() => {
  return suppliers.value.filter((s) => {
    const matchesSearch =
      !searchQuery.value ||
      s.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.phone?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !filterStatus.value || s.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const handleAdd = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (s: Supplier) => {
  isEdit.value = true
  editData.value = s
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus data supplier ini?')) {
    try {
      await deleteSupplier(id)
      showToast('Supplier deleted successfully')
    } catch (err) {
      console.error('Failed to delete supplier:', err)
      alert('Failed to delete supplier')
    }
  }
}

const handleSubmit = async (formData: SupplierFormData) => {
  try {
    const res = await saveSupplier(formData)
    showToast(res?.message || 'Supplier saved successfully')
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save supplier:', err)
    alert('Failed to save supplier')
  }
}

const printTable = () => {
  window.print()
}

const exportPdf = () => {
  showToast('Exporting Suppliers to PDF...')
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
          <h4 class="fw-bold mb-1">Suppliers / Pemasok</h4>
          <h6 class="text-muted mb-0">Kelola database distributor bahan kertas, tinta, dan pelat cetak</h6>
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
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <PagesSupplierTable
        v-else
        :suppliers="filteredList"
        :search-query="searchQuery"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:filter-status="filterStatus = $event"
        @add-supplier="handleAdd"
        @edit-supplier="handleEdit"
        @delete-supplier="handleDelete"
        @export-pdf="exportPdf"
        @print-table="printTable"
        @refresh="refresh"
      />
    </div>

    <PagesSupplierModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />
  </div>
</template>
