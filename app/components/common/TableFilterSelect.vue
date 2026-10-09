<script setup lang="ts">
import { tableFilterControlClass } from "~/utils/salesUi";

export interface FilterOption {
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    options: (string | FilterOption)[];
    placeholder?: string;
    ariaLabel?: string;
    widthClass?: string;
  }>(),
  {
    modelValue: "",
    placeholder: "Filter",
    ariaLabel: "",
    widthClass: "w-auto",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  emit("update:modelValue", value);
  emit("change", value);
}
</script>

<template>
  <select
    :value="modelValue"
    :aria-label="ariaLabel || placeholder"
    :class="[tableFilterControlClass, widthClass]"
    @change="onChange"
  >
    <option value="">{{ placeholder }}</option>
    <option
      v-for="opt in options"
      :key="typeof opt === 'string' ? opt : opt.value"
      :value="typeof opt === 'string' ? opt : opt.value"
    >
      {{ typeof opt === "string" ? opt : opt.label }}
    </option>
  </select>
</template>
