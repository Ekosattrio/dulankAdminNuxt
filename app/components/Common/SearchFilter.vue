<script setup lang="ts">
// Input pencarian dengan ikon — blok yang sama diulang di ~100 halaman.
const model = defineModel<string>({ default: "" });

defineProps<{
  placeholder?: string;
}>();
</script>

<template>
  <div class="relative w-64">
    <input
      v-model="model"
      type="text"
      :placeholder="placeholder"
      class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 pe-8 text-sm text-gray-800 placeholder-gray-400 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
    />
    <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400">
      <CommonFeatherIcon name="search" size="16" />
    </span>
  </div>
</template>