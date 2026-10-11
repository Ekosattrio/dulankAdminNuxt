<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]
  options: string[]
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const selected = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>

<template>
  <div class="min-w-48 space-y-2">
    <div v-if="modelValue.length" class="flex flex-wrap gap-1" :aria-label="`${label} selected values`">
      <span
        v-for="value in modelValue"
        :key="value"
        class="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
      >
        {{ value }}
      </span>
    </div>
    <select
      multiple
      v-model="selected"
      :aria-label="label"
      class="min-h-24 w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
    >
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
    <p class="text-xs text-gray-500">Pilih lebih dari satu opsi dengan Ctrl/Cmd + klik.</p>
  </div>
</template>
