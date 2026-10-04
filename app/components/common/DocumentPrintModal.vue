<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import type { DateRangeValue } from '~/composables/useDateRange'
import { printDocument, type PrintColumn, type PrintDocumentConfig } from '~/utils/documentPrinter'

interface Props {
  open: boolean
  title: string
  subtitle?: string
  columns: PrintColumn[]
  items: Record<string, any>[]
  currentPageItems?: Record<string, any>[]
  dateField?: string
  initialDateRange?: DateRangeValue | null
  defaultAction?: 'print' | 'pdf'
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: 'Laporan Data Sistem Administrasi Dulank',
  currentPageItems: () => [],
  dateField: 'date',
  initialDateRange: null,
  defaultAction: 'print'
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'printed', config: PrintDocumentConfig): void
}>()

// State
const printScope = ref<'all' | 'current' | 'date-range'>('all')
const customDateRange = ref<DateRangeValue | null>(props.initialDateRange)
const includeLetterhead = ref(true)
const includeSignatures = ref(true)
const includeTimestamp = ref(true)
const paperOrientation = ref<'landscape' | 'portrait'>('landscape')

// Auto set orientation based on column count
watch(
  () => props.columns,
  (cols) => {
    if (cols && cols.length <= 5) {
      paperOrientation.value = 'portrait'
    } else {
      paperOrientation.value = 'landscape'
    }
  },
  { immediate: true }
)

// Computed filtered items to print
const itemsToPrint = computed(() => {
  if (printScope.value === 'current' && props.currentPageItems && props.currentPageItems.length > 0) {
    return props.currentPageItems
  }

  if (printScope.value === 'date-range' && customDateRange.value) {
    const { start, end } = customDateRange.value
    if (!start && !end) return props.items

    return props.items.filter((item) => {
      const itemDateStr = item[props.dateField] || item.date || item.orderDate || item.createdDate || item.salesDate
      if (!itemDateStr) return true

      // Try DD/MM/YYYY or YYYY-MM-DD
      let itemTime = 0
      if (typeof itemDateStr === 'string' && itemDateStr.includes('/')) {
        const parts = itemDateStr.split('/')
        if (parts.length === 3) {
          // DD/MM/YYYY
          itemTime = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime()
        }
      } else {
        itemTime = new Date(itemDateStr).getTime()
      }

      if (isNaN(itemTime)) return true

      if (start) {
        const startTime = new Date(start).getTime()
        if (itemTime < startTime) return false
      }
      if (end) {
        const endTime = new Date(end).setHours(23, 59, 59, 999)
        if (itemTime > endTime) return false
      }
      return true
    })
  }

  return props.items
})

const periodLabel = computed(() => {
  if (printScope.value === 'current') {
    return 'Halaman Ini'
  }
  if (printScope.value === 'date-range' && customDateRange.value) {
    const s = customDateRange.value.start || ''
    const e = customDateRange.value.end || ''
    if (s && e) return `${s} s/d ${e}`
    if (s) return `Mulai ${s}`
    if (e) return `Sampai ${e}`
  }
  return 'Semua Data Terfilter'
})

const printableColumns = computed(() => {
  return props.columns.filter((c) => c.key !== 'actions' && c.key !== 'action')
})

