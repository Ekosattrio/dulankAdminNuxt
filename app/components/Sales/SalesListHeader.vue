<script setup lang="ts">
import { actionIconSizes, getActionIcon } from '~/utils/actionIcons'

defineProps<{ title: string; subtitle: string; addLabel?: string; addTo?: string; refreshing?: boolean }>()
const emit = defineEmits<{
  add: []
  refresh: []
  print: []
  pdf: []
  'export-pdf': []
}>()

function onPdfClick() {
  // Keep the old event alive while pages migrate to the shared `pdf` event.
  emit('pdf')
  emit('export-pdf')
}
</script>

<template>
  <header class="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
    <div>
      <h1 class="app-page-title">{{ title }}</h1>
      <p class="app-page-subtitle">{{ subtitle }}</p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        title="Export PDF (Save as PDF)"
        aria-label="Export PDF"
        class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 text-gray-600 dark:text-gray-300"
        @click="onPdfClick"
      >
        <FeatherIcon :name="getActionIcon('pdf')" :size="actionIconSizes.toolbar" />
      </button>
      <button
        type="button"
        title="Print"
        aria-label="Print"
        class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        @click="$emit('print')"
      >
        <FeatherIcon :name="getActionIcon('print')" :size="actionIconSizes.toolbar" />
      </button>
      <button
        type="button"
        title="Refresh"
        aria-label="Refresh"
        :disabled="refreshing"
        class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        @click="$emit('refresh')"
      >
        <FeatherIcon
          :name="getActionIcon('refresh')"
          :size="actionIconSizes.toolbar"
          :class="refreshing ? 'animate-spin' : ''"
        />
      </button>
      <NuxtLink
        v-if="addTo"
        :to="addTo"
        class="inline-flex min-h-9 items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        ><FeatherIcon :name="getActionIcon('add')" :size="actionIconSizes.button" />{{ addLabel }}</NuxtLink
      >
      <button
        v-else-if="addLabel"
        type="button"
        class="inline-flex min-h-9 items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        @click="$emit('add')"
      >
        <FeatherIcon :name="getActionIcon('add')" :size="actionIconSizes.button" />{{ addLabel }}
      </button>
      <slot name="actions" />
      <slot />
    </div>
  </header>
</template>
