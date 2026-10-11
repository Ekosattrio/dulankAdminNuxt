<script setup lang="ts">
import type { DateRangeValue } from '~/composables/useDateRange'
defineProps<{ collapsed: boolean; refreshing: boolean; dateRange: DateRangeValue | null }>()
const emit = defineEmits<{ refresh: []; collapse: []; 'update:dateRange': [value: DateRangeValue | null] }>()
</script>

<template>
  <section class="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex flex-wrap items-center gap-2">
        <h1 class="app-page-title flex items-center text-[#092c4c] dark:text-white"><img src="/assets/img/icons/hi.svg" alt="" class="me-2 size-6" />Hi John Smilga,</h1>
        <span v-show="!collapsed" class="app-page-subtitle">here's what's happening with your store today.</span>
      </div>
      <div class="flex items-center gap-2">
        <DateRangePicker :model-value="dateRange" input-class="w-60" @update:model-value="emit('update:dateRange', $event)" />
        <SalesActionButton action="refresh" label="Refresh dashboard" :disabled="refreshing" @click="emit('refresh')" />
        <SalesActionButton :icon="collapsed ? 'chevron-down' : 'chevron-up'" label="Collapse header" @click="emit('collapse')" />
      </div>
    </div>
  </section>
</template>
