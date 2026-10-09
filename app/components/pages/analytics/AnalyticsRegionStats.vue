<script setup lang="ts">
const sessionsByCountry = [
  { name: 'Jawa Barat', count: '659k', percent: 45 },
  { name: 'Jakarta', count: '485k', percent: 33 },
  { name: 'Banten', count: '355k', percent: 24 },
  { name: 'Jawa Tengah', count: '204k', percent: 14 }
]

const emit = defineEmits<{
  (e: 'viewDetail', title: string, desc: string): void
}>()
</script>

<template>
  <div class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-4">
    <div>
      <div class="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
        <h6 class="text-sm font-bold text-gray-900 dark:text-white">Sessions by Country</h6>
        <button
          type="button"
          class="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="emit('viewDetail', 'Sessions by Region Data', 'Top visitor concentration across regional provinces: Jawa Barat (659k), Jakarta (485k), Banten (355k), and Jawa Tengah (204k).')"
        >
          View Data
        </button>
      </div>

      <div class="space-y-3.5 text-xs">
        <div
          v-for="c in sessionsByCountry"
          :key="c.name"
          class="flex flex-col gap-1 border-b border-gray-50 pb-2 dark:border-gray-800/60"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-gray-800 dark:text-gray-100">{{ c.name }}</span>
            <span class="font-bold text-primary">{{ c.count }}</span>
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div class="h-full rounded-full bg-primary" :style="{ width: `${c.percent}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800/40 dark:text-gray-400">
      Top regional server distribution covering major metropolitan customer centers.
    </div>
  </div>
</template>

