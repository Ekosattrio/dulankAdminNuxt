<script setup lang="ts">
import type { Variant, VariantFormData } from '~/types/variant'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import VariantModal from '~/components/Variant/VariantModal.vue'
import VariantTable from '~/components/Variant/VariantTable.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Variants - Varian Produk',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { variants, pending, refresh, saveVariant, deleteVariant } = useVariants()

const searchQuery = ref('')
const filterStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<Variant | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const filteredList = computed(() => {
  return variants.value.filter((v) => {
    const matchesSearch =
      !searchQuery.value ||
      v.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      v.values?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !filterStatus.value || v.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const print = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Variant' },
  { key: 'values', label: 'Variant Values' },
  { key: 'itemUsed', label: 'Item Used', align: 'right' as const },
  { key: 'createdOn', label: 'Created On' },
  { key: 'status', label: 'Status' }
]

const handleAdd = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'

const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

const handleEdit = (v: Variant) => {
  isEdit.value = true
  editData.value = v
  isModalOpen.value = true
}

const handleDelete = (id: string) => {
  deleteTargetId.value = id
  isDeleteConfirmOpen.value = true
}

const confirmDelete = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteVariant(deleteTargetId.value)
    showToast('Variant deleted successfully')
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
  } catch (err: any) {
    console.error('Failed to delete variant:', err)
    showToast(err?.message || 'Failed to delete variant')
  } finally {
    isDeleting.value = false
  }
}

const handleSubmit = async (formData: VariantFormData) => {
  try {
    const res = await saveVariant(formData)
    showToast(res?.message || 'Variant saved successfully')
    isModalOpen.value = false
  } catch (err: any) {
    console.error('Failed to save variant:', err)
    showToast(err?.message || 'Failed to save variant')
  }
}

const printTable = () => {
  print.openPrintModal({
    title: 'Product Variant',
    subtitle: 'Daftar varian produk dan nilai pilihannya',
    columns: printColumns,
    rows: filteredList.value,
    action: 'print'
  })
}

const exportPdf = () => {
  print.openPrintModal({
    title: 'Product Variant',
    subtitle: 'Daftar varian produk dan nilai pilihannya',
    columns: printColumns,
    rows: filteredList.value,
    action: 'pdf'
  })
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <SalesListHeader title="Variant Attributes / Varian" subtitle="Kelola atribut opsi warna, ukuran, dan gramatur produk" add-label="Add Variant" :refreshing="pending" @add="handleAdd" @refresh="refresh()" @print="printTable" @pdf="exportPdf" />
      <SalesFeedback :pending="pending" :message="toastMessage" skeleton="table" :skeleton-cols="6" @dismiss="toastMessage = ''" />

      <VariantTable
        v-if="!pending"
        :variants="filteredList"
        :search-query="searchQuery"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:filter-status="filterStatus = $event"
        @add-variant="handleAdd"
        @edit-variant="handleEdit"
        @delete-variant="handleDelete"
        @export-pdf="exportPdf"
        @print-table="printTable"
        @refresh="refresh"
      />
    </div>

    <VariantModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Hapus Varian"
      message="Apakah Anda yakin ingin menghapus data varian ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />

    <DocumentPrintModal
      :open="print.isPrintModalOpen.value"
      :title="print.printTitle.value"
      :subtitle="print.printSubtitle.value"
      :columns="print.printColumns.value"
      :rows="print.printRows.value"
      :default-action="print.defaultPrintAction.value"
      :show-date-range="false"
      @close="print.closePrintModal"
    />
  </div>
</template>