function handleExecutePrint(action: 'print' | 'pdf' = 'print') {
  const config: PrintDocumentConfig = {
    title: props.title,
    subtitle: props.subtitle,
    period: periodLabel.value,
    columns: printableColumns.value,
    rows: itemsToPrint.value,
    orientation: paperOrientation.value,
    includeLetterhead: includeLetterhead.value,
    includeSignatures: includeSignatures.value,
    includeTimestamp: includeTimestamp.value
  }

  printDocument(config)
  emit('printed', config)
  emit('close')
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Cetak & Ekspor Dokumen Laporan"
    size="lg"
    @close="$emit('close')"
  >
    <div class="space-y-5 text-xs text-gray-700 dark:text-gray-300">
      <!-- Info Header -->
      <div class="rounded-lg border border-primary-100 bg-primary-50/50 p-3.5 dark:border-primary-900/30 dark:bg-primary-950/20 flex items-start gap-3">
        <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
          <FeatherIcon name="printer" :size="16" />
        </div>
        <div>
          <h4 class="font-bold text-gray-900 dark:text-white text-sm">{{ title }}</h4>
          <p class="text-gray-600 dark:text-gray-400 mt-0.5">
            Pilih cakupan data, format kop surat resmi, dan kolom tanda tangan untuk hasil cetak A4 yang terstandarisasi.
          </p>
        </div>
      </div>

      <!-- Scope Selection -->
      <div class="space-y-2">
        <label class="font-semibold text-gray-900 dark:text-gray-100 block">
          Cakupan Data yang Dicetak:
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <!-- Option: All Data -->
          <label
            :class="[
              'cursor-pointer rounded-lg border p-3 flex flex-col justify-between gap-2 transition-all',
              printScope === 'all'
                ? 'border-primary-500 bg-primary-50/30 ring-1 ring-primary-500 dark:border-primary-600 dark:bg-primary-950/30'
                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-gray-900 dark:text-white">Semua Data</span>
              <input
                v-model="printScope"
                type="radio"
                value="all"
                class="text-primary-600 focus:ring-primary-500 h-4 w-4"
              />
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              Total {{ items.length }} data terfilter saat ini.
            </p>
          </label>

          <!-- Option: Current Page -->
          <label
            :class="[
              'cursor-pointer rounded-lg border p-3 flex flex-col justify-between gap-2 transition-all',
              printScope === 'current'
                ? 'border-primary-500 bg-primary-50/30 ring-1 ring-primary-500 dark:border-primary-600 dark:bg-primary-950/30'
                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-gray-900 dark:text-white">Halaman Ini</span>
              <input
                v-model="printScope"
                type="radio"
                value="current"
                class="text-primary-600 focus:ring-primary-500 h-4 w-4"
              />
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              {{ (currentPageItems && currentPageItems.length) || items.length }} data di tampilan halaman aktif.
            </p>
          </label>

          <!-- Option: Custom Date Range -->
          <label
            :class="[
              'cursor-pointer rounded-lg border p-3 flex flex-col justify-between gap-2 transition-all',
              printScope === 'date-range'
                ? 'border-primary-500 bg-primary-50/30 ring-1 ring-primary-500 dark:border-primary-600 dark:bg-primary-950/30'
                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-gray-900 dark:text-white">Rentang Tanggal</span>
              <input
                v-model="printScope"
                type="radio"
                value="date-range"
                class="text-primary-600 focus:ring-primary-500 h-4 w-4"
              />
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              Saring berdasarkan rentang tanggal tertentu.
            </p>
          </label>
        </div>

        <!-- Conditional Date Range Picker -->
        <div v-if="printScope === 'date-range'" class="pt-2">
          <label class="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
            Pilih Rentang Waktu Cetak:
          </label>
          <DateRangePicker
            v-model="customDateRange"
            placeholder="Pilih rentang tanggal..."
            input-class="w-full h-9"
          />
        </div>
      </div>

      <!-- Document Options (Kop Surat, TTD, Orientation) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <!-- Switches -->
        <div class="space-y-3 bg-gray-50/70 dark:bg-gray-800/50 p-3.5 rounded-lg border border-gray-200 dark:border-gray-700">
          <span class="font-semibold text-gray-900 dark:text-white block mb-1">Elemen Dokumen:</span>
          
          <label class="flex items-center gap-2.5 cursor-pointer">
            <input
              v-model="includeLetterhead"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
            />
            <span class="text-xs">Sertakan <strong>Kop Surat Resmi</strong> (PT. Dulank Semesta Cida)</span>
          </label>

          <label class="flex items-center gap-2.5 cursor-pointer">
            <input
              v-model="includeSignatures"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
            />
            <span class="text-xs">Sertakan <strong>Kolom Tanda Tangan (TTD)</strong></span>
          </label>

          <label class="flex items-center gap-2.5 cursor-pointer">
            <input
              v-model="includeTimestamp"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
            />
            <span class="text-xs">Sertakan Waktu & Tanggal Cetak</span>
          </label>
        </div>

        <!-- Orientation -->
        <div class="space-y-2 bg-gray-50/70 dark:bg-gray-800/50 p-3.5 rounded-lg border border-gray-200 dark:border-gray-700">
          <span class="font-semibold text-gray-900 dark:text-white block mb-1">Orientasi Kertas A4:</span>
          
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="paperOrientation"
                type="radio"
                value="landscape"
                class="text-primary-600 focus:ring-primary-500 h-4 w-4"
              />
              <span class="text-xs"><strong>Landscape (Mendatar)</strong> - Direkomendasikan untuk tabel lebar</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="paperOrientation"
                type="radio"
                value="portrait"
                class="text-primary-600 focus:ring-primary-500 h-4 w-4"
              />
              <span class="text-xs"><strong>Portrait (Tegak)</strong> - Cocok untuk data dengan sedikit kolom</span>
            </label>
          </div>

          <div class="pt-2 border-t border-gray-200 dark:border-gray-700 text-[11px] text-gray-500 dark:text-gray-400">
            Kolom dicetak: <strong>{{ printableColumns.length }} kolom</strong> (Kolom aksi otomatis ditiadakan).
          </div>
        </div>
      </div>

      <!-- Preview Summary Box -->
      <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-500 dark:text-gray-400">Jumlah Baris Dicetak:</span>
          <span class="font-bold text-gray-900 dark:text-white font-mono">{{ itemsToPrint.length }} Baris</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-500 dark:text-gray-400">Periode Laporan:</span>
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ periodLabel }}</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-500 dark:text-gray-400">Format Kertas:</span>
          <span class="font-medium text-gray-800 dark:text-gray-200">A4 {{ paperOrientation === 'landscape' ? 'Landscape (Mendatar)' : 'Portrait (Tegak)' }}</span>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-gray-200 dark:border-gray-750">
        <button
          type="button"
          class="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          @click="$emit('close')"
        >
          Batal
        </button>

        <button
          type="button"
          class="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/40 flex items-center gap-1.5 transition-colors"
          @click="handleExecutePrint('pdf')"
        >
          <FeatherIcon name="file-text" :size="14" />
          <span>Simpan sebagai PDF</span>
        </button>

        <button
          type="button"
          class="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover flex items-center gap-1.5 shadow-sm transition-colors"
          @click="handleExecutePrint('print')"
        >
          <FeatherIcon name="printer" :size="14" />
          <span>Cetak Dokumen</span>
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
