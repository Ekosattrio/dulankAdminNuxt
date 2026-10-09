<script setup lang="ts">
import type { PaperGroup, PaperGroupFormData } from '#server/types/paper-shop'
import PaperGroupStatsWidgets from '~/components/pages/paper-shop/PaperGroupStatsWidgets.vue'
import PaperGroupRecordsTable from '~/components/pages/paper-shop/PaperGroupRecordsTable.vue'
import PaperGroupFormModal from '~/components/pages/paper-shop/PaperGroupFormModal.vue'
import PaperGroupViewModal from '~/components/pages/paper-shop/PaperGroupViewModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Internal Paper Groups - Master Grup Kertas',
  sweetAlert: false
})

const { groups, stats, pending, error, refresh, saveGroup, deleteGroup } = usePaperGroupsSelf()

const isFormModalOpen = ref(false)
const isViewModalOpen = ref(false)
const selectedGroup = ref<PaperGroup | null>(null)

const isDeleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

function openAddModal() {
  selectedGroup.value = null
  isFormModalOpen.value = true
}

function handleView(item: PaperGroup) {
  selectedGroup.value = item
  isViewModalOpen.value = true
}

function handleEdit(item: PaperGroup) {
  selectedGroup.value = item
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
    await deleteGroup(deleteTargetId.value)
    isDeleteModalOpen.value = false
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete paper group:', err)
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
  } catch (err) {
    console.error('Failed to save paper group:', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-kertas-group-self space-y-6">
    <SalesListHeader
      title="Internal Paper Groups"
      subtitle="Master data grup dan merk kertas untuk kalkulator & produksi"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <!-- Stats Widgets -->
    <PaperGroupStatsWidgets :stats="stats" />

    <!-- Feedback State -->
    <SalesFeedback
      v-if="pending && !groups.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat data paper group'"
      @retry="refresh"
    />

    <!-- Records Table -->
    <PaperGroupRecordsTable
      v-else
      :groups="groups"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add / Edit Modal -->
    <PaperGroupFormModal
      :open="isFormModalOpen"
      :group="selectedGroup"
      :busy="isSaving"
      @close="isFormModalOpen = false"
      @submit="handleSave"
    />

    <!-- View Detail Modal -->
    <PaperGroupViewModal
      :open="isViewModalOpen"
      :group="selectedGroup"
      @close="isViewModalOpen = false"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Paper Group"
      message="Apakah Anda yakin ingin menghapus data paper group ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @confirm="confirmDelete"
      @close="isDeleteModalOpen = false"
    />
  </div>
</template>
