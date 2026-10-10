<script setup lang="ts">
const props = defineProps<{ status: string }>()
const color = computed(() =>
  ['Paid', 'Complete', 'Completed', 'Received', 'Active', 'Success', 'Published'].includes(props.status)
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800'
    : ['Unpaid', 'Rejected', 'Cancelled', 'Inactive', 'Closed', 'Failed'].includes(props.status)
      ? 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800'
      : 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800',
)
</script>
<template>
  <span class="inline-flex rounded px-2 py-1 text-xs font-medium ring-1 ring-inset" :class="color">{{
    status
  }}</span>
</template>
