<script setup lang="ts">
// Select filter (biasanya status) — blok yang diulang di banyak halaman list.
const model = defineModel<string>({ default: "" });

withDefaults(
  defineProps<{
    options: { value: string; label: string }[];
    allLabel?: string;
  }>(),
  {
    allLabel: "Status: All",
  },
);
</script>

<template>
  <div class="flex items-center gap-3">
    <select
      v-model="model"
      class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
    >
      <option value="">{{ allLabel }}</option>
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
  </div>
</template>