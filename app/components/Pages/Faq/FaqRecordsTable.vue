<script setup lang="ts">
import type { FaqItem } from '#server/types/faq'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'

defineProps<{
  faqs: FaqItem[]
  searchQuery: string
  filterCategory?: string
  filterStatus?: string
  categories: string[]
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterCategory': [value: string]
  'update:filterStatus': [value: string]
  'edit': [item: FaqItem]
  'delete': [item: FaqItem]
}>()

const statusOptions = ['Active', 'Inactive']

const columns = [
  { key: 'order', label: 'Order', sortable: true, align: 'center' as const, class: 'w-16 text-center' },
  { key: 'question', label: 'Question', sortable: true, class: 'min-w-[260px]' },
  { key: 'category', label: 'Category', sortable: true, class: 'whitespace-nowrap' },
  { key: 'answer', label: 'Answer', sortable: false, class: 'min-w-[320px]' },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="faqs"
    :search="searchQuery"
    search-placeholder="Search questions or answers..."
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
        :model-value="filterStatus"
        label="Status"
        :options="statusOptions"
        @update:model-value="emit('update:filterStatus', $event)"
      />
    </template>

    <template #cell(order)="{ item }">
      <span class="inline-flex size-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
        {{ item.order ?? '-' }}
      </span>
    </template>

    <template #cell(question)="{ item }">
      <span class="font-semibold text-gray-900 dark:text-gray-100 block">
        {{ item.question }}
      </span>
    </template>

    <template #cell(category)="{ item }">
      <span class="inline-flex items-center rounded-md bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-950/40 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
        {{ item.category }}
      </span>
    </template>

    <template #cell(answer)="{ item }">
      <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 max-w-lg">
        {{ item.answer }}
      </p>
    </template>

    <template #cell(status)="{ item }">
      <span
        :class="[
          'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold',
          item.status === 'Active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
        ]"
      >
        {{ item.status }}
      </span>
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          icon="edit"
          tooltip="Edit FAQ"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          tooltip="Delete FAQ"
          danger
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
