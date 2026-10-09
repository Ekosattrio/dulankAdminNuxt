<script setup lang="ts">
import { useFormatters } from '~/composables/useFormatters'

const props = withDefaults(
  defineProps<{
    modelValue: number | string
    placeholder?: string
    prefix?: string
    disabled?: boolean
    id?: string
    class?: string
  }>(),
  {
    placeholder: '0',
    prefix: '',
    disabled: false,
    id: undefined,
    class: ''
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const { formatNumber, parseNumber } = useFormatters()

const displayValue = computed(() => {
  return formatNumber(props.modelValue)
})

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const rawNum = parseNumber(target.value)
  emit('update:modelValue', rawNum)
  target.value = formatNumber(rawNum)
}
</script>

<template>
  <div class="relative flex items-center">
    <span
      v-if="prefix"
      class="inline-flex items-center px-3 text-xs text-gray-500 bg-gray-100 border border-e-0 border-gray-200 rounded-s-lg h-9 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
    >
      {{ prefix }}
    </span>
    <input
      :id="id"
      type="text"
      inputmode="numeric"
      :value="displayValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :class="[
        'w-full h-9 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200',
        prefix ? 'rounded-s-none' : '',
        props.class
      ]"
      @input="handleInput"
    />
  </div>
</template>

