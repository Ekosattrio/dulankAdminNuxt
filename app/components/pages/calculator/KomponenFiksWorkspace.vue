<script setup lang="ts">
import type { KomponenFiksItem, KomponenFiksFormData } from '#server/types/calculator-components'
import KomponenFiksRecordsTable from '~/components/pages/calculator/components/KomponenFiksRecordsTable.vue'
import KomponenFiksFormModal from '~/components/pages/calculator/components/KomponenFiksFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

const { items, pending, error, refresh, saveItem, deleteItem } = useKomponenFiks()

const isFormModalOpen = ref(false)
const selectedItem = ref<KomponenFiksItem | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() { selectedItem.value = null; isFormModalOpen.value = true }
function handleEdit(item: KomponenFiksItem) { selectedItem.value = item; isFormModalOpen.value = true }
function handleDelete(id: string) { deleteTargetId.value = id; isDeleteModalOpen.value = true }

async function confirmDelete() {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteItem(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
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
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-komponen-fiks space-y-6">
    <SalesListHeader
      title="Fixed Components & Work Shift Capacities"
      subtitle="Kelola parameter komponen biaya fiks dan limit kapasitas cetak"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <SalesFeedback
      v-if="pending || error"
      :loading="pending"
      :error="error ? (error.message || 'Gagal memuat komponen fiks') : undefined"
      @retry="refresh"
    />

    <KomponenFiksRecordsTable
      v-else
      :items="items"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <KomponenFiksFormModal
      :open="isFormModalOpen"
      :item="selectedItem"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @save="handleSave"
    />

    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Komponen Fiks"
      message="Apakah Anda yakin ingin menghapus komponen fiks ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @confirm="confirmDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
