import { ref } from 'vue'
import type { DownloadFileItem, DownloadFileFormData } from '#server/types/download-file'

export function useDownloadFilesActions(
  saveFile: (data: DownloadFileFormData) => Promise<{ success: boolean; message: string; data?: any }>,
  deleteFile: (id: string | number) => Promise<any>,
  toggleFavorite: (item: DownloadFileItem) => Promise<any>
) {
  const isBusy = ref(false)
  const toastMessage = ref('')

  const isUploadModalOpen = ref(false)
  const isCreateFolderModalOpen = ref(false)
  const isEditModalOpen = ref(false)
  const activeFileForEdit = ref<DownloadFileItem | null>(null)
  const fileToDelete = ref<DownloadFileItem | null>(null)

  function showToast(msg: string) {
    toastMessage.value = msg
    setTimeout(() => {
      toastMessage.value = ''
    }, 3500)
  }

  function handleOpenUpload() {
    isUploadModalOpen.value = true
  }

  function handleOpenCreateFolder() {
    isCreateFolderModalOpen.value = true
  }

  function handleEditFile(item: DownloadFileItem) {
    activeFileForEdit.value = item
    isEditModalOpen.value = true
  }

  function handleDeleteRequest(item: DownloadFileItem) {
    fileToDelete.value = item
  }

  async function handleUploadSubmit(formData: DownloadFileFormData) {
    isBusy.value = true
    try {
      const res = await saveFile(formData)
      isUploadModalOpen.value = false
      showToast(res?.message || 'File berhasil diunggah')
    } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Gagal mengunggah file')
    } finally {
      isBusy.value = false
    }
  }

  async function handleCreateFolderSubmit(folderName: string) {
    isBusy.value = true
    try {
      const res = await saveFile({
        name: folderName,
        category: 'Folders',
        fileType: 'folder',
        size: '0 KB',
        uploadedBy: 'Me',
        ownedBy: 'Me',
      })
      isCreateFolderModalOpen.value = false
      showToast(res?.message || `Folder '${folderName}' berhasil dibuat`)
    } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Gagal membuat folder')
    } finally {
      isBusy.value = false
    }
  }

  async function handleEditSubmit(formData: DownloadFileFormData) {
    isBusy.value = true
    try {
      const res = await saveFile(formData)
      isEditModalOpen.value = false
      showToast(res?.message || 'File berhasil diperbarui')
    } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Gagal memperbarui file')
    } finally {
      isBusy.value = false
    }
  }

  async function confirmDelete() {
    if (!fileToDelete.value) return
    isBusy.value = true
    try {
      await deleteFile(fileToDelete.value.id)
      showToast(`File '${fileToDelete.value.name}' berhasil dihapus`)
      fileToDelete.value = null
    } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Gagal menghapus file')
    } finally {
      isBusy.value = false
    }
  }

  async function handleToggleFavorite(item: DownloadFileItem) {
    try {
      await toggleFavorite(item)
      showToast(item.isFavorite ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit')
    } catch (err: any) {
      showToast('Gagal mengubah status favorit')
    }
  }

  function handleDownload(item: DownloadFileItem) {
    if (item.fileUrl) {
      window.open(item.fileUrl, '_blank')
    } else {
      showToast(`Mengunduh ${item.name}...`)
    }
  }

  return {
    isBusy,
    toastMessage,
    isUploadModalOpen,
    isCreateFolderModalOpen,
    isEditModalOpen,
    activeFileForEdit,
    fileToDelete,
    showToast,
    handleOpenUpload,
    handleOpenCreateFolder,
    handleEditFile,
    handleDeleteRequest,
    handleUploadSubmit,
    handleCreateFolderSubmit,
    handleEditSubmit,
    confirmDelete,
    handleToggleFavorite,
    handleDownload,
  }
}

