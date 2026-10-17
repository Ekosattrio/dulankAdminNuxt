<script setup lang="ts">
import type { DownloadFileItem } from '#server/types/download-file'
import DownloadFileSidebar from '~/components/Pages/DownloadFiles/DownloadFileSidebar.vue'
import DownloadFileCardGrid from '~/components/Pages/DownloadFiles/DownloadFileCardGrid.vue'
import DownloadFileTable from '~/components/Pages/DownloadFiles/DownloadFileTable.vue'
import DownloadFilesFilterBar from '~/components/Pages/DownloadFiles/DownloadFilesFilterBar.vue'

defineProps<{
  files: DownloadFileItem[]
  pinnedFiles: DownloadFileItem[]
  tableFiles: DownloadFileItem[]
  pending: boolean
  isSidebarOpen: boolean
  searchQuery: string
  sortBy: string
  recentFilter: string
  fileTypeFilter: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:sortBy': [value: string]
  'update:recentFilter': [value: string]
  'update:fileTypeFilter': [value: string]
  'uploadFile': []
  'uploadFolder': []
  'createFolder': []
  'toggleFavorite': [item: DownloadFileItem]
  'download': [item: DownloadFileItem]
  'delete': [item: DownloadFileItem]
  'edit': [item: DownloadFileItem]
  'currentPageItems': [items: DownloadFileItem[]]
}>()
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-6 items-start pt-2">
    <!-- Left Sidebar (Files, + New, Storage) -->
    <div
      v-show="isSidebarOpen"
      class="w-full lg:w-64 shrink-0 transition-all duration-200"
    >
      <DownloadFileSidebar
        :total-files="files.length"
        @upload-file="emit('uploadFile')"
        @upload-folder="emit('uploadFolder')"
        @create-folder="emit('createFolder')"
      />
    </div>

    <!-- Right Main Content Area -->
    <div class="flex-1 space-y-6 w-full min-w-0">
      <!-- Filter Bar (Sort by Date, Search, Recent, All File types) -->
      <DownloadFilesFilterBar
        :search-query="searchQuery"
        :sort-by="sortBy"
        :recent-filter="recentFilter"
        :file-type-filter="fileTypeFilter"
        @update:search-query="emit('update:searchQuery', $event)"
        @update:sort-by="emit('update:sortBy', $event)"
        @update:recent-filter="emit('update:recentFilter', $event)"
        @update:file-type-filter="emit('update:fileTypeFilter', $event)"
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
          @toggle-favorite="emit('toggleFavorite', $event)"
          @download="emit('download', $event)"
          @delete="emit('delete', $event)"
          @edit="emit('edit', $event)"
        />

        <!-- Section 2: "All Files" Table / Grid with View Switchers -->
        <DownloadFileTable
          :files="tableFiles"
          @current-page-items="emit('currentPageItems', $event)"
          @toggle-favorite="emit('toggleFavorite', $event)"
          @download="emit('download', $event)"
          @delete="emit('delete', $event)"
          @edit="emit('edit', $event)"
        />
      </template>
    </div>
  </div>
</template>

