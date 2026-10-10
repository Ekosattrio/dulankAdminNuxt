<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  stats?: {
    totalAddress: number
    totalProvince: number
    totalCity: number
    totalPosCode: number
  } | null
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Address -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary-900/30 dark:text-primary-400">
        <FeatherIcon name="map-pin" size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Address</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ stats?.totalAddress?.toLocaleString('id-ID') || '0' }}
        </div>
      </div>
    </div>

    <!-- Total Province -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <FeatherIcon name="globe" size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Province</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ stats?.totalProvince?.toLocaleString('id-ID') || '0' }}
        </div>
      </div>
    </div>

    <!-- Total City -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
        <FeatherIcon name="navigation" size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total City</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ stats?.totalCity?.toLocaleString('id-ID') || '0' }}
        </div>
      </div>
    </div>

    <!-- Total Pos Code -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
        <FeatherIcon name="mail" size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Pos Code</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ stats?.totalPosCode?.toLocaleString('id-ID') || '0' }}
        </div>
      </div>
    </div>
  </div>
</template>
