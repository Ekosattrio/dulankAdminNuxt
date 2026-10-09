<script setup lang="ts">
import type { ContactFormItem } from '#server/types/contact-form'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'

const props = defineProps<{
  contacts: ContactFormItem[]
  searchQuery: string
  filterDateRange?: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
}>()

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Phone', sortable: true },
  { key: 'message', label: 'Message', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="contacts"
    :search="searchQuery"
    search-placeholder="Search contact messages..."
    @update:search="$emit('update:searchQuery', $event)"
  >
    <template #filters>
      <DateRangePicker
        :model-value="filterDateRange"
        aria-label="Date"
        input-class="w-44 max-w-44"
        align="end"
        placeholder="Date"
        @update:model-value="$emit('update:filterDateRange', $event)"
      />
    </template>

    <template #cell(name)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">
        {{ item.name }}
      </span>
    </template>

    <template #cell(email)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">
        {{ item.email }}
      </span>
    </template>

    <template #cell(phone)="{ item }">
      <span class="text-gray-600 dark:text-gray-400 font-mono text-xs">
        {{ item.phone }}
      </span>
    </template>

    <template #cell(message)="{ item }">
      <span class="text-gray-600 dark:text-gray-400 line-clamp-1 max-w-md text-xs">
        {{ item.message }}
      </span>
    </template>

    <template #cell(date)="{ item }">
      <span class="text-gray-600 dark:text-gray-400">
        {{ item.date }}
      </span>
    </template>
  </SalesDataTable>
</template>
