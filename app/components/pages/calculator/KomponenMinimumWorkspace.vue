<script setup lang="ts">
import type { KomponenMinimumItem, KomponenMinimumFormData } from '#server/types/calculator-components'
import KomponenMinimumRecordsTable from '~/components/pages/calculator/components/KomponenMinimumRecordsTable.vue'
import KomponenMinimumFormModal from '~/components/pages/calculator/components/KomponenMinimumFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

const { items, pending, error, refresh, saveItem, deleteItem } = useKomponenMinimum()

const isFormModalOpen = ref(false)
const selectedItem = ref<KomponenMinimumItem | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() { selectedItem.value = null; isFormModalOpen.value = true }
function handleEdit(item: KomponenMinimumItem) { selectedItem.value = item; isFormModalOpen.value = true }
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

async function handleSave(payload: KomponenMinimumFormData) {
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
  <div class="dulank-page dulank-page-komponen-minimum space-y-6">
    <SalesListHeader
      title="Minimum Charges & Finishing Base Rates"
      subtitle="Kelola biaya minimum pengerjaan finishing dan ongkos dasar cetak"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <SalesFeedback
      v-if="pending || error"
      :loading="pending"
      :error="error ? (error.message || 'Gagal memuat komponen minimum') : undefined"
      @retry="refresh"
    />

    <KomponenMinimumRecordsTable
      v-else
      :items="items"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <KomponenMinimumFormModal
      :open="isFormModalOpen"
      :item="selectedItem"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @save="handleSave"
    />

    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Biaya Minimum"
      message="Apakah Anda yakin ingin menghapus tarif minimum ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @confirm="confirmDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
