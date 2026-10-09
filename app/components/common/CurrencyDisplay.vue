<script setup lang="ts">
import { formatMoney } from '~/utils/currency'

interface Props {
  /** Nilai uang (number atau string) */
  value?: number | string | null
  /** Justifikasi posisi: 'right' (kanan) atau 'left' (kiri) atau 'center' */
  align?: 'left' | 'right' | 'center'
  /** Prefix mata uang, contoh: 'Rp ' atau 'Rp' atau '' (default: 'Rp ') */
  prefix?: string
  /** Suffix mata uang, contoh: ',-' */
  suffix?: string
  /** Apakah teks ditebalkan */
  bold?: boolean
  /** Menggunakan font monospaced tabular nums (default: true) */
  fontMono?: boolean
  /** Nilai pengganti jika null / 0 / invalid */
  fallback?: string
  /** Kelas styling tambahan */
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  align: 'right',
  prefix: 'Rp ',
  suffix: '',
  bold: false,
  fontMono: true,
  fallback: '0',
  customClass: ''
})

const formattedText = computed(() => {
  return formatMoney(props.value, {
    prefix: props.prefix,
    suffix: props.suffix,
    fallback: props.fallback
  })
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center select-text',
      // Justifikasi Kanan / Kiri
      align === 'right' ? 'justify-end text-right' : align === 'left' ? 'justify-start text-left' : 'justify-center text-center',
      fontMono ? 'font-mono tabular-nums' : '',
      bold ? 'font-bold' : '',
      customClass
    ]"
  >
    {{ formattedText }}
  </span>
</template>
