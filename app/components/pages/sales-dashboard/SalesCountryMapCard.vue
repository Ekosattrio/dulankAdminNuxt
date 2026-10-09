<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const selectedCountryPeriod = ref('This Week')
const showCountryDropdown = ref(false)

interface CountryData {
  id: string
  name: string
  sales: string
  percentage: number
  x: number
  y: number
}

const countryMarkers = ref<CountryData[]>([
  { id: 'US', name: 'United States', sales: '1,000,000 Sales', percentage: 55, x: 25, y: 38 },
  { id: 'UK', name: 'United Kingdom', sales: '5,467 Sales', percentage: 8, x: 47, y: 28 },
  { id: 'RU', name: 'Russia', sales: '5,488 Sales', percentage: 6, x: 68, y: 24 },
  { id: 'CN', name: 'China', sales: '7,777 Sales', percentage: 10, x: 74, y: 44 },
  { id: 'IN', name: 'India', sales: '98,765 Sales', percentage: 18, x: 67, y: 49 },
  { id: 'UAE', name: 'UAE', sales: '98,654 Sales', percentage: 14, x: 59, y: 47 },
  { id: 'SA', name: 'Saudi Arabia', sales: '54,678 Sales', percentage: 12, x: 57, y: 49 },
  { id: 'AFR', name: 'Africa', sales: '3,455 Sales', percentage: 5, x: 51, y: 62 }
])

const hoveredCountry = ref<CountryData | null>(null)
</script>

<template>
  <div class="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-5">
    <div class="mb-4 flex items-center justify-between border-b border-gray-100 pb-3.5 dark:border-gray-800">
      <h5 class="text-sm font-bold text-gray-900 sm:text-base dark:text-white">Sales by Countries</h5>
      <div class="relative">
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @click="showCountryDropdown = !showCountryDropdown"
        >
          <span>{{ selectedCountryPeriod }}</span>
          <FeatherIcon name="chevron-down" size="12" class="text-gray-400" />
        </button>
        <div
          v-if="showCountryDropdown"
          class="absolute right-0 top-full z-30 mt-1 w-32 rounded-lg border border-gray-100 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
        >
          <button
            v-for="period in ['This Week', 'This Month', 'This Year']"
            :key="period"
            type="button"
            :class="[
              'w-full rounded px-3 py-1.5 text-left text-xs font-medium transition',
              selectedCountryPeriod === period
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800'
            ]"
            @click="selectedCountryPeriod = period; showCountryDropdown = false"
          >
            {{ period }}
          </button>
        </div>
      </div>
    </div>

    <!-- World Map Canvas Vector Simulation -->
    <div class="relative flex-1 overflow-hidden rounded-lg bg-gray-50/50 p-2 dark:bg-gray-800/30" style="min-height: 245px">
      <svg viewBox="0 0 800 420" class="h-full w-full">
        <g fill="#ECECEC" class="dark:fill-gray-700" stroke="#E2E8F0" stroke-width="0.5">
          <path d="M120,70 L240,65 L270,110 L250,150 L200,160 L180,210 L160,230 L140,210 L110,170 L90,130 L110,90 Z" />
          <path d="M290,40 L340,35 L360,65 L320,80 L290,60 Z" />
          <path d="M210,235 L260,245 L290,285 L270,365 L240,390 L220,330 L200,270 Z" />
          <path d="M370,80 L440,75 L460,110 L440,140 L390,145 L370,120 Z" />
          <path d="M380,160 L450,165 L480,225 L460,310 L420,335 L380,260 L360,200 Z" />
          <path d="M470,60 L680,65 L710,130 L660,180 L590,195 L550,160 L490,160 L460,110 Z" />
          <path d="M620,270 L700,265 L720,320 L680,350 L630,330 Z" />
        </g>

        <g v-for="marker in countryMarkers" :key="marker.id">
          <circle
            :cx="marker.x * 8"
            :cy="marker.y * 4.2"
            r="8"
            class="animate-ping text-primary opacity-40"
            fill="currentColor"
          />
          <circle
            :cx="marker.x * 8"
            :cy="marker.y * 4.2"
            r="5"
            class="cursor-pointer transition-all duration-200"
            :fill="hoveredCountry?.id === marker.id ? '#FF9F43' : '#092C4C'"
            stroke="#ffffff"
            stroke-width="1.5"
            @mouseenter="hoveredCountry = marker"
            @mouseleave="hoveredCountry = null"
          />
        </g>
      </svg>

      <div
        v-if="hoveredCountry"
        class="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-full rounded-md border border-gray-100 bg-white px-3 py-1.5 text-center shadow-lg dark:border-gray-700 dark:bg-gray-900"
        :style="{ left: `${hoveredCountry.x}%`, top: `${hoveredCountry.y - 4}%` }"
      >
        <h6 class="text-xs font-bold text-gray-900 dark:text-white">{{ hoveredCountry.name }}</h6>
        <p class="text-[11px] font-semibold text-primary">{{ hoveredCountry.sales }}</p>
      </div>
    </div>

    <p class="sales-range mt-4 flex items-center text-xs text-gray-500 sm:text-sm dark:text-gray-400">
      <span class="inline-flex items-center font-semibold text-emerald-600">
        <FeatherIcon name="chevron-up" size="16" class="me-0.5" />
        48%&nbsp;
      </span>
      increase compare to last week
    </p>
  </div>
</template>

