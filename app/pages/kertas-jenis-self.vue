<script setup lang="ts">
import type { PaperItem, PaperItemFormData } from '#server/types/paper-shop'
import PaperListStatsWidgets from '~/components/pages/paper-shop/PaperListStatsWidgets.vue'
import PaperListRecordsTable from '~/components/pages/paper-shop/PaperListRecordsTable.vue'
import PaperListFormModal from '~/components/pages/paper-shop/PaperListFormModal.vue'
import PaperListViewModal from '~/components/pages/paper-shop/PaperListViewModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default',
  alias: ['/kertas-jenis-self.html']
})

useLegacyPage({
  title: 'Jenis Kertas List',
  sweetAlert: false
})

const { items, stats, pending, error, refresh, saveItem, deleteItem } = usePaperItemsSelf()
const { groups } = usePaperGroupsSelf()
const { sizes } = usePaperSizesSelf()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'name', label: 'Paper Name' },
  { key: 'merk', label: 'Merk' },
  { key: 'price', label: 'Price', align: 'right' as const },
  { key: 'priceType', label: 'Price Type', align: 'center' as const },
  { key: 'unitPrice', label: 'Unit', align: 'center' as const },
  { key: 'gsm', label: 'GSM', align: 'center' as const },
  { key: 'paperSize', label: 'Paper Size' },
  { key: 'stock', label: 'Stock', align: 'right' as const },
  { key: 'unitStock', label: 'Unit Stock', align: 'center' as const },
  { key: 'status', label: 'Status', align: 'center' as const }
]

const isFormModalOpen = ref(false)
const isViewModalOpen = ref(false)
const selectedItem = ref<PaperItem | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() { selectedItem.value = null; isFormModalOpen.value = true }
function handleView(item: PaperItem) { selectedItem.value = item; isViewModalOpen.value = true }
function handleEdit(item: PaperItem) { selectedItem.value = item; isFormModalOpen.value = true }
function handleDelete(id: string) { deleteTargetId.value = id; isDeleteModalOpen.value = true }

async function confirmDelete() {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteItem(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete paper item:', err)
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: PaperItemFormData) {
  isSaving.value = true
  try {
    await saveItem(payload)
    isFormModalOpen.value = false
    selectedItem.value = null
  } catch (err) {
    console.error('Failed to save paper item:', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-kertas-jenis-self space-y-6">
    <SalesListHeader
      title="Jenis Kertas List"
      subtitle="Manage your Jenis Kertas"
      add-label="Add New Jenis Kertas"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- Stats Widgets -->
    <PaperListStatsWidgets :stats="stats" />

    <!-- Feedback State -->
    <SalesFeedback v-if="pending && !items.length" loading />
    <SalesFeedback v-else-if="error" :error="error.message || 'Gagal memuat data item kertas'" @retry="refresh" />

    <!-- Records Table -->
    <PaperListRecordsTable
      v-else
      :items="items"
      :groups="groups"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <PaperListFormModal
      :open="isFormModalOpen"
      :item="selectedItem"
      :groups="groups"
      :sizes="sizes"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- View Detail Modal -->
    <PaperListViewModal :open="isViewModalOpen" :item="selectedItem" @close="isViewModalOpen = false" />

    <!-- Print Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Jenis Kertas List"
      :columns="printColumns"
      :data="items"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Item Kertas"
      message="Apakah Anda yakin ingin menghapus data varian kertas ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @confirm="confirmDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
