import { ref } from 'vue'
import type { DownloadFileItem } from '#server/types/download-file'
import { useDownloadFiles } from '~/composables/useDownloadFiles'
import { useDownloadFilesFilter } from '~/composables/useDownloadFilesFilter'
import { useDownloadFilesActions } from '~/composables/useDownloadFilesActions'
import { useTablePrint } from '~/composables/useTablePrint'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import DownloadFileSidebar from '~/components/pages/download-files/DownloadFileSidebar.vue'
import DownloadFileFilterBar from '~/components/pages/download-files/DownloadFileFilterBar.vue'
import DownloadFileCardGrid from '~/components/pages/download-files/DownloadFileCardGrid.vue'
import DownloadFileTable from '~/components/pages/download-files/DownloadFileTable.vue'
import DownloadFileModals from '~/components/pages/download-files/DownloadFileModals.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const { files, pending, error, refresh, saveFile, deleteFile, toggleFavorite } = useDownloadFiles()
const {
  ownedFilter,
  sortBy,
  recentFilter,
  fileTypeFilter,
  searchQuery,
  pinnedFiles,
  tableFiles,
} = useDownloadFilesFilter(files)

const {
  isBusy,
  toastMessage,
  isUploadModalOpen,
  isCreateFolderModalOpen,
  isEditModalOpen,
  activeFileForEdit,
  fileToDelete,
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
} = useDownloadFilesActions(saveFile, deleteFile, toggleFavorite)

const isSidebarOpen = ref(true)
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
        <!-- Filter Bar -->
        <DownloadFileFilterBar
          :sort-by="sortBy"
          :search-query="searchQuery"
          :recent-filter="recentFilter"
          :file-type-filter="fileTypeFilter"
          @update:sort-by="sortBy = $event"
          @update:search-query="searchQuery = $event"
          @update:recent-filter="recentFilter = $event"
          @update:file-type-filter="fileTypeFilter = $event"
        />

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
    <DownloadFileModals
      :is-upload-open="isUploadModalOpen"
      :is-create-folder-open="isCreateFolderModalOpen"
      :is-edit-open="isEditModalOpen"
      :active-file-for-edit="activeFileForEdit"
      :file-to-delete="fileToDelete"
      :is-busy="isBusy"
      @close-upload="isUploadModalOpen = false"
      @close-create-folder="isCreateFolderModalOpen = false"
      @close-edit="isEditModalOpen = false"
      @close-delete="fileToDelete = null"
      @submit-upload="handleUploadSubmit"
      @submit-create-folder="handleCreateFolderSubmit"
      @submit-edit="handleEditSubmit"
      @confirm-delete="confirmDelete"
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
