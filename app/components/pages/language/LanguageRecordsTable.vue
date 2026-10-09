<script setup lang="ts">
import type { LanguageItem } from '#server/types/system-settings'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'

defineProps<{
  languages: LanguageItem[]
  searchQuery: string
  filterStatus: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'update:currentPageItems': [value: LanguageItem[]]
  edit: [item: LanguageItem]
  import: [item: LanguageItem]
  export: [item: LanguageItem]
  'toggle-rtl': [item: LanguageItem]
  'toggle-status': [item: LanguageItem]
}>()

const columns = [
  { key: 'name', label: 'Language', sortable: true },
  { key: 'code', label: 'Code', sortable: true },
  { key: 'rtl', label: 'RTL', align: 'center' as const },
  { key: 'totalKeys', label: 'Total', sortable: true, align: 'end' as const },
  { key: 'doneKeys', label: 'Done', sortable: true, align: 'end' as const },
  { key: 'progress', label: 'Progress', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="languages"
    :search="searchQuery"
    search-placeholder="Search language or code..."
    @update:search="emit('update:searchQuery', $event)"
    @update:current-page-items="emit('update:currentPageItems', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="filterStatus"
        :options="[
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]"
        placeholder="All Status"
        aria-label="Filter language status"
        @update:model-value="emit('update:filterStatus', $event)"
      />
    </template>

    <template #cell(name)="{ item }">
      <div class="flex items-center gap-2.5">
        <img
          v-if="item.flag"
          :src="item.flag"
          :alt="`${item.name} flag`"
          class="size-6 rounded-full border border-gray-200 object-cover dark:border-gray-700"
        />
        <div>
          <span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span>
          <span v-if="item.isDefault" class="ms-2 text-xs font-medium text-primary">Default</span>
        </div>
      </div>
    </template>

    <template #cell(code)="{ item }">
      <span class="font-mono uppercase text-gray-700 dark:text-gray-300">{{ item.code }}</span>
    </template>

    <template #cell(rtl)="{ item }">
      <button
        type="button"
        role="switch"
        :aria-checked="item.rtl"
        :aria-label="`Toggle RTL for ${item.name}`"
        :class="[
          'relative inline-flex h-5 w-9 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30',
          item.rtl ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600',
        ]"
        @click="emit('toggle-rtl', item)"
      >
        <span
          :class="[
            'mt-0.5 size-4 rounded-full bg-white shadow-sm transition-transform',
            item.rtl ? 'translate-x-[18px]' : 'translate-x-0.5',
          ]"
        />
      </button>
    </template>

    <template #cell(totalKeys)="{ item }">
      <span class="font-mono tabular-nums">{{ item.totalKeys.toLocaleString('id-ID') }}</span>
    </template>

    <template #cell(doneKeys)="{ item }">
      <span class="font-mono tabular-nums">{{ item.doneKeys.toLocaleString('id-ID') }}</span>
    </template>

    <template #cell(progress)="{ item }">
      <div class="flex min-w-32 items-center gap-2">
        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div class="h-full rounded-full bg-primary" :style="{ width: `${Math.min(100, item.progress || 0)}%` }" />
        </div>
        <span class="w-9 text-end font-mono tabular-nums">{{ item.progress || 0 }}%</span>
      </div>
    </template>

    <template #cell(status)="{ item }">
      <button
        type="button"
        :class="[
          'inline-flex rounded-md border px-2 py-1 text-xs font-semibold capitalize',
          item.status === 'active'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
            : 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
        ]"
        @click="emit('toggle-status', item)"
      >
        {{ item.status }}
      </button>
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton icon="upload" label="Import translation" @click="emit('import', item)" />
        <SalesActionButton icon="download" label="Export translation" @click="emit('export', item)" />
        <SalesActionButton icon="settings" label="Language settings" @click="emit('edit', item)" />
      </div>
    </template>
  </SalesDataTable>
</template>
