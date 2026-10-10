<script setup lang="ts">
import type { JasaLainItem, JasaLainFormData } from '#server/types/calculator-components'
import JasaLainRecordsTable from '~/components/Pages/Calculator/Components/JasaLainRecordsTable.vue'
import JasaLainFormModal from '~/components/Pages/Calculator/Components/JasaLainFormModal.vue'
import JasaLainViewModal from '~/components/Pages/Calculator/Components/JasaLainViewModal.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Komponen Cetak & Jasa Lainnya',
  sweetAlert: false
})

const { items, stats, pending, error, refresh, saveItem, deleteItem } = useJasaLain()

const isFormModalOpen = ref(false)
const isViewModalOpen = ref(false)
const selectedItem = ref<JasaLainItem | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() {
  selectedItem.value = null
  isFormModalOpen.value = true
}

function handleView(item: JasaLainItem) {
  selectedItem.value = item
  isViewModalOpen.value = true
}

function handleEdit(item: JasaLainItem) {
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
    console.error('Failed to delete service component:', err)
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: JasaLainFormData) {
  isSaving.value = true
  try {
    await saveItem(payload)
    isFormModalOpen.value = false
    selectedItem.value = null
  } catch (err) {
    console.error('Failed to save service component:', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-harga-jasa-lainya space-y-6">
    <SalesListHeader
      title="Komponen Cetak & Jasa Lainnya"
      subtitle="Kelola tarif komponen cetak dan jasa finishing kalkulator"
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
      :error="error.message || 'Gagal memuat komponen cetak & jasa lainnya'"
      @retry="refresh"
    />

    <!-- Records Table -->
    <JasaLainRecordsTable
      v-else
      :items="items"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <JasaLainFormModal
      :open="isFormModalOpen"
      :item="selectedItem"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- View Detail Modal -->
    <JasaLainViewModal
      :open="isViewModalOpen"
      :item="selectedItem"
      @close="isViewModalOpen = false"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Komponen Jasa"
      message="Apakah Anda yakin ingin menghapus data komponen jasa cetak ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
