<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    compact?: boolean
  }>(),
  {
    min: 0,
    max: 999999,
    step: 1,
    disabled: false,
    compact: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

function clamp(val: number): number {
  if (isNaN(val)) return props.min
  return Math.min(Math.max(val, props.min), props.max)
}

function decrement() {
  if (props.disabled) return
  const next = clamp(Number(props.modelValue || 0) - props.step)
  emit('update:modelValue', next)
  emit('change', next)
}

function increment() {
  if (props.disabled) return
  const next = clamp(Number(props.modelValue || 0) + props.step)
  emit('update:modelValue', next)
  emit('change', next)
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const raw = parseInt(target.value, 10)
  const next = clamp(isNaN(raw) ? props.min : raw)
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div
    class="inline-flex items-center rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
    :class="[
      compact ? 'h-7' : 'h-8',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
  >
    <button
      type="button"
      :disabled="disabled || modelValue <= min"
      class="flex h-full w-7 items-center justify-center text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      aria-label="Decrease quantity"
      @click="decrement"
    >
      <FeatherIcon name="minus" :size="12" />
    </button>

    <input
      type="number"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      class="w-12 bg-transparent text-center text-xs font-semibold text-gray-800 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-gray-200"
      @input="onInput"
    />

    <button
      type="button"
      :disabled="disabled || modelValue >= max"
      class="flex h-full w-7 items-center justify-center text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      aria-label="Increase quantity"
      @click="increment"
    >
      <FeatherIcon name="plus" :size="12" />
    </button>
  </div>
</template>
