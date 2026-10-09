<script setup lang="ts">
import type { KomponenFiksItem, KomponenFiksFormData } from '#server/types/calculator-components'
import KomponenFiksRecordsTable from '~/components/pages/calculator/components/KomponenFiksRecordsTable.vue'
import KomponenFiksFormModal from '~/components/pages/calculator/components/KomponenFiksFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default',
  alias: ['/komponen-fiks.html']
})

useLegacyPage({
  title: 'Komponen Cetak',
  sweetAlert: false
})

const { items, pending, error, refresh, saveItem, deleteItem } = useKomponenFiks()

const isFormModalOpen = ref(false)
const selectedItem = ref<KomponenFiksItem | null>(null)
const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

const print = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Nama' },
  { key: 'value', label: 'Qty' },
  { key: 'unit', label: 'Satuan' },
  { key: 'used', label: 'Used' },
  { key: 'update', label: 'Update' }
]

function openAddModal() {
  selectedItem.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: KomponenFiksItem) {
  selectedItem.value = item
  isFormModalOpen.value = true
}

function handleDelete(id: string) {
  deleteTargetId.value = id
  isDeleteModalOpen.value = true
}

async function confirmDelete() {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteItem(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete fixed component:', err)
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: KomponenFiksFormData) {
  isSaving.value = true
  try {
    await saveItem(payload)
    isFormModalOpen.value = false
    selectedItem.value = null
  } catch (err) {
    console.error('Failed to save fixed component:', err)
  } finally {
    isSaving.value = false
  }
}

function handlePrint(action: 'print' | 'pdf' = 'print') {
  print.openPrintModal({
    title: 'Komponen Cetak',
    subtitle: 'Daftar kapasitas variabel produksi dasar dan durasi shift pengerjaan',
    columns: printColumns,
    rows: items.value,
    action
  })
}
</script>

<template>
  <div class="dulank-page dulank-page-komponen-fiks space-y-6">
    <SalesListHeader
      title="Komponen Cetak"
      subtitle="Kelola variabel kapasitas produksi dasar dan durasi shift pengerjaan"
      add-label="Add Fixed Component"
      :refreshing="pending"
      :show-print="true"
      :show-pdf="true"
      @refresh="refresh"
      @add="openAddModal"
      @print="handlePrint('print')"
      @pdf="handlePrint('pdf')"
    />

    <SalesFeedback v-if="pending && !items.length" loading />
    <SalesFeedback v-else-if="error" :error="error.message || 'Gagal memuat komponen fiks'" @retry="refresh" />

    <KomponenFiksRecordsTable
      v-else
      :items="items"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <KomponenFiksFormModal
      :open="isFormModalOpen"
      :item="selectedItem"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Komponen Cetak"
      message="Apakah Anda yakin ingin menghapus data komponen fiks ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    />

    <DocumentPrintModal
      :open="print.isOpen.value"
      :config="print.config.value"
      @close="print.closePrintModal"
    />
  </div>
</template>
