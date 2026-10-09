<script setup lang="ts">
import AppSkeleton from '~/components/common/AppSkeleton.vue'

withDefaults(
  defineProps<{
    count?: number
    gridClass?: string
  }>(),
  {
    count: 4,
    gridClass: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
  },
)
</script>

<template>
  <div :class="gridClass">
    <div
      v-for="i in count"
      :key="`card-skel-${i}`"
      class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <!-- Icon box -->
      <AppSkeleton width="48px" height="48px" rounded="lg" />
      <div class="flex-1 space-y-2">
        <!-- Subtitle/label -->
        <AppSkeleton height="h-3.5" rounded="sm" class="w-20" />
        <!-- Big Number -->
        <AppSkeleton height="h-6" rounded="sm" class="w-32" />
      </div>
    </div>
  </div>
</template>
