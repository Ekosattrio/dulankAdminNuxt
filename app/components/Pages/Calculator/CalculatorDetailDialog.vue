<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  sourceName?: string
  sourceAddress?: string
  details: Array<{ label: string; value: string | number | undefined | null }>
}>()
defineEmits<{ close: [] }>()
</script>

<template>
  <SalesDialog :open="open" :title="title" medium @close="$emit('close')">
    <div v-if="sourceName" class="mb-4 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60">
      <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ sourceName }}</p>
      <p class="mt-0.5 text-xs text-gray-500">{{ sourceAddress }}</p>
    </div>
    <dl class="divide-y divide-gray-100 text-xs dark:divide-gray-800">
      <div v-for="item in details" :key="item.label" class="grid grid-cols-12 gap-3 py-3">
        <dt class="col-span-5 font-semibold text-gray-600 dark:text-gray-300">{{ item.label }}</dt>
        <dd class="col-span-7 break-words text-gray-900 dark:text-white">{{ item.value ?? '-' }}</dd>
      </div>
    </dl>
    <div class="mt-5 flex justify-end"><button type="button" class="h-9 rounded-md border border-gray-300 px-4 text-xs font-semibold" @click="$emit('close')">Close</button></div>
  </SalesDialog>
</template>
