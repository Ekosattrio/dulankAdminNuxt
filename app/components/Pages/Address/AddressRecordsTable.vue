<script setup lang="ts">
import type { CustomerAddress, SupplierAddress } from '~/types/address'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'

const props = defineProps<{
  activeTab: 'customer' | 'supplier'
  items: (CustomerAddress | SupplierAddress)[]
  searchQuery: string
  filterStatus?: string
  filterDateRange?: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:activeTab': [val: 'customer' | 'supplier']
  'update:searchQuery': [val: string]
  'update:filterStatus': [val: string]
  'update:filterDateRange': [val: DateRangeValue | null]
  'view': [item: any]
  'edit': [item: any]
  'delete': [item: any]
}>()

const statusOptions = ['Home', 'Work', 'Office', 'Warehouse', 'Active', 'Non-Active']

const columns = computed(() => [
  { key: 'id', label: 'ID Address', sortable: true },
  { key: 'entityId', label: props.activeTab === 'customer' ? 'ID Customer' : 'ID Supplier', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'contact', label: 'Contact', sortable: true },
  { key: 'province', label: 'Province', sortable: true },
  { key: 'city', label: 'City', sortable: true },
  { key: 'district', label: 'District', sortable: true },
  { key: 'detailAddress', label: 'Detail Address', sortable: false },
  { key: 'otherDetail', label: 'Other Detail', sortable: false },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
])

function getItemEntityId(item: any) {
  return item.customerId || item.supplierId || item.id || '-'
}

function getItemName(item: any) {
  return item.name || item.user || '-'
}

function getItemContact(item: any) {
  return item.contact || item.phone || '-'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Tab Switcher -->
    <div class="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800">
      <button
        type="button"
        :class="[
          'px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors',
          activeTab === 'customer'
            ? 'border-primary text-primary dark:text-primary-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        ]"
        @click="emit('update:activeTab', 'customer')"
      >
        Customers
      </button>
      <button
        type="button"
        :class="[
          'px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors',
          activeTab === 'supplier'
            ? 'border-primary text-primary dark:text-primary-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        ]"
        @click="emit('update:activeTab', 'supplier')"
      >
        Supplier
      </button>
    </div>

    <!-- Table Container -->
    <SalesDataTable
      :columns="columns"
      :items="items"
      :search="searchQuery"
      search-placeholder="Search Address, Name, City..."
      @update:search="emit('update:searchQuery', $event)"
    >
      <template #filters>
        <DateRangePicker
          :model-value="filterDateRange"
          placeholder="Date"
          @update:model-value="emit('update:filterDateRange', $event)"
        />
        <TableFilterSelect
          :model-value="filterStatus"
          label="Status"
          :options="statusOptions"
          @update:model-value="emit('update:filterStatus', $event)"
        />
      </template>

      <template #cell(id)="{ item }">
        <span class="font-semibold text-primary dark:text-primary-400">
          {{ item.id }}
        </span>
      </template>

      <template #cell(entityId)="{ item }">
        <span class="text-gray-600 dark:text-gray-300 font-medium">
          {{ getItemEntityId(item) }}
        </span>
      </template>

      <template #cell(name)="{ item }">
        <span class="font-medium text-gray-900 dark:text-gray-100">
          {{ getItemName(item) }}
        </span>
      </template>

      <template #cell(contact)="{ item }">
        <span class="text-gray-600 dark:text-gray-300">
          {{ getItemContact(item) }}
        </span>
      </template>

      <template #cell(province)="{ item }">
        <span class="text-gray-700 dark:text-gray-300">{{ item.province || '-' }}</span>
      </template>

      <template #cell(city)="{ item }">
        <span class="text-gray-700 dark:text-gray-300">{{ item.city || '-' }}</span>
      </template>

      <template #cell(district)="{ item }">
        <span class="text-gray-700 dark:text-gray-300">{{ item.district || '-' }}</span>
      </template>

      <template #cell(detailAddress)="{ item }">
        <span class="text-gray-600 dark:text-gray-400 max-w-xs truncate block" :title="item.detailAddress || item.fullAddress">
          {{ item.detailAddress || item.fullAddress || '-' }}
        </span>
      </template>

      <template #cell(otherDetail)="{ item }">
        <span class="text-gray-500 dark:text-gray-400 text-[11px] max-w-xs truncate block" :title="item.otherDetail">
          {{ item.otherDetail || '-' }}
        </span>
      </template>

      <template #cell(status)="{ item }">
        <span class="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
          {{ item.status || 'Active' }}
        </span>
      </template>

      <template #cell(date)="{ item }">
        <span class="text-gray-500 dark:text-gray-400 text-[11px]">{{ item.date || item.dateAdded || '-' }}</span>
      </template>

      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center gap-1.5">
          <SalesActionButton
            icon="eye"
            tooltip="View Address"
            @click="emit('view', item)"
          />
          <SalesActionButton
            icon="edit"
            tooltip="Edit Address"
            @click="emit('edit', item)"
          />
          <SalesActionButton
            icon="trash-2"
            tooltip="Delete Address"
            danger
            @click="emit('delete', item)"
          />
        </div>
      </template>
    </SalesDataTable>
  </div>
</template>
