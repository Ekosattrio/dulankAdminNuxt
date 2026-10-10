<script setup lang="ts">
import type { PaperSize, PaperSizeFormData } from '#server/types/paper-shop'
import PaperSizeStatsWidgets from '~/components/Pages/PaperShop/PaperSizeStatsWidgets.vue'
import PaperSizeRecordsTable from '~/components/Pages/PaperShop/PaperSizeRecordsTable.vue'
import PaperSizeFormModal from '~/components/Pages/PaperShop/PaperSizeFormModal.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Paper Sizes - Master Ukuran Kertas',
  sweetAlert: false
})

const { sizes, stats, pending, error, refresh, saveSize, deleteSize } = usePaperSizesSelf()

const isFormModalOpen = ref(false)
const selectedSize = ref<PaperSize | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() {
  selectedSize.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: PaperSize) {
  selectedSize.value = item
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
      title="Paper Sizes"
      subtitle="Master dimensi dan ukuran standar kertas cetak"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <!-- Stats Widgets -->
    <PaperSizeStatsWidgets :stats="stats" />

    <!-- Feedback State -->
    <SalesFeedback
      v-if="pending && !sizes.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat data paper size'"
      @retry="refresh"
    />

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
