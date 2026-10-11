<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
    {{ message }}
  </div>
</template>
