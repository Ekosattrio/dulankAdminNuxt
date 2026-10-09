<script setup lang="ts">
import type { BannerItem } from '#server/types/banner'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'

defineProps<{
  banners: BannerItem[]
  searchQuery: string
  filterPosition?: string
  filterStatus?: string
  positions: string[]
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterPosition': [value: string]
  'update:filterStatus': [value: string]
  'edit': [item: BannerItem]
  'delete': [item: BannerItem]
}>()

const statusOptions = ['Active', 'Inactive']

const columns = [
  { key: 'order', label: 'Order', sortable: true, align: 'center' as const, class: 'w-16 text-center' },
  { key: 'preview', label: 'Preview', sortable: false, align: 'center' as const, class: 'w-32 text-center' },
  { key: 'title', label: 'Banner Title', sortable: true, class: 'min-w-[220px]' },
  { key: 'position', label: 'Position', sortable: true, class: 'whitespace-nowrap' },
  { key: 'dates', label: 'Schedule (Start - End)', sortable: false, class: 'whitespace-nowrap' },
  { key: 'redirectUrl', label: 'Redirect URL', sortable: false, class: 'min-w-[150px]' },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="banners"
    :search="searchQuery"
    search-placeholder="Search banner title or position..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="filterPosition"
        label="Position"
        :options="positions"
        @update:model-value="emit('update:filterPosition', $event)"
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

    <template #cell(preview)="{ item }">
      <div class="h-14 w-28 overflow-hidden rounded border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <img
          v-if="item.imageUrl"
          :src="item.imageUrl"
          :alt="item.title"
          class="h-full w-full object-cover"
        />
        <div v-else class="flex h-full w-full items-center justify-center text-gray-400">
          <FeatherIcon name="image" size="18" />
        </div>
      </div>
    </template>

    <template #cell(title)="{ item }">
      <div class="flex flex-col">
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ item.title }}
        </span>
        <span v-if="item.description" class="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
          {{ item.description }}
        </span>
      </div>
    </template>

    <template #cell(position)="{ item }">
      <span class="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
        {{ item.position }}
      </span>
    </template>

    <template #cell(dates)="{ item }">
      <div class="flex flex-col text-xs text-gray-600 dark:text-gray-400">
        <span>Mulai: <strong class="text-gray-800 dark:text-gray-200">{{ item.startDate }}</strong></span>
        <span>Selesai: <strong class="text-gray-800 dark:text-gray-200">{{ item.endDate }}</strong></span>
      </div>
    </template>

    <template #cell(redirectUrl)="{ item }">
      <a
        v-if="item.redirectUrl"
        :href="item.redirectUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono"
      >
        <span>{{ item.redirectUrl }}</span>
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
          tooltip="Edit Banner"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          tooltip="Delete Banner"
          danger
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
