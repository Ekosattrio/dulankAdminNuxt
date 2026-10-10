<script setup lang="ts">
import type { IncomeCategoryItem, IncomeCategoryFormData } from '#server/types/income-category'
import IncomeCategoryRecordsTable from '~/components/Pages/IncomeCategory/IncomeCategoryRecordsTable.vue'
import IncomeCategoryFormModal from '~/components/Pages/IncomeCategory/IncomeCategoryFormModal.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Income Category - Kategori Pemasukan',
  sweetAlert: false
})

const { items, stats, pending, error, refresh, saveCategory, deleteCategory } = useIncomeCategories()

const isFormModalOpen = ref(false)
const selectedItem = ref<IncomeCategoryItem | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() {
  selectedItem.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: IncomeCategoryItem) {
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
    await deleteCategory(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete income category:', err)
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: IncomeCategoryFormData) {
  isSaving.value = true
  try {
    await saveCategory(payload)
    isFormModalOpen.value = false
    selectedItem.value = null
  } catch (err) {
    console.error('Failed to save income category:', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-income-category space-y-6">
    <SalesListHeader
      title="Income Category"
      subtitle="Kelola dan atur kategori pos pemasukan keuangan"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <!-- Feedback State -->
    <SalesFeedback
      v-if="pending && !items.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat kategori pemasukan'"
      @retry="refresh"
    />

    <!-- Records Table -->
    <IncomeCategoryRecordsTable
      v-else
      :items="items"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <IncomeCategoryFormModal
      :open="isFormModalOpen"
      :item="selectedItem"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Kategori Pemasukan"
      message="Apakah Anda yakin ingin menghapus data kategori pemasukan ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
