<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

const props = defineProps<{ modelValue: string[]; options: string[]; label: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const open = ref(false)
const query = ref('')
const root = ref<HTMLElement | null>(null)
const selectedValues = ref<string[]>([...props.modelValue])
watch(() => props.modelValue, (values) => {
  selectedValues.value = [...values]
}, { deep: true })
const filteredOptions = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return needle ? props.options.filter(option => option.toLowerCase().includes(needle)) : props.options
})
function toggle(option: string) {
  selectedValues.value = selectedValues.value.includes(option)
    ? selectedValues.value.filter(value => value !== option)
    : [...selectedValues.value, option]
  emit('update:modelValue', [...selectedValues.value])
}
function remove(option: string) {
  selectedValues.value = selectedValues.value.filter(value => value !== option)
  emit('update:modelValue', [...selectedValues.value])
}
function handleOutside(event: MouseEvent) { if (root.value && !root.value.contains(event.target as Node)) open.value = false }
onMounted(() => document.addEventListener('click', handleOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleOutside))
</script>

<template>
  <div ref="root" class="configuration-multi-select relative min-w-56" @click.stop>
    <div class="flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-[#ff9f43] bg-white px-2.5 py-1 text-sm shadow-sm focus-within:ring-2 focus-within:ring-[#ff9f43]/15 dark:bg-gray-900" :aria-label="label" @click="open = true">
      <span v-for="value in selectedValues" :key="value" class="inline-flex items-center gap-1 rounded border border-[#ff9f43]/30 bg-[#ff9f43]/10 px-2 py-0.5 text-xs font-semibold text-[#c8701a] dark:bg-[#ff9f43]/20 dark:text-[#ffb766]">
        <span>{{ value }}</span>
        <button type="button" class="rounded p-0.5 text-[#c8701a]/70 hover:text-red-500" :aria-label="`Remove ${value}`" @click.stop="remove(value)"><FeatherIcon name="x" :size="10" /></button>
      </span>
      <input v-model="query" type="text" class="h-6 min-w-16 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400" :placeholder="selectedValues.length ? '' : 'Select option'" :aria-label="`${label} search`" @focus="open = true" />
      <button type="button" class="shrink-0 p-0.5 text-gray-400 hover:text-gray-600" :aria-label="open ? 'Close options' : 'Open options'" @click="open = !open"><FeatherIcon :name="open ? 'chevron-up' : 'chevron-down'" :size="14" /></button>
    </div>
    <div v-if="open" class="absolute left-0 top-[calc(100%+4px)] z-50 max-h-52 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <button v-for="option in filteredOptions" :key="option" type="button" class="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-primary/10 hover:text-primary dark:text-gray-300" @click="toggle(option)">
        <span>{{ option }}</span><FeatherIcon v-if="selectedValues.includes(option)" name="check" :size="14" class="text-primary" />
      </button>
      <p v-if="!filteredOptions.length" class="px-3 py-2 text-center text-sm text-gray-400">No options found</p>
    </div>
  </div>
</template>
