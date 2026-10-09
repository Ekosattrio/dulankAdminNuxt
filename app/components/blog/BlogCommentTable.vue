<script setup lang="ts">
import type { BlogComment } from '#server/types/blog'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  items: BlogComment[]
  search: string
  filterStatus: string
  isBusy: boolean
}>()

const emit = defineEmits<{
  (e: 'update:search', val: string): void
  (e: 'update:filterStatus', val: string): void
  (e: 'edit', item: BlogComment): void
  (e: 'delete', item: BlogComment): void
  (e: 'statusChange', item: BlogComment, status: 'Approved' | 'Pending' | 'Spam'): void
  (e: 'print'): void
  (e: 'exportPdf'): void
  (e: 'exportExcel'): void
}>()

const columns = [
  { key: 'comment', label: 'Comment', sortable: false },
  { key: 'blogTitle', label: 'Blog Title', sortable: true },
  { key: 'commenter', label: 'Commenter', sortable: true },
  { key: 'rating', label: 'Rating', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'createdDate', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="items"
    :search="search"
    search-placeholder="Search comment message, blog title, or author..."
    @update:search="emit('update:search', $event)"
    @print="emit('print')"
    @export-pdf="emit('exportPdf')"
    @export-excel="emit('exportExcel')"
  >
    <!-- Filters -->
    <template #filters>
      <TableFilterSelect
        :model-value="filterStatus"
        placeholder="All Status"
        :options="['Approved', 'Pending', 'Spam']"
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

    <!-- Cell: Comment -->
    <template #cell(comment)="{ item }">
      <div class="max-w-md">
        <p class="text-xs text-gray-800 line-clamp-2 dark:text-gray-200" :title="item.commentBody">
          "{{ item.commentBody }}"
        </p>
      </div>
    </template>

    <!-- Cell: Blog Title -->
    <template #cell(blogTitle)="{ item }">
      <span class="text-xs font-semibold text-gray-900 line-clamp-1 max-w-xs dark:text-gray-100" :title="item.blogTitle">
        {{ item.blogTitle }}
      </span>
    </template>

    <!-- Cell: Commenter -->
    <template #cell(commenter)="{ item }">
      <div>
        <div class="font-medium text-xs text-gray-900 dark:text-white">
          {{ item.commenterName }}
        </div>
        <div v-if="item.email" class="text-xs text-gray-500 dark:text-gray-400">
          {{ item.email }}
        </div>
      </div>
    </template>

    <!-- Cell: Rating -->
    <template #cell(rating)="{ item }">
      <div class="flex items-center justify-center gap-0.5 text-amber-400">
        <FeatherIcon
          v-for="i in 5"
          :key="i"
          name="star"
          size="11"
          :class="(item.rating || 5) >= i ? 'fill-current text-amber-400' : 'text-gray-300 dark:text-gray-600'"
        />
      </div>
    </template>

    <!-- Cell: Date -->
    <template #cell(createdDate)="{ item }">
      <span class="text-xs text-gray-600 dark:text-gray-400">
        {{ item.createdDate }}
      </span>
    </template>

    <!-- Cell: Status with Quick Toggle Dropdown -->
    <template #cell(status)="{ item }">
      <select
        :value="item.status"
        :class="[
          'cursor-pointer rounded-md border px-2 py-1 text-xs font-semibold transition focus:outline-none',
          item.status === 'Approved'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
            : item.status === 'Pending'
              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
              : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
        ]"
        :disabled="isBusy"
        @change="emit('statusChange', item, ($event.target as HTMLSelectElement).value as any)"
      >
        <option value="Approved">Approved</option>
        <option value="Pending">Pending</option>
        <option value="Spam">Spam</option>
      </select>
    </template>

    <!-- Cell: Actions -->
    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <button
          type="button"
          title="Edit Comment"
          aria-label="Edit Comment"
          class="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
          @click="emit('edit', item)"
        >
          <FeatherIcon name="edit" size="14" />
        </button>
        <button
          type="button"
          title="Delete Comment"
          aria-label="Delete Comment"
          class="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-rose-500 transition hover:border-rose-400 hover:bg-rose-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-rose-950/40"
          @click="emit('delete', item)"
        >
          <FeatherIcon name="trash-2" size="14" />
        </button>
      </div>
    </template>
  </SalesDataTable>
</template>

