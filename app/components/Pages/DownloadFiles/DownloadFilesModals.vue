<script setup lang="ts">
import type { DownloadFileItem, DownloadFileFormData } from '#server/types/download-file'
import UploadFileModal from '~/components/Pages/DownloadFiles/UploadFileModal.vue'
import CreateFolderModal from '~/components/Pages/DownloadFiles/CreateFolderModal.vue'
import DownloadFileFormModal from '~/components/Pages/DownloadFiles/DownloadFileFormModal.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'

defineProps<{
  isUploadModalOpen: boolean
  isCreateFolderModalOpen: boolean
  isEditModalOpen: boolean
  fileToDelete: DownloadFileItem | null
  activeFileForEdit: DownloadFileItem | null
  isBusy: boolean
  isPrintModalOpen: boolean
  printColumns: { key: string; label: string; align?: 'left' | 'center' | 'right' }[]
  tableFiles: DownloadFileItem[]
  currentPageFiles: DownloadFileItem[]
  defaultPrintAction?: 'print' | 'pdf'
}>()

const emit = defineEmits<{
  'closeUpload': []
  'closeCreateFolder': []
  'closeEdit': []
  'closeDelete': []
  'closePrint': []
  'submitUpload': [formData: DownloadFileFormData]
  'submitCreateFolder': [folderName: string]
  'submitEdit': [formData: DownloadFileFormData]
  'confirmDelete': []
}>()
</script>

<template>
  <div>
    <!-- Upload Modal -->
    <UploadFileModal
      :open="isUploadModalOpen"
      :busy="isBusy"
      @close="emit('closeUpload')"
      @submit="emit('submitUpload', $event)"
    />

    <!-- Create Folder Modal -->
    <CreateFolderModal
      :open="isCreateFolderModalOpen"
      :busy="isBusy"
      @close="emit('closeCreateFolder')"
      @submit="emit('submitCreateFolder', $event)"
    />

    <!-- Edit File Modal -->
    <DownloadFileFormModal
      :open="isEditModalOpen"
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
      message="Apakah Anda yakin ingin menghapus file ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isBusy"
      @confirm="emit('confirmDelete')"
      @close="emit('closeDelete')"
    />

    <!-- Document Print Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Download Files Report"
      subtitle="Managed files, ownership, size, and download activity"
      :columns="printColumns"
      :items="tableFiles"
      :current-page-items="currentPageFiles"
      date-field="uploadedDate"
      :default-action="defaultPrintAction"
      @close="emit('closePrint')"
    />
  </div>
</template>

