<script setup lang="ts">
import type { PaperGroup, PaperGroupFormData } from '#server/types/paper-shop'
import PaperGroupStatsWidgets from '~/components/pages/paper-shop/PaperGroupStatsWidgets.vue'
import PaperGroupRecordsTable from '~/components/pages/paper-shop/PaperGroupRecordsTable.vue'
import PaperGroupFormModal from '~/components/pages/paper-shop/PaperGroupFormModal.vue'
import PaperGroupViewModal from '~/components/pages/paper-shop/PaperGroupViewModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

const { groups, stats, pending, error, refresh, saveGroup, deleteGroup } = usePaperGroupsSelf()

const isFormModalOpen = ref(false)
const isViewModalOpen = ref(false)
const selectedGroup = ref<PaperGroup | null>(null)
const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() { selectedGroup.value = null; isFormModalOpen.value = true }
function handleView(item: PaperGroup) { selectedGroup.value = item; isViewModalOpen.value = true }
function handleEdit(item: PaperGroup) { selectedGroup.value = item; isFormModalOpen.value = true }
function handleDelete(id: string) { deleteTargetId.value = id; isDeleteModalOpen.value = true }

async function confirmDelete() {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteGroup(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  } finally {
    isDeleting.value = false
  }
}

async function handleSave(payload: PaperGroupFormData) {
  isSaving.value = true
  try {
    await saveGroup(payload)
    isFormModalOpen.value = false
    selectedGroup.value = null
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-kertas-group space-y-6">
    <SalesListHeader
      title="Master Grup Kertas (Internal)"
      subtitle="Kelola klasifikasi dan grup kategori kertas percetakan"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <PaperGroupStatsWidgets :stats="stats" />

    <SalesFeedback
      v-if="pending || error"
      :loading="pending"
      :error="error ? (error.message || 'Gagal memuat grup kertas') : undefined"
      @retry="refresh"
    />

    <PaperGroupRecordsTable
      v-else
      :groups="groups"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <PaperGroupFormModal :open="isFormModalOpen" :group="selectedGroup" :busy="isSaving" @close="isFormModalOpen = false" @save="handleSave" />
    <PaperGroupViewModal :open="isViewModalOpen" :group="selectedGroup" @close="isViewModalOpen = false" @edit="handleEdit" />
    <SalesConfirmDelete :open="isDeleteModalOpen" title="Hapus Grup Kertas" message="Apakah Anda yakin ingin menghapus grup kertas ini?" :busy="isDeleting" @confirm="confirmDelete" @close="isDeleteModalOpen = false" />
  </div>
</template>
