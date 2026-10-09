<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const isHeaderCollapsed = ref(false)
const showDatepicker = ref(false)
const selectedDateRange = ref('7hari')
const dateRangeLabel = ref('01/09/2026 - 07/09/2026')

const datePresets = [
  { id: 'kemarin', label: 'Kemarin', range: '06/09/2026 - 06/09/2026' },
  { id: '7hari', label: '7 Hari Terakhir', range: '01/09/2026 - 07/09/2026' },
  { id: 'bulanIni', label: 'Bulan Ini', range: '01/09/2026 - 30/09/2026' },
  { id: 'bulanLalu', label: 'Bulan Lalu', range: '01/08/2026 - 31/08/2026' },
  { id: 'tahunLalu', label: 'Tahun Lalu', range: '01/01/2025 - 31/12/2025' },
  { id: 'kustom', label: 'Rentang Kustom', range: 'DD/MM/YYYY - DD/MM/YYYY' }
]

const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'rangeChanged', label: string): void
}>()

function selectDateRange(preset: (typeof datePresets)[0]) {
  selectedDateRange.value = preset.id
  dateRangeLabel.value = preset.range
  showDatepicker.value = false
  emit('rangeChanged', preset.label)
}
</script>

<template>
  <div class="welcome mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="welcome-text flex flex-wrap items-center gap-1.5 sm:gap-2">
        <h3 class="flex items-center text-lg font-bold text-[#092C4C] sm:text-xl dark:text-white">
          <img src="/assets/img/icons/hi.svg" alt="hi" class="me-2 inline-block h-6 w-6" />
          Hi John Smilga,
        </h3>
        <span
          v-show="!isHeaderCollapsed"
          class="text-xs font-semibold text-gray-500 transition-opacity sm:text-sm dark:text-gray-400"
        >
          here's what's happening with your store today.
        </span>
      </div>

      <div class="flex items-center gap-2 self-start sm:self-auto">
        <!-- Date Range Selector -->
        <div class="relative">
          <button
            type="button"
            class="flex min-w-[210px] items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @click="showDatepicker = !showDatepicker"
          >
            <div class="flex items-center gap-2">
              <FeatherIcon name="calendar" size="14" class="text-gray-400" />
              <span>{{ dateRangeLabel }}</span>
            </div>
            <FeatherIcon name="chevron-down" size="14" class="text-gray-400" />
          </button>

          <div
            v-if="showDatepicker"
            class="absolute right-0 top-full z-40 mt-1 w-56 rounded-lg border border-gray-100 bg-white p-1.5 shadow-xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div class="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">Pilih Rentang Waktu</div>
            <button
              v-for="preset in datePresets"
              :key="preset.id"
              type="button"
              :class="[
                'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-medium transition',
                selectedDateRange === preset.id
                  ? 'bg-primary/10 font-bold text-primary dark:bg-primary/20'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
              ]"
              @click="selectDateRange(preset)"
            >
              <span>{{ preset.label }}</span>
              <FeatherIcon v-if="selectedDateRange === preset.id" name="check" size="12" />
            </button>
          </div>
        </div>

        <!-- Refresh Button -->
        <button
          type="button"
          class="hidden h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-primary hover:bg-primary hover:text-white md:inline-flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          title="Refresh"
          @click="emit('refresh')"
        >
          <FeatherIcon name="rotate-ccw" size="16" />
        </button>

        <!-- Collapse Header Button -->
        <button
          type="button"
          class="hidden h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-primary hover:bg-primary hover:text-white lg:inline-flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          title="Collapse"
          @click="isHeaderCollapsed = !isHeaderCollapsed"
        >
          <FeatherIcon :name="isHeaderCollapsed ? 'chevron-down' : 'chevron-up'" size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

