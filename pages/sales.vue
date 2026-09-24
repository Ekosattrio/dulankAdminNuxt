<script setup lang="ts">
import type { Sale, SaleFormData } from '~/types/sale'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Sales - Transaksi Penjualan',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { sales, pending, refresh, saveSale, deleteSale } = useSales()

const searchQuery = ref('')
const filterStatus = ref('')
const filterChannel = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<Sale | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const filteredList = computed(() => {
  return sales.value.filter((s) => {
    const matchesSearch =
      !searchQuery.value ||
      s.saleNo?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.customer?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !filterStatus.value || s.status === filterStatus.value
    const matchesChannel = !filterChannel.value || s.channel === filterChannel.value
    return matchesSearch && matchesStatus && matchesChannel
  })
})

const handleAdd = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (s: Sale) => {
  isEdit.value = true
  editData.value = s
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus data transaksi penjualan ini?')) {
    try {
      await deleteSale(id)
      showToast('Sale deleted successfully')
    } catch (err) {
      console.error('Failed to delete sale:', err)
      alert('Failed to delete sale')
    }
  }
}

const handleSubmit = async (formData: SaleFormData) => {
  try {
    const res = await saveSale(formData)
    showToast(res?.message || 'Sale saved successfully')
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save sale:', err)
    alert('Failed to save sale')
  }
}

const printTable = () => {
  window.print()
}

const exportPdf = () => {
  showToast('Exporting Sales to PDF...')
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
          <h4 class="fw-bold mb-1">Sales Transactions / Penjualan</h4>
          <h6 class="text-muted mb-0">Kelola riwayat penjualan toko, web, dan pesanan cetak</h6>
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
            <span>Add Sales</span>
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <PagesSalesTable
        v-else
        :sales="filteredList"
        :search-query="searchQuery"
        :filter-status="filterStatus"
        :filter-channel="filterChannel"
        @update:search-query="searchQuery = $event"
        @update:filter-status="filterStatus = $event"
        @update:filter-channel="filterChannel = $event"
        @add-sale="handleAdd"
        @edit-sale="handleEdit"
        @delete-sale="handleDelete"
        @export-pdf="exportPdf"
        @print-table="printTable"
        @refresh="refresh"
      />
    </div>

    <PagesSalesModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />
  </div>
</template>
