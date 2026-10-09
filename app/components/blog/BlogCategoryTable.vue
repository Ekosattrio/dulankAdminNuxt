<script setup lang="ts">
import type { BlogCategory } from '#server/types/blog'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  categories: BlogCategory[]
  searchQuery: string
  filterStatus: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'edit': [item: BlogCategory]
  'delete': [item: BlogCategory]
  'print': []
  'pdf': []
  'exportExcel': []
}>()

const columns = [
  { key: 'name', label: 'Category Name', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'postCount', label: 'Post Count', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'createdDate', label: 'Created On', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="categories"
    :search="searchQuery"
    search-placeholder="Search category name or slug..."
    @update:search="emit('update:searchQuery', $event)"
    @print="emit('print')"
    @export-pdf="emit('pdf')"
    @export-excel="emit('exportExcel')"
  >
    <!-- Filters -->
    <template #filters>
      <TableFilterSelect
        :model-value="filterStatus"
        placeholder="All Status"
        :options="['Active', 'Inactive']"
        @update:model-value="emit('update:filterStatus', $event)"
      />
      <button
        type="button"
        title="Export to Excel"
        class="flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
        @click="emit('exportExcel')"
      >
        <FeatherIcon name="download" size="14" />
        <span>Excel</span>
      </button>
    </template>

    <!-- Cell: Category Name -->
    <template #cell(name)="{ item }">
      <span class="font-semibold text-gray-900 dark:text-gray-100">
        {{ item.name }}
      </span>
    </template>

    <!-- Cell: Slug -->
    <template #cell(slug)="{ item }">
      <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {{ item.slug }}
      </code>
    </template>

    <!-- Cell: Description -->
    <template #cell(description)="{ item }">
      <span class="text-xs text-gray-600 line-clamp-1 max-w-sm dark:text-gray-400" :title="item.description">
        {{ item.description || '-' }}
      </span>
    </template>

    <!-- Cell: Post Count -->
    <template #cell(postCount)="{ item }">
      <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
        {{ item.postCount ?? 0 }} posts
      </span>
    </template>

    <!-- Cell: Status -->
    <template #cell(status)="{ item }">
      <span
        :class="[
          'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold',
          item.status === 'Active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
            : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
        ]"
      >
        • {{ item.status }}
      </span>
    </template>

    <!-- Cell: Created On -->
    <template #cell(createdDate)="{ item }">
      <span class="text-xs text-gray-600 dark:text-gray-400">
        {{ item.createdDate }}
      </span>
    </template>

    <!-- Cell: Actions -->
    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          action="edit"
          title="Edit Category"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          action="delete"
          title="Delete Category"
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

