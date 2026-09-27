<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
defineProps<{ icon: string; label: string; to?: RouteLocationRaw; disabled?: boolean }>()
defineEmits<{ click: [event: MouseEvent] }>()
const style =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400'
</script>
<template>
  <NuxtLink v-if="to" :to="to" :class="style" :title="label" :aria-label="label"
    ><FeatherIcon :name="icon" :size="14"
  /></NuxtLink>
  <button
    v-else
    type="button"
    :class="style"
    :title="label"
    :aria-label="label"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <FeatherIcon :name="icon" :size="14" />
  </button>
</template>
