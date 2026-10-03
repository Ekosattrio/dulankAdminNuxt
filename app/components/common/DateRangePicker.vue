<script setup lang="ts">
import { useId } from 'vue'
import {
  createPresetDateRange,
  dateRangePresetOptions,
  dateRangeToDisplay,
  normalizeDateRange,
  type DateRangePreset,
  type DateRangeValue,
} from '~/composables/useDateRange'
import { tableFilterControlClass } from '~/utils/salesUi'

const props = withDefaults(
  defineProps<{
    modelValue?: DateRangeValue | null
    placeholder?: string
    ariaLabel?: string
    inputClass?: string
    align?: 'start' | 'end'
  }>(),
  {
    modelValue: null,
    placeholder: 'Date',
    ariaLabel: 'Date',
    inputClass: '',
    align: 'start',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: DateRangeValue | null]
  change: [value: DateRangeValue | null]
  clear: []
}>()

const open = ref(false)
const customOpen = ref(false)
const customStart = ref('')
const customEnd = ref('')
const root = ref<HTMLElement | null>(null)
const panelId = useId()

const displayValue = computed(() => dateRangeToDisplay(props.modelValue, props.placeholder))
const normalizedValue = computed(() => normalizeDateRange(props.modelValue))

watch(
  normalizedValue,
  (value) => {
    customStart.value = value?.start || ''
    customEnd.value = value?.end || ''
    customOpen.value = value?.preset === 'custom'
  },
  { immediate: true },
)

function update(value: DateRangeValue | null) {
  emit('update:modelValue', value)
  emit('change', value)
}

function selectPreset(preset: DateRangePreset) {
  if (preset === 'custom') {
    customOpen.value = true
    return
  }

  update(createPresetDateRange(preset))
  open.value = false
}

function applyCustom() {
  const next = normalizeDateRange({
    start: customStart.value,
    end: customEnd.value,
    preset: 'custom',
    label: 'Rentang Kustom',
  })
  update(next)
  open.value = false
}

function clearValue() {
  customStart.value = ''
  customEnd.value = ''
  update(null)
  emit('clear')
  open.value = false
}

function handleOutsideClick(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) open.value = false
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div ref="root" class="relative min-w-0">
    <button
      type="button"
      :aria-label="ariaLabel"
      :aria-controls="panelId"
      :aria-expanded="open"
      :class="[tableFilterControlClass, 'flex h-9 items-center justify-between gap-2 text-left text-xs', inputClass || 'w-48']"
      @click="open = !open"
    >
      <span class="truncate" :class="normalizedValue ? '' : 'text-gray-400'">{{ displayValue }}</span>
      <FeatherIcon name="calendar" :size="14" class="shrink-0 text-gray-400" />
    </button>

    <div
      v-if="open"
      :id="panelId"
      class="absolute z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900"
      :class="align === 'end' ? 'right-0' : 'left-0'"
    >
      <div class="grid gap-1">
        <button
          v-for="option in dateRangePresetOptions"
          :key="option.value"
          type="button"
          class="rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
          :class="props.modelValue?.preset === option.value ? 'bg-primary/10 text-primary' : ''"
          @click="selectPreset(option.value)"
        >
          {{ option.label }}
        </button>
      </div>

      <div v-if="customOpen" class="mt-3 border-t border-gray-100 pt-3 dark:border-gray-800">
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="block space-y-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
            From
            <input v-model="customStart" type="date" :class="salesField" />
          </label>
          <label class="block space-y-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
            To
            <input v-model="customEnd" type="date" :class="salesField" />
          </label>
        </div>
        <div class="mt-3 flex flex-wrap justify-end gap-2">
          <button type="button" :class="salesSecondaryButton" class="!px-3 !py-1.5 text-xs" @click="clearValue">Clear</button>
          <button type="button" :class="salesPrimaryButton" class="!px-3 !py-1.5 text-xs" @click="applyCustom">
            Apply
          </button>
        </div>
      </div>

      <div v-else-if="normalizedValue" class="mt-3 border-t border-gray-100 pt-3 text-right dark:border-gray-800">
        <button type="button" :class="salesSecondaryButton" class="!px-3 !py-1.5 text-xs" @click="clearValue">Clear</button>
      </div>
    </div>
  </div>
</template>
