<script setup lang="ts">
import type { DownloadFileItem } from '#server/types/download-file'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'

defineProps<{
  files: DownloadFileItem[]
  searchQuery: string
  filterCategory?: string
  filterType?: string
  categories: string[]
  fileTypes: string[]
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterCategory': [value: string]
  'update:filterType': [value: string]
  'download': [item: DownloadFileItem]
  'edit': [item: DownloadFileItem]
  'delete': [item: DownloadFileItem]
}>()

const columns = [
  { key: 'fileType', label: 'Type', sortable: false, align: 'center' as const, class: 'w-16 text-center' },
  { key: 'name', label: 'File Name', sortable: true, class: 'min-w-[240px]' },
  { key: 'category', label: 'Category', sortable: true, class: 'whitespace-nowrap' },
  { key: 'size', label: 'Size', sortable: true, class: 'whitespace-nowrap' },
  { key: 'downloadCount', label: 'Downloads', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'uploadedDate', label: 'Uploaded Date', sortable: true, class: 'whitespace-nowrap' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

function getFileTypeIcon(type: string): { icon: string; color: string } {
  switch (type) {
    case 'pdf':
      return { icon: 'file-text', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' }
    case 'excel':
      return { icon: 'file-spreadsheet', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' }
    case 'image':
      return { icon: 'image', color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800' }
    case 'word':
      return { icon: 'file', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' }
    case 'archive':
      return { icon: 'archive', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' }
    default:
      return { icon: 'file', color: 'text-gray-500 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' }
  }
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="files"
    :search="searchQuery"
    search-placeholder="Search file name or category..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="filterCategory"
        label="Category"
        :options="categories"
        @update:model-value="emit('update:filterCategory', $event)"
      />
      <TableFilterSelect
        :model-value="filterType"
        label="Type"
        :options="fileTypes"
        @update:model-value="emit('update:filterType', $event)"
      />
    </template>

    <template #cell(fileType)="{ item }">
      <div
        :class="[
          'inline-flex size-8 items-center justify-center rounded-lg border',
          getFileTypeIcon(item.fileType).color
        ]"
      >
        <FeatherIcon :name="getFileTypeIcon(item.fileType).icon" :size="16" />
      </div>
    </template>

    <template #cell(name)="{ item }">
      <div class="flex flex-col">
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ item.name }}
        </span>
        <span v-if="item.uploadedBy" class="text-[11px] text-gray-500 dark:text-gray-400">
          Oleh: {{ item.uploadedBy }}
        </span>
      </div>
    </template>

    <template #cell(category)="{ item }">
      <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {{ item.category }}
      </span>
    </template>

    <template #cell(size)="{ item }">
      <span class="font-mono text-xs text-gray-600 dark:text-gray-400">
        {{ item.size }}
      </span>
    </template>

    <template #cell(downloadCount)="{ item }">
      <span class="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
        <FeatherIcon name="download" size="12" class="text-gray-400" />
        {{ item.downloadCount ?? 0 }}
      </span>
    </template>

    <template #cell(uploadedDate)="{ item }">
      <span class="text-xs text-gray-600 dark:text-gray-400">
        {{ item.uploadedDate }}
      </span>
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          icon="download"
          tooltip="Download File"
          @click="emit('download', item)"
        />
        <SalesActionButton
          icon="edit"
          tooltip="Edit File"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          tooltip="Delete File"
          danger
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
