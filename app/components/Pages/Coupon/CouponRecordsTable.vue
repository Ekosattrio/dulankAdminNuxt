<script setup lang="ts">
import type { CouponItem } from '#server/types/coupon'
import { formatIDR } from '~/utils/currency'

const props = defineProps<{
  items: CouponItem[]
  search: string
  type: string
  status: string
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:type': [value: string]
  'update:status': [value: string]
  edit: [item: CouponItem]
  delete: [item: CouponItem]
}>()

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'code', label: 'Code', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'discount', label: 'Discount', sortable: true, align: 'right' as const },
  { key: 'limit', label: 'Limit', sortable: true, align: 'center' as const },
  { key: 'used', label: 'Used', sortable: true, align: 'center' as const },
  { key: 'valid', label: 'Valid', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]

function formatDiscount(item: CouponItem): string {
  if (item.type === 'Percentage') {
    return `${item.discount}%`
  }
  return formatIDR(item.discount)
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="items"
    :search="search"
    search-placeholder="Search..."
    @update:search="emit('update:search', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="type"
        :options="['Fixed', 'Percentage']"
        placeholder="Type"
        @update:model-value="emit('update:type', $event)"
      />
      <TableFilterSelect
        :model-value="status"
        :options="['Active', 'Inactive']"
        placeholder="Status"
        @update:model-value="emit('update:status', $event)"
      />
    </template>

    <template #cell(name)="{ item }">
      <span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span>
    </template>

    <template #cell(code)="{ item }">
      <span
        class="inline-flex items-center rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300"
      >
        {{ item.code }}
      </span>
    </template>

    <template #cell(type)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">{{ item.type }}</span>
    </template>

    <template #cell(discount)="{ item }">
      <span class="font-medium text-gray-900 dark:text-white tabular-nums">
        {{ formatDiscount(item) }}
      </span>
    </template>

    <template #cell(limit)="{ item }">
      <span class="text-gray-600 dark:text-gray-300">
        {{ item.limit === 0 ? 'Unlimited' : item.limit }}
      </span>
    </template>

    <template #cell(used)="{ item }">
      <span class="text-gray-600 dark:text-gray-300 tabular-nums">
        {{ item.used }}
      </span>
    </template>

    <template #cell(valid)="{ item }">
      <span class="text-gray-600 dark:text-gray-300 text-xs">
        {{ item.valid }}
      </span>
    </template>

    <template #cell(status)="{ item }">
      <SalesStatusBadge :status="item.status" />
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton action="edit" label="Edit Coupon" @click="emit('edit', item)" />
        <SalesActionButton action="delete" label="Delete Coupon" danger @click="emit('delete', item)" />
      </div>
    </template>
  </SalesDataTable>
</template>

