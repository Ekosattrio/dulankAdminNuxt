<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DownloadFileItem, DownloadFileFormData } from '#server/types/download-file'
import { useDownloadFiles } from '~/composables/useDownloadFiles'
import { useTablePrint } from '~/composables/useTablePrint'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import DownloadFileSidebar from '~/components/pages/download-files/DownloadFileSidebar.vue'
import DownloadFileCardGrid from '~/components/pages/download-files/DownloadFileCardGrid.vue'
import DownloadFileTable from '~/components/pages/download-files/DownloadFileTable.vue'
import UploadFileModal from '~/components/pages/download-files/UploadFileModal.vue'
import CreateFolderModal from '~/components/pages/download-files/CreateFolderModal.vue'
import DownloadFileFormModal from '~/components/pages/download-files/DownloadFileFormModal.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const { files, pending, error, refresh, saveFile, deleteFile, toggleFavorite } = useDownloadFiles()

// Controls & Filters
const ownedFilter = ref('Owned By Me')
const sortBy = ref('Sort by Date')
const recentFilter = ref('Recent')
const fileTypeFilter = ref('All File types')
const searchQuery = ref('')
const isSidebarOpen = ref(true)
const isBusy = ref(false)
const toastMessage = ref('')
const currentPageFiles = ref<DownloadFileItem[]>([])

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Name' },
  { key: 'lastModified', label: 'Last Modified', align: 'center' as const },
  { key: 'size', label: 'Size', align: 'right' as const },
  { key: 'ownedBy', label: 'Owned Member' },
  { key: 'category', label: 'Category' },
  { key: 'fileType', label: 'File Type', align: 'center' as const },
  { key: 'downloadCount', label: 'Downloads', align: 'right' as const },
]

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

// Separate files into Pinned (Top Section "Files") and All Files (Bottom Section)
const pinnedFiles = computed(() => {
  return files.value.filter(f => f.isPinned)
})

const tableFiles = computed(() => {
  let list = files.value.filter(f => !f.isPinned)
  if (list.length === 0) {
    list = files.value
  }

  // Filter by search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.ownedBy && item.ownedBy.toLowerCase().includes(q))
    )
  }

  // Filter by File Type
  if (fileTypeFilter.value !== 'All File types') {
    const ft = fileTypeFilter.value.toLowerCase()
    list = list.filter(item => {
      if (ft === 'folders') return item.fileType === 'folder'
      if (ft === 'pdf') return item.fileType === 'pdf'
      if (ft === 'images') return item.fileType === 'image'
      if (ft === 'videos') return item.fileType === 'video'
      if (ft === 'audios') return item.fileType === 'audio'
      if (ft === 'excel') return item.fileType === 'excel'
      return true
    })
  }

  // Sort by
  if (sortBy.value === 'Sort By Size') {
    list = [...list].sort((a, b) => (parseFloat(b.size) || 0) - (parseFloat(a.size) || 0))
  } else if (sortBy.value === 'Order Ascending') {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'Order Descending') {
    list = [...list].sort((a, b) => b.name.localeCompare(a.name))
  }

  return list
})

// Modals
const isUploadModalOpen = ref(false)
const isCreateFolderModalOpen = ref(false)
const isEditModalOpen = ref(false)
const activeFileForEdit = ref<DownloadFileItem | null>(null)
const fileToDelete = ref<DownloadFileItem | null>(null)

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
</script>

