<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  sortBy: string
  searchQuery: string
  recentFilter: string
  fileTypeFilter: string
}>()

const emit = defineEmits<{
  (e: 'update:sortBy', val: string): void
  (e: 'update:searchQuery', val: string): void
  (e: 'update:recentFilter', val: string): void
  (e: 'update:fileTypeFilter', val: string): void
}>()
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <!-- Left: Sort by Date & Search -->
    <div class="flex items-center gap-2.5 flex-1 max-w-md">
      <!-- Sort by Date -->
      <div class="relative inline-flex items-center">
        <select
          :value="sortBy"
          class="h-9 rounded-lg border border-gray-200 bg-white pl-8 pr-7 text-xs font-medium text-gray-700 hover:border-gray-300 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @change="emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
        >
          <option>Sort by Date</option>
          <option>Sort By Relevance</option>
          <option>Sort By Size</option>
          <option>Order Ascending</option>
          <option>Order Descending</option>
        </select>
        <FeatherIcon
          name="sliders"
          :size="14"
          class="pointer-events-none absolute left-2.5 text-gray-400"
        />
      </div>

      <!-- Search input -->
      <div class="relative flex-1">
        <input
          :value="searchQuery"
          type="text"
          placeholder="Search"
          class="h-9 w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 text-xs font-medium text-gray-700 placeholder-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
        <FeatherIcon
          name="search"
          :size="14"
          class="pointer-events-none absolute left-2.5 top-2.5 text-gray-400"
        />
      </div>
    </div>

    <!-- Right: Recent & All File types -->
    <div class="flex items-center gap-2.5">
      <!-- Recent Dropdown -->
      <div class="relative inline-flex items-center">
        <select
          :value="recentFilter"
          class="h-9 rounded-lg border border-gray-200 bg-white pl-8 pr-7 text-xs font-medium text-gray-700 hover:border-gray-300 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @change="emit('update:recentFilter', ($event.target as HTMLSelectElement).value)"
        >
          <option>Recent</option>
          <option>Last Week</option>
          <option>Last Month</option>
        </select>
        <FeatherIcon
          name="clock"
          :size="14"
          class="pointer-events-none absolute left-2.5 text-gray-400"
        />
      </div>

      <!-- All File Types Dropdown -->
      <div class="relative inline-flex items-center">
        <select
          :value="fileTypeFilter"
          class="h-9 rounded-lg border border-gray-200 bg-white pl-8 pr-7 text-xs font-medium text-gray-700 hover:border-gray-300 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @change="emit('update:fileTypeFilter', ($event.target as HTMLSelectElement).value)"
        >
          <option>All File types</option>
          <option>Folders</option>
          <option>PDF</option>
          <option>Images</option>
          <option>Videos</option>
          <option>Audios</option>
          <option>Excel</option>
        </select>
        <FeatherIcon
          name="filter"
          :size="14"
          class="pointer-events-none absolute left-2.5 text-gray-400"
        />
      </div>
    </div>
  </div>
</template>

