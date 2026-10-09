<script setup lang="ts">
import type { DownloadFileItem, DownloadFileFormData } from '#server/types/download-file'
import UploadFileModal from '~/components/pages/download-files/UploadFileModal.vue'
import CreateFolderModal from '~/components/pages/download-files/CreateFolderModal.vue'
import DownloadFileFormModal from '~/components/pages/download-files/DownloadFileFormModal.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'

defineProps<{
  isUploadOpen: boolean
  isCreateFolderOpen: boolean
  isEditOpen: boolean
  activeFileForEdit: DownloadFileItem | null
  fileToDelete: DownloadFileItem | null
  isBusy: boolean
}>()

const emit = defineEmits<{
  (e: 'closeUpload'): void
  (e: 'closeCreateFolder'): void
  (e: 'closeEdit'): void
  (e: 'closeDelete'): void
  (e: 'submitUpload', data: DownloadFileFormData): void
  (e: 'submitCreateFolder', folderName: string): void
  (e: 'submitEdit', data: DownloadFileFormData): void
  (e: 'confirmDelete'): void
}>()
</script>

<template>
  <div>
    <!-- Upload Modal -->
    <UploadFileModal
      :open="isUploadOpen"
      :busy="isBusy"
      @close="emit('closeUpload')"
      @submit="emit('submitUpload', $event)"
    />

    <!-- Create Folder Modal -->
    <CreateFolderModal
      :open="isCreateFolderOpen"
      :busy="isBusy"
      @close="emit('closeCreateFolder')"
      @submit="emit('submitCreateFolder', $event)"
    />

    <!-- Edit Modal -->
    <DownloadFileFormModal
      :open="isEditOpen"
      :is-edit="true"
      :file-data="activeFileForEdit"
      :busy="isBusy"
      @close="emit('closeEdit')"
      @submit="emit('submitEdit', $event)"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="!!fileToDelete"
      :title="fileToDelete?.name ? `Hapus File '${fileToDelete.name}'?` : 'Hapus File?'"
      :message="`Apakah Anda yakin ingin menghapus file ini? Tindakan ini tidak dapat dibatalkan.`"
      :busy="isBusy"
      @confirm="emit('confirmDelete')"
      @close="emit('closeDelete')"
    />
  </div>
</template>

