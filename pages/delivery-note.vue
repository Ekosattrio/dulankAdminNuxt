<script setup lang="ts">
import type { DeliveryNote, DeliveryNoteFormData } from '~/types/delivery-note'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Delivery Notes',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { deliveryNotes, pending, refresh, saveDeliveryNote, deleteDeliveryNote } = useDeliveryNotes()

const searchQuery = ref('')
const filterStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<DeliveryNote | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const filteredList = computed(() => {
  return deliveryNotes.value.filter((d) => {
    const matchesSearch =
      !searchQuery.value ||
      d.deliveryNo?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      d.customer?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      d.jobOrderNo?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !filterStatus.value || d.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const handleAdd = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (d: DeliveryNote) => {
  isEdit.value = true
  editData.value = d
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus surat jalan ini?')) {
    try {
      await deleteDeliveryNote(id)
      showToast('Delivery note deleted successfully')
    } catch (err) {
      console.error('Failed to delete delivery note:', err)
      alert('Failed to delete delivery note')
    }
  }
}

const handleSubmit = async (formData: DeliveryNoteFormData) => {
  try {
    const res = await saveDeliveryNote(formData)
    showToast(res?.message || 'Delivery note saved successfully')
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save delivery note:', err)
    alert('Failed to save delivery note')
  }
}

const printTable = () => {
  window.print()
}

const exportPdf = () => {
  showToast('Exporting Delivery Notes to PDF...')
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
          <h4 class="fw-bold mb-1">Delivery Notes / Surat Jalan</h4>
          <h6 class="text-muted mb-0">Kelola pengiriman pesanan cetak dan bukti terima barang</h6>
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
            <span>Create Delivery Note</span>
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <PagesDeliveryNoteTable
        v-else
        :delivery-notes="filteredList"
        :search-query="searchQuery"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:filter-status="filterStatus = $event"
        @add-delivery-note="handleAdd"
        @edit-delivery-note="handleEdit"
        @delete-delivery-note="handleDelete"
        @export-pdf="exportPdf"
        @print-table="printTable"
        @refresh="refresh"
      />
    </div>

    <PagesDeliveryNoteModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />
  </div>
</template>