<template>
  <div class="space-y-5">
    <!-- Success Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-xl transition-all"
    >
      <FeatherIcon name="check-circle" size="16" />
      <span>{{ toastMessage }}</span>
    </div>

    <SalesListHeader
      title="Download Files"
      subtitle="Manage your files"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <div class="relative inline-flex items-center">
          <select
            v-model="ownedFilter"
            class="h-9 rounded-md border border-gray-200 bg-white pl-8 pr-7 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option>Owned By Me</option>
            <option>Owned by Anyone</option>
            <option>Not Owned by Me</option>
          </select>
          <FeatherIcon
            name="sliders"
            :size="14"
            class="pointer-events-none absolute left-2.5 text-gray-400"
          />
        </div>
        <button
          type="button"
          class="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          @click="handleOpenUpload"
        >
          <FeatherIcon name="upload" :size="15" />
          <span>Upload Files</span>
        </button>
      </template>
    </SalesListHeader>

    <!-- Divider line with collapse toggle circle button -->
    <div class="relative border-t border-gray-200 dark:border-gray-800 my-2">
      <button
        type="button"
        class="absolute -top-3.5 left-4 flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition"
        :title="isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'"
        @click="isSidebarOpen = !isSidebarOpen"
      >
        <FeatherIcon
          :name="isSidebarOpen ? 'chevron-left' : 'chevron-right'"
          :size="14"
        />
      </button>
    </div>

    <!-- Main Content Area: 2 Columns -->
    <div class="flex flex-col lg:flex-row gap-6 items-start pt-2">
      <!-- Left Sidebar (Files, + New, Storage) -->
      <div
        v-show="isSidebarOpen"
        class="w-full lg:w-64 shrink-0 transition-all duration-200"
      >
        <DownloadFileSidebar
          :total-files="files.length"
          @upload-file="handleOpenUpload"
          @upload-folder="handleOpenUpload"
          @create-folder="handleOpenCreateFolder"
        />
      </div>

      <!-- Right Main Content Area -->
      <div class="flex-1 space-y-6 w-full min-w-0">
        <!-- Filter Bar (Sort by Date, Search, Recent, All File types) -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <!-- Left: Sort by Date & Search -->
          <div class="flex items-center gap-2.5 flex-1 max-w-md">
            <!-- Sort by Date -->
            <div class="relative inline-flex items-center">
              <select
                v-model="sortBy"
                class="h-9 rounded-lg border border-gray-200 bg-white pl-8 pr-7 text-xs font-medium text-gray-700 hover:border-gray-300 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option>Sort by Date</option>
                <option>Sort By Relevance</option>
                <option>Sort By Size</option>
                <option>Order Ascending</option>
                <option>Order Descending</option>
              </select>
              <FeatherIcon
                name="sliders"
                :size="14"
                class="pointer-events-none absolute left-2.5 text-gray-400"
              />
            </div>

            <!-- Search input -->
            <div class="relative flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search"
                class="h-9 w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 text-xs font-medium text-gray-700 placeholder-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
              <FeatherIcon
                name="search"
                :size="14"
                class="pointer-events-none absolute left-2.5 top-2.5 text-gray-400"
              />
            </div>
          </div>

          <!-- Right: Recent & All File types -->
          <div class="flex items-center gap-2.5">
            <!-- Recent Dropdown -->
            <div class="relative inline-flex items-center">
              <select
                v-model="recentFilter"
                class="h-9 rounded-lg border border-gray-200 bg-white pl-8 pr-7 text-xs font-medium text-gray-700 hover:border-gray-300 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option>Recent</option>
                <option>Last Week</option>
                <option>Last Month</option>
              </select>
              <FeatherIcon
                name="clock"
                :size="14"
                class="pointer-events-none absolute left-2.5 text-gray-400"
              />
            </div>

            <!-- All File Types Dropdown -->
            <div class="relative inline-flex items-center">
              <select
                v-model="fileTypeFilter"
                class="h-9 rounded-lg border border-gray-200 bg-white pl-8 pr-7 text-xs font-medium text-gray-700 hover:border-gray-300 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option>All File types</option>
                <option>Folders</option>
                <option>PDF</option>
                <option>Images</option>
                <option>Videos</option>
                <option>Audios</option>
                <option>Excel</option>
              </select>
              <FeatherIcon
                name="filter"
                :size="14"
                class="pointer-events-none absolute left-2.5 text-gray-400"
              />
            </div>
          </div>
        </div>

        <!-- Skeleton Loader for Files & Table -->
        <div v-if="pending" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div
              v-for="i in 4"
              :key="`file-card-skel-${i}`"
              class="rounded-xl border border-gray-100 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900 animate-pulse space-y-3"
            >
              <div class="flex items-center justify-between">
                <div class="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800" />
                <div class="h-4 w-4 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
              <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div class="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
          <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900 animate-pulse space-y-3">
            <div class="h-8 w-full rounded bg-gray-200 dark:bg-gray-800" />
            <div v-for="r in 5" :key="`file-row-skel-${r}`" class="h-12 w-full rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>

        <template v-else>
          <!-- Section 1: Pinned / Quick Access "Files" Grid -->
          <DownloadFileCardGrid
            :files="pinnedFiles"
            @toggle-favorite="handleToggleFavorite"
            @download="handleDownload"
            @delete="handleDeleteRequest"
            @edit="handleEditFile"
          />

          <!-- Section 2: "All Files" Table / Grid with View Switchers -->
          <DownloadFileTable
            :files="tableFiles"
            @current-page-items="currentPageFiles = $event"
            @toggle-favorite="handleToggleFavorite"
            @download="handleDownload"
            @delete="handleDeleteRequest"
            @edit="handleEditFile"
          />
        </template>
      </div>
    </div>

    <!-- Modals -->
    <UploadFileModal
      :open="isUploadModalOpen"
      :busy="isBusy"
      @close="isUploadModalOpen = false"
      @submit="handleUploadSubmit"
    />

    <CreateFolderModal
      :open="isCreateFolderModalOpen"
      :busy="isBusy"
      @close="isCreateFolderModalOpen = false"
      @submit="handleCreateFolderSubmit"
    />

    <DownloadFileFormModal
      :open="isEditModalOpen"
      :is-edit="true"
      :file-data="activeFileForEdit"
      :busy="isBusy"
      @close="isEditModalOpen = false"
      @submit="handleEditSubmit"
    />

    <SalesConfirmDelete
      :open="!!fileToDelete"
      :title="fileToDelete?.name ? `Hapus File '${fileToDelete.name}'?` : 'Hapus File?'"
      :message="`Apakah Anda yakin ingin menghapus file ini? Tindakan ini tidak dapat dibatalkan.`"
      :busy="isBusy"
      @confirm="confirmDelete"
      @close="fileToDelete = null"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Download Files Report"
      subtitle="Managed files, ownership, size, and download activity"
      :columns="printColumns"
      :items="tableFiles"
      :current-page-items="currentPageFiles"
      date-field="uploadedDate"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

