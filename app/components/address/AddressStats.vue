<script setup lang="ts">
import type { AddressStats } from '#server/types/address'

defineProps<{ stats?: AddressStats }>()

const metrics = [
  { key: 'totalAddress', label: 'Total Address', icon: 'map-pin' },
  { key: 'totalProvince', label: 'Total Province', icon: 'map' },
  { key: 'totalCity', label: 'Total City', icon: 'home' },
  { key: 'totalPosCode', label: 'Total Pos Code', icon: 'hash' },
] as const
</script>

<template>
  <div class="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div v-for="metric in metrics" :key="metric.key" class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <span class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FeatherIcon :name="metric.icon" :size="24" />
      </span>
      <div>
        <h6 class="text-sm text-gray-500 dark:text-gray-400">{{ metric.label }}</h6>
        <p class="mt-1 text-xl font-bold">{{ (stats?.[metric.key] ?? 0).toLocaleString('id-ID') }}</p>
      </div>
    </div>
  </div>
</template>
