<script setup lang="ts">
import type { KomponenMinimumItem, KomponenMinimumFormData } from '#server/types/calculator-components'
import KomponenMinimumRecordsTable from '~/components/Pages/Calculator/Components/KomponenMinimumRecordsTable.vue'
import KomponenMinimumFormModal from '~/components/Pages/Calculator/Components/KomponenMinimumFormModal.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Minimum Charges & Finishing Base Rates',
  sweetAlert: false
})

const { items, stats, pending, error, refresh, saveItem, deleteItem } = useKomponenMinimum()

const isFormModalOpen = ref(false)
const selectedItem = ref<KomponenMinimumItem | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

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
</script>

<template>
  <div class="dulank-page dulank-page-komponen-minimum space-y-6">
    <SalesListHeader
      title="Minimum Charges & Finishing Base Rates"
      subtitle="Kelola threshold minimum biaya dan tarif dasar finishing pasca cetak"
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
      :error="error.message || 'Gagal memuat komponen minimum'"
      @retry="refresh"
    />

    <!-- Records Table -->
    <KomponenMinimumRecordsTable
      v-else
      :items="items"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <KomponenMinimumFormModal
      :open="isFormModalOpen"
      :item="selectedItem"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Komponen Minimum"
      message="Apakah Anda yakin ingin menghapus data komponen minimum ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
