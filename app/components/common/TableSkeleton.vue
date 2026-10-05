<script setup lang="ts">
import AppSkeleton from '~/components/common/AppSkeleton.vue'

withDefaults(
  defineProps<{
    rows?: number
    cols?: number
    showToolbar?: boolean
    showHeader?: boolean
    showPagination?: boolean
  }>(),
  {
    rows: 6,
    cols: 7,
    showToolbar: true,
    showHeader: true,
    showPagination: true,
  },
)

// Random realistic width variations for cell text
const cellWidths = ['w-16', 'w-24', 'w-32', 'w-20', 'w-28', 'w-14', 'w-36']
</script>

<template>
  <div
    class="sales-records-table rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden"
  >
    <!-- Table Controls Toolbar Skeleton -->
    <div
      v-if="showToolbar"
      class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-gray-800"
    >
      <!-- Search input skeleton -->
      <div class="w-full max-w-xs flex-1">
        <AppSkeleton height="h-9" rounded="md" class="w-full" />
      </div>

      <!-- Filter buttons skeleton -->
      <div class="flex flex-wrap items-center gap-2 self-end sm:self-auto">
        <AppSkeleton height="h-9" rounded="md" class="w-32" />
        <AppSkeleton height="h-9" rounded="md" class="w-28" />
        <AppSkeleton height="h-9" rounded="md" class="w-24" />
      </div>
    </div>

    <!-- Table Body Skeleton -->
    <div class="overflow-x-auto">
      <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
        <!-- Table Header -->
        <thead
          v-if="showHeader"
          class="border-b border-gray-200 bg-gray-50/75 dark:border-gray-800 dark:bg-gray-800/50"
        >
          <tr>
            <th v-for="c in cols" :key="`th-${c}`" class="px-4 py-3.5">
              <AppSkeleton height="h-3.5" rounded="sm" :class="cellWidths[(c - 1) % cellWidths.length]" />
            </th>
          </tr>
        </thead>

        <!-- Table Rows -->
        <tbody>
          <tr
            v-for="r in rows"
            :key="`row-${r}`"
            class="border-b border-gray-100 transition-colors dark:border-gray-800/60"
          >
            <td v-for="c in cols" :key="`td-${r}-${c}`" class="px-4 py-3.5">
              <!-- Avatar + text simulation for col 2 -->
              <div v-if="c === 2" class="flex items-center gap-2">
                <AppSkeleton circle width="28px" height="28px" />
                <AppSkeleton height="h-3.5" rounded="sm" class="w-28" />
              </div>
              <!-- Action buttons simulation for last col -->
              <div v-else-if="c === cols" class="flex items-center justify-center gap-1.5">
                <AppSkeleton height="h-6" rounded="sm" class="w-14" />
                <AppSkeleton height="h-6" width="24px" rounded="sm" />
                <AppSkeleton height="h-6" width="24px" rounded="sm" />
              </div>
              <!-- Standard cell -->
              <AppSkeleton
                v-else
                height="h-3.5"
                rounded="sm"
                :class="cellWidths[(r + c) % cellWidths.length]"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Pagination Skeleton -->
    <div
      v-if="showPagination"
      class="flex flex-col items-center justify-between gap-3 border-t border-gray-100 p-4 sm:flex-row dark:border-gray-800"
    >
      <AppSkeleton height="h-4" rounded="sm" class="w-40" />
      <div class="flex items-center gap-1.5">
        <AppSkeleton height="h-8" width="32px" rounded="md" />
        <AppSkeleton height="h-8" width="32px" rounded="md" />
        <AppSkeleton height="h-8" width="32px" rounded="md" />
        <AppSkeleton height="h-8" width="32px" rounded="md" />
      </div>
    </div>
  </div>
</template>
