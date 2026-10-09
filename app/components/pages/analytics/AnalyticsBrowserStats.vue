<script setup lang="ts">
interface BrowserStat {
  name: string
  percent: number
  count: string
  color: string
}

const browserStats: BrowserStat[] = [
  { name: 'Chrome', percent: 62.5, count: '5.06k', color: 'bg-[#28C76F]' },
  { name: 'Firefox', percent: 12.3, count: '1.5k', color: 'bg-[#FF9F43]' },
  { name: 'Safari', percent: 9.86, count: '1.03k', color: 'bg-[#00CFDD]' },
  { name: 'Brave', percent: 3.15, count: '0.3k', color: 'bg-[#7367F0]' },
  { name: 'Opera', percent: 3.01, count: '1.58k', color: 'bg-[#EA5455]' },
  { name: 'Falkon', percent: 2.8, count: '0.01k', color: 'bg-[#82868B]' },
  { name: 'Web', percent: 1.05, count: '2.51k', color: 'bg-[#1E293B]' },
  { name: 'Other', percent: 3.36, count: '3.6k', color: 'bg-[#CBD5E1]' }
]

const emit = defineEmits<{
  (e: 'viewDetail', title: string, desc: string): void
}>()
</script>

<template>
  <div class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-3">
    <div>
      <h6 class="mb-4 text-sm font-bold text-gray-900 dark:text-white">Session By Browser</h6>
      <div class="space-y-2.5 text-xs">
        <div v-for="b in browserStats" :key="b.name" class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="font-medium text-gray-700 dark:text-gray-200">{{ b.name }}</span>
            <span class="font-bold text-gray-900 dark:text-white">
              {{ b.percent }}%
              <span class="ms-1 font-normal text-gray-400">{{ b.count }}</span>
            </span>
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div class="h-full rounded-full" :class="b.color" :style="{ width: `${b.percent}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="mt-4 w-full rounded-lg border border-primary bg-white py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white dark:bg-gray-800"
      @click="emit('viewDetail', 'Browser Traffic Breakdown', 'Chrome continues to lead traffic with 62.5% (5,060 sessions), followed by Firefox at 12.3% and Safari at 9.86%.')"
    >
      View All
    </button>
  </div>
</template>

