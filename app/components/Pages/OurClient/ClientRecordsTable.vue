<script setup lang="ts">
import type { ClientItem } from '#server/types/client'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'

defineProps<{
  clients: ClientItem[]
  searchQuery: string
  filterCategory?: string
  filterStatus?: string
  categories: string[]
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterCategory': [value: string]
  'update:filterStatus': [value: string]
  'edit': [item: ClientItem]
  'delete': [item: ClientItem]
}>()

const statusOptions = ['Active', 'Inactive']

const columns = [
  { key: 'order', label: 'Order', sortable: true, align: 'center' as const, class: 'w-16 text-center' },
  { key: 'logo', label: 'Logo', sortable: false, align: 'center' as const, class: 'w-24 text-center' },
  { key: 'name', label: 'Client Name', sortable: true, class: 'min-w-[200px]' },
  { key: 'category', label: 'Category', sortable: true, class: 'whitespace-nowrap' },
  { key: 'website', label: 'Website', sortable: false, class: 'min-w-[180px]' },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="clients"
    :search="searchQuery"
    search-placeholder="Search client name or category..."
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

    <template #cell(logo)="{ item }">
      <div class="flex h-10 w-20 items-center justify-center rounded border border-gray-100 bg-white p-1 dark:border-gray-800 dark:bg-gray-800">
        <img
          v-if="item.logoUrl"
          :src="item.logoUrl"
          :alt="item.name"
          class="max-h-8 max-w-full object-contain"
        />
        <FeatherIcon v-else name="image" size="18" class="text-gray-400" />
      </div>
    </template>

    <template #cell(name)="{ item }">
      <span class="font-semibold text-gray-900 dark:text-gray-100 block">
        {{ item.name }}
      </span>
    </template>

    <template #cell(category)="{ item }">
      <span class="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
        {{ item.category }}
      </span>
    </template>

    <template #cell(website)="{ item }">
      <a
        v-if="item.website"
        :href="item.website"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      >
        <span>{{ item.website }}</span>
        <FeatherIcon name="external-link" size="12" />
      </a>
      <span v-else class="text-xs text-gray-400">-</span>
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
          tooltip="Edit Client"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          tooltip="Delete Client"
          danger
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
