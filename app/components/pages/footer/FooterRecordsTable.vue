<script setup lang="ts">
import type { FooterLinkItem } from '#server/types/footer'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'

defineProps<{
  footers: FooterLinkItem[]
  searchQuery: string
  filterSection?: string
  filterStatus?: string
  sections: string[]
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterSection': [value: string]
  'update:filterStatus': [value: string]
  'edit': [item: FooterLinkItem]
  'delete': [item: FooterLinkItem]
}>()

const statusOptions = ['Active', 'Inactive']

const columns = [
  { key: 'order', label: 'Order', sortable: true, align: 'center' as const, class: 'w-16 text-center' },
  { key: 'sectionName', label: 'Section', sortable: true, class: 'whitespace-nowrap' },
  { key: 'linkTitle', label: 'Link Title', sortable: true, class: 'min-w-[200px]' },
  { key: 'url', label: 'URL / Path', sortable: false, class: 'min-w-[200px]' },
  { key: 'target', label: 'Target', sortable: false, align: 'center' as const, class: 'text-center' },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="footers"
    :search="searchQuery"
    search-placeholder="Search link title or url..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="filterSection"
        label="Section"
        :options="sections"
        @update:model-value="emit('update:filterSection', $event)"
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

    <template #cell(sectionName)="{ item }">
      <span class="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
        {{ item.sectionName }}
      </span>
    </template>

    <template #cell(linkTitle)="{ item }">
      <span class="font-semibold text-gray-900 dark:text-gray-100 block">
        {{ item.linkTitle }}
      </span>
    </template>

    <template #cell(url)="{ item }">
      <a
        :href="item.url"
        :target="item.target || '_self'"
        class="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono"
      >
        <span>{{ item.url }}</span>
        <FeatherIcon v-if="item.target === '_blank'" name="external-link" size="12" />
      </a>
    </template>

    <template #cell(target)="{ item }">
      <span class="text-[11px] font-mono text-gray-500 dark:text-gray-400">
        {{ item.target || '_self' }}
      </span>
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
          tooltip="Edit Footer Link"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          tooltip="Delete Footer Link"
          danger
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
