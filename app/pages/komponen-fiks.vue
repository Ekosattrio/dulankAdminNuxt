<script setup lang="ts">
import type { KomponenFiksItem, KomponenFiksFormData } from '#server/types/calculator-components'
import KomponenFiksRecordsTable from '~/components/Pages/Calculator/Components/KomponenFiksRecordsTable.vue'
import KomponenFiksFormModal from '~/components/Pages/Calculator/Components/KomponenFiksFormModal.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Fixed Components & Work Shift Capacities',
  sweetAlert: false
})

const { items, stats, pending, error, refresh, saveItem, deleteItem } = useKomponenFiks()

const isFormModalOpen = ref(false)
const selectedItem = ref<KomponenFiksItem | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

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
</script>

<template>
  <div class="dulank-page dulank-page-komponen-fiks space-y-6">
    <SalesListHeader
      title="Fixed Components & Work Shift Capacities"
      subtitle="Kelola variabel kapasitas produksi dasar dan durasi shift pengerjaan"
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
      :error="error.message || 'Gagal memuat komponen fiks'"
      @retry="refresh"
    />

    <!-- Records Table -->
    <KomponenFiksRecordsTable
      v-else
      :items="items"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <KomponenFiksFormModal
      :open="isFormModalOpen"
      :item="selectedItem"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Komponen Fiks"
      message="Apakah Anda yakin ingin menghapus data komponen fiks ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
