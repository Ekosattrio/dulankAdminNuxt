<script setup lang="ts">
import type { ProductProcessItem, ProductProcessFormData } from '#server/types/product-process'
import ProductProcessStatsWidgets from '~/components/pages/products-services/ProductProcessStatsWidgets.vue'
import ProductProcessRecordsTable from '~/components/pages/products-services/ProductProcessRecordsTable.vue'
import ProductProcessFormModal from '~/components/pages/products-services/ProductProcessFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Product Process List',
  sweetAlert: false
})

const { items, stats, pending, error, refresh, saveProcess, deleteProcess } = useProductProcesses()

const isFormModalOpen = ref(false)
const selectedItem = ref<ProductProcessItem | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() {
  selectedItem.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: ProductProcessItem) {
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
    await deleteProcess(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete product process:', err)
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: ProductProcessFormData) {
  isSaving.value = true
  try {
    await saveProcess(payload)
    isFormModalOpen.value = false
    selectedItem.value = null
  } catch (err) {
    console.error('Failed to save product process:', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-add-product-process space-y-6">
    <SalesListHeader
      title="Product Process List"
      subtitle="Petakan operasi manufaktur dan alur kerja spesifik ke produk katalog"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <!-- KPI Stats Widgets -->
    <ProductProcessStatsWidgets :stats="stats" />

    <!-- Feedback State -->
    <SalesFeedback
      v-if="pending && !items.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat product process list'"
      @retry="refresh"
    />

    <!-- Records Table -->
    <ProductProcessRecordsTable
      v-else
      :items="items"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <ProductProcessFormModal
      :open="isFormModalOpen"
      :item="selectedItem"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Product Process"
      message="Apakah Anda yakin ingin menghapus penetapan proses produk ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
