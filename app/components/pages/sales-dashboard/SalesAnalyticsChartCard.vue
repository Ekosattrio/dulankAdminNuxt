<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const selectedYear = ref('2023')
const showYearDropdown = ref(false)

const yearlyData: Record<string, number[]> = {
  '2023': [25, 30, 18, 15, 22, 20, 30, 20, 22, 18, 15, 20],
  '2022': [20, 24, 28, 18, 25, 32, 22, 28, 24, 20, 18, 25],
  '2021': [16, 20, 22, 18, 20, 24, 19, 21, 25, 22, 19, 21]
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const chartHoverIndex = ref<number | null>(null)

const currentChartPoints = computed(() => {
  const values = yearlyData[selectedYear.value] || yearlyData['2023']
  const width = 640
  const height = 230
  const paddingLeft = 35
  const paddingRight = 15
  const paddingTop = 20
  const paddingBottom = 30

  const innerW = width - paddingLeft - paddingRight
  const innerH = height - paddingTop - paddingBottom
  const maxVal = 60
  const minVal = 10

  const points = values.map((val, i) => {
    const x = paddingLeft + (i / (values.length - 1)) * innerW
    const y = paddingTop + innerH - ((val - minVal) / (maxVal - minVal)) * innerH
    return { x, y, val, month: months[i] }
  })

  let pathD = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x} ${points[i].y}`
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + innerH} L ${points[0].x} ${paddingTop + innerH} Z`

  return { points, pathD, areaD, width, height, paddingLeft, paddingTop, innerW, innerH }
})
</script>

<template>
  <div class="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-7">
    <div class="mb-4 flex items-center justify-between border-b border-gray-100 pb-3.5 dark:border-gray-800">
      <h5 class="text-sm font-bold text-gray-900 sm:text-base dark:text-white">Sales Analytics</h5>
      <div class="relative">
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @click="showYearDropdown = !showYearDropdown"
        >
          <FeatherIcon name="calendar" size="14" class="text-gray-400" />
          <span>{{ selectedYear }}</span>
          <FeatherIcon name="chevron-down" size="12" class="text-gray-400" />
        </button>
        <div
          v-if="showYearDropdown"
          class="absolute right-0 top-full z-30 mt-1 w-28 rounded-lg border border-gray-100 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
        >
          <button
            v-for="y in ['2023', '2022', '2021']"
            :key="y"
            type="button"
            :class="[
              'w-full rounded px-3 py-1.5 text-left text-xs font-medium transition',
              selectedYear === y
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800'
            ]"
            @click="selectedYear = y; showYearDropdown = false"
          >
            {{ y }}
          </button>
        </div>
      </div>
    </div>

    <!-- Area Chart SVG Container -->
    <div class="relative w-full overflow-hidden pt-2" style="min-height: 275px">
      <svg
        viewBox="0 0 640 230"
        class="h-full w-full overflow-visible"
        preserveAspectRatio="none"
        @mouseleave="chartHoverIndex = null"
      >
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FF9F43" stop-opacity="0.38" />
            <stop offset="60%" stop-color="#FF9F43" stop-opacity="0.10" />
            <stop offset="100%" stop-color="#FF9F43" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <g class="text-gray-300 dark:text-gray-800">
          <line
            v-for="i in 6"
            :key="i"
            :x1="currentChartPoints.paddingLeft"
            :y1="currentChartPoints.paddingTop + ((i - 1) * currentChartPoints.innerH) / 5"
            :x2="currentChartPoints.width - 15"
            :y2="currentChartPoints.paddingTop + ((i - 1) * currentChartPoints.innerH) / 5"
            stroke="currentColor"
            stroke-dasharray="3 3"
            stroke-width="1"
          />
        </g>

        <g class="select-none fill-gray-400 text-xs">
          <text
            v-for="i in 6"
            :key="i"
            x="5"
            :y="currentChartPoints.paddingTop + ((i - 1) * currentChartPoints.innerH) / 5 + 4"
          >
            {{ 70 - i * 10 + 'K' }}
          </text>
        </g>

        <path :d="currentChartPoints.areaD" fill="url(#salesGradient)" />

        <path
          :d="currentChartPoints.pathD"
          fill="none"
          stroke="#FF9F43"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <g v-for="(p, idx) in currentChartPoints.points" :key="idx">
          <circle
            :cx="p.x"
            :cy="p.y"
            r="14"
            fill="transparent"
            class="cursor-pointer"
            @mouseenter="chartHoverIndex = idx"
          />
          <circle
            :cx="p.x"
            :cy="p.y"
            :r="chartHoverIndex === idx ? 6 : 3.5"
            fill="#ffffff"
            stroke="#FF9F43"
            stroke-width="2.5"
            class="pointer-events-none transition-all duration-150"
          />
          <line
            v-if="chartHoverIndex === idx"
            :x1="p.x"
            :y1="currentChartPoints.paddingTop"
            :x2="p.x"
            :y2="currentChartPoints.paddingTop + currentChartPoints.innerH"
            stroke="#FF9F43"
            stroke-dasharray="2 2"
            stroke-width="1.5"
            class="pointer-events-none"
          />
        </g>

        <g class="select-none fill-gray-400 text-xs">
          <text
            v-for="(p, idx) in currentChartPoints.points"
            :key="idx"
            :x="p.x"
            :y="currentChartPoints.paddingTop + currentChartPoints.innerH + 18"
            text-anchor="middle"
            :class="{ 'font-bold fill-primary': chartHoverIndex === idx }"
          >
            {{ p.month }}
          </text>
        </g>
      </svg>

      <div
        v-if="chartHoverIndex !== null"
        class="pointer-events-none absolute -top-1 z-30 -translate-x-1/2 rounded-md bg-[#092C4C] px-2.5 py-1 text-xs font-semibold text-white shadow-md transition-all duration-75"
        :style="{ left: `${(currentChartPoints.points[chartHoverIndex].x / currentChartPoints.width) * 100}%` }"
      >
        {{ currentChartPoints.points[chartHoverIndex].month }}: ${{ currentChartPoints.points[chartHoverIndex].val }},000
      </div>
    </div>
  </div>
</template>

