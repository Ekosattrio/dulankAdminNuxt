<script setup lang="ts">
defineProps<{ title: string; subtitle: string; addLabel?: string; addTo?: string; refreshing?: boolean }>()
defineEmits<{ add: []; refresh: []; print: [] }>()
</script>

<template>
  <header class="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
    <div>
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ title }}</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        title="Export PDF (Save as PDF)"
        aria-label="Export PDF"
        class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        @click="$emit('print')"
      >
        <FeatherIcon name="file-text" :size="16" />
      </button>
      <button
        type="button"
        title="Print"
        aria-label="Print"
        class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        @click="$emit('print')"
      >
        <FeatherIcon name="printer" :size="16" />
      </button>
      <button
        type="button"
        title="Refresh"
        aria-label="Refresh"
        :disabled="refreshing"
        class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        @click="$emit('refresh')"
      >
        <FeatherIcon name="rotate-cw" :size="16" :class="refreshing ? 'animate-spin' : ''" />
      </button>
      <NuxtLink
        v-if="addTo"
        :to="addTo"
        class="inline-flex min-h-9 items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        ><FeatherIcon name="plus-circle" :size="16" />{{ addLabel }}</NuxtLink
      >
      <button
        v-else-if="addLabel"
        type="button"
        class="inline-flex min-h-9 items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        @click="$emit('add')"
      >
        <FeatherIcon name="plus-circle" :size="16" />{{ addLabel }}
      </button>
    </div>
  </header>
</template>
