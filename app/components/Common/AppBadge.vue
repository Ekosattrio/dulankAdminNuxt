<script setup lang="ts">
type BadgeTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary'

const props = withDefaults(defineProps<{
  label?: string
  tone?: BadgeTone
}>(), {
  label: '',
  tone: undefined,
})

const normalized = computed(() => props.label.trim().toLowerCase())
const resolvedTone = computed<BadgeTone>(() => {
  if (props.tone) return props.tone
  if (['active', 'paid', 'complete', 'completed', 'received', 'success', 'successful', 'berhasil', 'published', 'publish', 'refunded', 'yes', 'sent', 'approved', 'open'].includes(normalized.value)) return 'success'
  if (['inactive', 'unpaid', 'rejected', 'cancel', 'cancelled', 'canceled', 'closed', 'failed', 'gagal', 'delete', 'deleted', 'deactive', 'disabled', 'resign', 'no', 'high'].includes(normalized.value)) return 'danger'
  if (['pending', 'partial', 'scheduled', 'waiting', 'draft', 'ordered', 'processing', 'on process', 'medium'].includes(normalized.value)) return 'warning'
  if (['private', 'info', 'new', 'low'].includes(normalized.value)) return 'info'
  return 'neutral'
})

const toneClass: Record<BadgeTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400',
  danger: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
  info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-400',
  primary: 'border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/15',
  neutral: 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
}
</script>

<template>
  <span
    data-app-badge
    class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium leading-4"
    :class="toneClass[resolvedTone]"
  >
    <slot>{{ label }}</slot>
  </span>
</template>
