<script setup lang="ts">
import type { PaperSize, PaperSizeFormData } from '#server/types/paper-shop'
import PaperSizeStatsWidgets from '~/components/pages/paper-shop/PaperSizeStatsWidgets.vue'
import PaperSizeRecordsTable from '~/components/pages/paper-shop/PaperSizeRecordsTable.vue'
import PaperSizeFormModal from '~/components/pages/paper-shop/PaperSizeFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default',
  alias: ['/kertas-ukuran-self.html']
})

useLegacyPage({
  title: "Paper's Size",
  sweetAlert: false
})

const { sizes, stats, pending, error, refresh, saveSize, deleteSize } = usePaperSizesSelf()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'name', label: 'Size Name' },
  { key: 'dimension', label: 'Size' },
  { key: 'unit', label: 'Unit', align: 'center' as const },
  { key: 'update', label: 'Update' },
  { key: 'status', label: 'Status', align: 'center' as const }
]

const isFormModalOpen = ref(false)
const selectedSize = ref<PaperSize | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() { selectedSize.value = null; isFormModalOpen.value = true }
function handleEdit(item: PaperSize) { selectedSize.value = item; isFormModalOpen.value = true }
function handleDelete(id: string) { deleteTargetId.value = id; isDeleteModalOpen.value = true }

async function confirmDelete() {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteSize(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete paper size:', err)
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: PaperSizeFormData) {
  isSaving.value = true
  try {
    await saveSize(payload)
    isFormModalOpen.value = false
    selectedSize.value = null
  } catch (err) {
    console.error('Failed to save paper size:', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-kertas-ukuran-self space-y-6">
    <SalesListHeader
      title="Paper's Size"
      subtitle="Manage Your Paper's Size"
      add-label="Add New Paper's Size"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- Stats Widgets -->
    <PaperSizeStatsWidgets :stats="stats" />

    <!-- Feedback State -->
    <SalesFeedback v-if="pending && !sizes.length" loading />
    <SalesFeedback v-else-if="error" :error="error.message || 'Gagal memuat data paper size'" @retry="refresh" />

    <!-- Records Table -->
    <PaperSizeRecordsTable
      v-else
      :sizes="sizes"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <PaperSizeFormModal
      :open="isFormModalOpen"
      :size="selectedSize"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- Print Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Paper's Size"
      :columns="printColumns"
      :data="sizes"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Paper Size"
      message="Apakah Anda yakin ingin menghapus data ukuran kertas ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @confirm="confirmDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
