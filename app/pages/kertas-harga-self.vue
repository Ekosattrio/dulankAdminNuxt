<script setup lang="ts">
import type { PaperPrice, PaperPriceFormData } from '#server/types/paper-shop'
import PaperPriceStatsWidgets from '~/components/pages/paper-shop/PaperPriceStatsWidgets.vue'
import PaperPriceRecordsTable from '~/components/pages/paper-shop/PaperPriceRecordsTable.vue'
import PaperPriceFormModal from '~/components/pages/paper-shop/PaperPriceFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Paper Prices - Master Harga Kertas',
  sweetAlert: false
})

const { prices, stats, pending, error, refresh, savePrice, deletePrice } = usePaperPricesSelf()
const { groups } = usePaperGroupsSelf()

const isFormModalOpen = ref(false)
const selectedPrice = ref<PaperPrice | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() {
  selectedPrice.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: PaperPrice) {
  selectedPrice.value = item
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
    await deletePrice(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete paper price:', err)
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: PaperPriceFormData) {
  isSaving.value = true
  try {
    await savePrice(payload)
    isFormModalOpen.value = false
    selectedPrice.value = null
  } catch (err) {
    console.error('Failed to save paper price:', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-kertas-harga-self space-y-6">
    <SalesListHeader
      title="Paper Prices"
      subtitle="Master daftar harga kertas berdasarkan grup, merk, ukuran dan satuan"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <!-- Stats Widgets -->
    <PaperPriceStatsWidgets :stats="stats" />

    <!-- Feedback State -->
    <SalesFeedback
      v-if="pending && !prices.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat data harga kertas'"
      @retry="refresh"
    />

    <!-- Records Table -->
    <PaperPriceRecordsTable
      v-else
      :prices="prices"
      :groups="groups"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <PaperPriceFormModal
      :open="isFormModalOpen"
      :price="selectedPrice"
      :groups="groups"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Harga Kertas"
      message="Apakah Anda yakin ingin menghapus data harga kertas ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @confirm="confirmDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
