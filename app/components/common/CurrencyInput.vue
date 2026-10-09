<script setup lang="ts">
import { formatMoney, parseMoney } from '~/utils/currency'

defineOptions({ inheritAttrs: false })

interface Props {
  /** Nilai numerik asli (v-model) */
  modelValue?: number | string | null
  /** Justifikasi posisi teks uang: 'right' (kanan) atau 'left' (kiri) */
  align?: 'left' | 'right'
  /** Prefix mata uang, contoh: 'Rp' atau '' (kosongkan jika tanpa prefix) */
  prefix?: string
  /** Placeholder saat kosong */
  placeholder?: string
  /** Status disabled */
  disabled?: boolean
  /** Status readonly */
  readonly?: boolean
  /** Nilai minimum */
  min?: number
  /** Nilai maksimum */
  max?: number
  /** Ukuran tinggi kontrol: 'sm' (h-7) atau 'md' (h-9 standar) */
  size?: 'sm' | 'md'
  /** Kelas tambahan untuk input */
  inputClass?: string
  /** Pemisah ribuan: koma (,) atau titik (.) */
  thousandSeparator?: ',' | '.'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  align: 'right',
  prefix: '',
  placeholder: '0',
  disabled: false,
  readonly: false,
  min: undefined,
  max: undefined,
  size: 'md',
  inputClass: '',
  thousandSeparator: '.'
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
  (e: 'change', val: number): void
  (e: 'focus', evt: FocusEvent): void
  (e: 'blur', evt: FocusEvent): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const displayValue = ref('')

// Sinkronisasi displayValue saat modelValue dari parent berubah
watch(
  () => props.modelValue,
  (newVal) => {
    const numeric = typeof newVal === 'number' ? newVal : parseMoney(newVal)
    const formatted = numeric === 0 && props.placeholder ? '' : formatMoney(numeric, { prefix: '', thousandSeparator: props.thousandSeparator })
    const isFocused = typeof document !== 'undefined' && document.activeElement === inputRef.value
    if (formatted !== displayValue.value && !isFocused) {
      displayValue.value = formatted
    }
  },
  { immediate: true }
)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const rawInput = target.value

  // Hitung jumlah digit sebelum kursor untuk menjaga posisi kursor
  const cursorPosition = target.selectionStart || 0
  const digitsBeforeCursor = rawInput.slice(0, cursorPosition).replace(/\D/g, '').length

  // Parse ke angka murni
  let numeric = parseMoney(rawInput)

  // Batasan min/max jika ada
  if (props.min !== undefined && numeric < props.min) numeric = props.min
  if (props.max !== undefined && numeric > props.max) numeric = props.max

  // Format ulang teks input
  const formatted = numeric === 0 && !rawInput ? '' : formatMoney(numeric, { prefix: '', thousandSeparator: props.thousandSeparator })
  displayValue.value = formatted
  target.value = formatted

  // Kembalikan posisi kursor secara presisi setelah re-format
  nextTick(() => {
    if (!target) return
    let newCursor = 0
    let count = 0
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) count++
      if (count === digitsBeforeCursor) {
        newCursor = i + 1
        break
      }
    }
    if (newCursor === 0 && digitsBeforeCursor === 0) newCursor = 0
    else if (newCursor === 0) newCursor = formatted.length

    target.setSelectionRange(newCursor, newCursor)
  })

  emit('update:modelValue', numeric)
}

function onBlur(evt: FocusEvent) {
  // Format rapi saat blur
  const numeric = parseMoney(displayValue.value)
  displayValue.value = numeric === 0 && props.placeholder ? '' : formatMoney(numeric, { prefix: '', thousandSeparator: props.thousandSeparator })
  emit('change', numeric)
  emit('blur', evt)
}

function onFocus(evt: FocusEvent) {
  emit('focus', evt)
}
</script>

<template>
  <div class="relative flex items-center w-full">
    <!-- Prefix Badge (contoh: Rp) jika diisi -->
    <span
      v-if="prefix"
      :class="[
        'pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-xs font-semibold text-gray-500 dark:text-gray-400 select-none',
        disabled ? 'opacity-60' : ''
      ]"
    >
      {{ prefix }}
    </span>

    <!-- Input text dengan separator ribuan & justifikasi kiri/kanan -->
    <input
      v-bind="$attrs"
      ref="inputRef"
      type="text"
      inputmode="numeric"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="[
        // Base styling standar light-modern h-9
        size === 'sm' ? 'h-7 text-xs' : 'h-9 text-sm',
        'w-full rounded-md border border-gray-200 bg-white font-mono tabular-nums shadow-sm outline-none transition-colors dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100',
        'focus:border-primary focus:ring-2 focus:ring-primary/10',
        'disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400',
        // Padding jika ada prefix
        prefix ? 'ps-9' : 'ps-3',
        'pe-3',
        // Justifikasi teks: Kanan (right) atau Kiri (left)
        align === 'right' ? 'text-right' : 'text-left',
        inputClass
      ]"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
    />
  </div>
</template>
