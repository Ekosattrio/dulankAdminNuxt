<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  searchQuery: string
  filterStatus: string
  sortBy: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:filterStatus', val: string): void
  (e: 'update:sortBy', val: string): void
  (e: 'exportExcel'): void
}>()
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- Search Input with Icon -->
      <div class="relative w-full sm:max-w-xs">
        <input
          :value="searchQuery"
          type="text"
          placeholder="Search"
          class="w-full rounded-lg border border-gray-200 bg-white py-2 ps-3 pe-9 text-xs text-gray-800 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
        <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400">
          <FeatherIcon name="search" size="14" />
        </span>
      </div>

      <!-- Filter Dropdowns -->
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Status Dropdown -->
        <div class="relative">
          <select
            :value="filterStatus"
            class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 cursor-pointer pe-7"
            @change="emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <!-- Sort Dropdown -->
        <div class="relative">
          <select
            :value="sortBy"
            class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 cursor-pointer pe-7"
            @change="emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
          >
            <option value="newest">Sort By : Last 7 Days</option>
            <option value="oldest">Sort By : Oldest</option>
            <option value="popular">Sort By : Most Popular</option>
            <option value="title">Sort By : Title</option>
          </select>
        </div>

        <!-- Excel Export Button -->
        <button
          type="button"
          title="Export Excel (CSV)"
          class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @click="emit('exportExcel')"
        >
          <FeatherIcon name="download" size="13" />
          <span class="hidden sm:inline">Excel</span>
        </button>
      </div>
    </div>
  </div>
</template>

