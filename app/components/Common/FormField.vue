<script setup lang="ts">
// Wrapper input form (label + kontrol) — standarisasi markup form modal.
defineProps<{
  label: string;
  required?: boolean;
  hint?: string;
}>();
</script>

<template>
  <div>
    <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
      {{ label }}<span v-if="required" class="text-rose-500"> *</span>
    </label>
    <slot />
    <p v-if="hint" class="mt-1 text-xs text-gray-400">{{ hint }}</p>
  </div>
</template>