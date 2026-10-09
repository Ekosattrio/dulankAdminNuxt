<script setup lang="ts">
import type { PaperItem, PaperItemFormData } from '#server/types/paper-shop'
import PaperListStatsWidgets from '~/components/pages/paper-shop/PaperListStatsWidgets.vue'
import PaperListRecordsTable from '~/components/pages/paper-shop/PaperListRecordsTable.vue'
import PaperListFormModal from '~/components/pages/paper-shop/PaperListFormModal.vue'
import PaperListViewModal from '~/components/pages/paper-shop/PaperListViewModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

const { items, stats, pending, error, refresh, saveItem, deleteItem } = usePaperItemsSelf()
const { groups } = usePaperGroupsSelf()
const { sizes } = usePaperSizesSelf()

const isFormModalOpen = ref(false)
const isViewModalOpen = ref(false)
const selectedItem = ref<PaperItem | null>(null)
const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() { selectedItem.value = null; isFormModalOpen.value = true }
function handleView(item: PaperItem) { selectedItem.value = item; isViewModalOpen.value = true }
function handleEdit(item: PaperItem) { selectedItem.value = item; isFormModalOpen.value = true }
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

async function handleSave(payload: PaperItemFormData) {
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
  <div class="dulank-page dulank-page-kertas-jenis space-y-6">
    <SalesListHeader
      title="Daftar Jenis Kertas (Internal)"
      subtitle="Kelola stok, gramatur, dan spesifikasi katalog kertas internal"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <PaperListStatsWidgets :stats="stats" />

    <SalesFeedback
      v-if="pending || error"
      :loading="pending"
      :error="error ? (error.message || 'Gagal memuat daftar kertas') : undefined"
      @retry="refresh"
    />

    <PaperListRecordsTable
      v-else
      :items="items"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <PaperListFormModal :open="isFormModalOpen" :item="selectedItem" :groups="groups" :sizes="sizes" :busy="isSaving" @close="isFormModalOpen = false" @save="handleSave" />
    <PaperListViewModal :open="isViewModalOpen" :item="selectedItem" @close="isViewModalOpen = false" @edit="handleEdit" />
    <SalesConfirmDelete :open="isDeleteModalOpen" title="Hapus Jenis Kertas" message="Apakah Anda yakin ingin menghapus data kertas ini?" :busy="isDeleting" @confirm="confirmDelete" @close="isDeleteModalOpen = false" />
  </div>
</template>
