<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { actionIconSizes, resolveActionIcon, type AppActionIcon } from '~/utils/actionIcons'

const props = defineProps<{
  action?: AppActionIcon
  icon?: string
  /** Canonical label prop. */
  label?: string
  /** Compatibility alias for the pre-merge callers that still pass `tooltip`. */
  tooltip?: string
  to?: RouteLocationRaw
  disabled?: boolean
  /** Compatibility flag for legacy delete actions. */
  danger?: boolean
}>()
defineEmits<{ click: [event: MouseEvent] }>()

const resolvedIcon = computed(() => resolveActionIcon(props.action, props.icon))
const resolvedLabel = computed(() => props.label ?? props.tooltip ?? '')
const style = computed(
  () =>
    'inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400' +
    (props.danger
      ? ' hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:border-rose-800 dark:hover:bg-rose-950/40 dark:hover:text-rose-400'
      : ''),
)
</script>
<template>
  <NuxtLink v-if="to" :to="to" :class="style" :title="resolvedLabel" :aria-label="resolvedLabel"
    ><FeatherIcon :name="resolvedIcon" :size="actionIconSizes.row"
  /></NuxtLink>
  <button
    v-else
    type="button"
    :class="style"
    :title="resolvedLabel"
    :aria-label="resolvedLabel"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <FeatherIcon :name="resolvedIcon" :size="actionIconSizes.row" />
  </button>
</template>
