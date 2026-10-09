<script setup lang="ts">
import type { KomponenMinimumItem, KomponenMinimumFormData } from '#server/types/calculator-components'
import KomponenMinimumRecordsTable from '~/components/pages/calculator/components/KomponenMinimumRecordsTable.vue'
import KomponenMinimumFormModal from '~/components/pages/calculator/components/KomponenMinimumFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default',
  alias: ['/komponen-minimum.html']
})

useLegacyPage({
  title: 'Harga Jasa Lainnya',
  sweetAlert: false
})

const { items, pending, error, refresh, saveItem, deleteItem } = useKomponenMinimum()

const isFormModalOpen = ref(false)
const selectedItem = ref<KomponenMinimumItem | null>(null)
const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

const print = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Nama Jasa' },
  { key: 'rate', label: 'Harga' },
  { key: 'minim', label: 'Minim Harga' },
  { key: 'unit', label: 'Satuan' },
  { key: 'used', label: 'Used' },
  { key: 'update', label: 'Update' }
]

function openAddModal() {
  selectedItem.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: KomponenMinimumItem) {
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
    console.error('Failed to delete minimum component:', err)
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: KomponenMinimumFormData) {
  isSaving.value = true
  try {
    await saveItem(payload)
    isFormModalOpen.value = false
    selectedItem.value = null
  } catch (err) {
    console.error('Failed to save minimum component:', err)
  } finally {
    isSaving.value = false
  }
}

function handlePrint(action: 'print' | 'pdf' = 'print') {
  print.openPrintModal({
    title: 'Harga Jasa Lainnya',
    subtitle: 'Daftar threshold minimum biaya dan tarif dasar finishing',
    columns: printColumns,
    rows: items.value,
    action
  })
}
</script>

<template>
  <div class="dulank-page dulank-page-komponen-minimum space-y-6">
    <SalesListHeader
      title="Harga Jasa Lainnya"
      subtitle="Kelola threshold minimum biaya dan tarif dasar finishing pasca cetak"
      add-label="Add Minimum Component"
      :refreshing="pending"
      :show-print="true"
      :show-pdf="true"
      @refresh="refresh"
      @add="openAddModal"
      @print="handlePrint('print')"
      @pdf="handlePrint('pdf')"
    />

    <SalesFeedback v-if="pending && !items.length" loading />
    <SalesFeedback v-else-if="error" :error="error.message || 'Gagal memuat komponen minimum'" @retry="refresh" />

    <KomponenMinimumRecordsTable
      v-else
      :items="items"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <KomponenMinimumFormModal
      :open="isFormModalOpen"
      :item="selectedItem"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Komponen Minimum"
      message="Apakah Anda yakin ingin menghapus data komponen minimum ini? Tindakan ini tidak dapat dibatalkan."
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
