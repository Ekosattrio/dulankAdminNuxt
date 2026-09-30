<script setup lang="ts">
// Toggle switch konsisten (pola yang sebelumnya diulang inline di banyak modal).
const model = defineModel<boolean>({ default: false });

withDefaults(
  defineProps<{
    label?: string;
    description?: string;
    disabled?: boolean;
  }>(),
  {
    label: undefined,
    description: undefined,
    disabled: false,
  },
);
</script>

<template>
  <div class="flex items-center justify-between gap-3">
    <div>
      <span class="block text-xs font-semibold text-gray-700 dark:text-gray-300">{{ label }}</span>
      <span v-if="description" class="mt-0.5 block text-[11px] text-gray-400">{{ description }}</span>
    </div>
    <button
      type="button"
      :disabled="disabled"
      :class="[
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        model ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
      ]"
      @click="model = !model"
    >
      <span
        :class="[
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          model ? 'translate-x-5' : 'translate-x-0',
        ]"
      />
    </button>
  </div>
</template>