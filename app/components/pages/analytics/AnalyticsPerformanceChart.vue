<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const selectedTimeframe = ref('ALL')
const timeframes = ['ALL', '1M', '6M', '1Y']

const performanceData: Record<string, { pageViews: number[]; clicks: number[] }> = {
  ALL: {
    pageViews: [30, 60, 70, 55, 70, 60, 40, 75, 50, 65, 45, 60],
    clicks: [10, 20, 15, 25, 30, 20, 10, 35, 20, 30, 25, 40]
  },
  '1M': {
    pageViews: [45, 50, 60, 55, 65, 70, 55, 80, 65, 70, 60, 75],
    clicks: [15, 20, 25, 22, 30, 35, 25, 40, 30, 35, 28, 45]
  },
  '6M': {
    pageViews: [25, 45, 55, 40, 60, 50, 35, 65, 45, 55, 40, 50],
    clicks: [8, 15, 12, 18, 22, 16, 8, 28, 18, 25, 20, 32]
  },
  '1Y': {
    pageViews: [30, 60, 70, 55, 70, 60, 40, 75, 50, 65, 45, 60],
    clicks: [10, 20, 15, 25, 30, 20, 10, 35, 20, 30, 25, 40]
  }
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const hoveredPerfIndex = ref<number | null>(null)

const activePerformance = computed(() => {
  return performanceData[selectedTimeframe.value] || performanceData.ALL
})

const svgPerfMetrics = computed(() => {
  const width = 720
  const height = 190
  const padLeft = 35
  const padRight = 20
  const padTop = 15
  const padBottom = 25

  const innerW = width - padLeft - padRight
  const innerH = height - padTop - padBottom
  const maxVal = 90

  const points = months.map((m, i) => {
    const x = padLeft + (i + 0.5) * (innerW / months.length)
    const pv = activePerformance.value.pageViews[i]
    const clk = activePerformance.value.clicks[i]

    const barH = (pv / maxVal) * innerH
    const barY = padTop + innerH - barH
    const lineY = padTop + innerH - (clk / maxVal) * innerH

    return { x, barY, barH, lineY, pv, clk, month: m }
  })

  let lineD = `M ${points[0].x} ${points[0].lineY}`
  for (let i = 1; i < points.length; i++) {
    lineD += ` L ${points[i].x} ${points[i].lineY}`
  }

  return { points, lineD, width, height, padLeft, padTop, innerW, innerH }
})
</script>

<template>
  <div class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-9">
    <div>
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h6 class="text-sm font-bold text-gray-900 dark:text-white">Performance</h6>
        <div class="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50/80 p-1 dark:border-gray-800 dark:bg-gray-800">
          <button
            v-for="tf in timeframes"
            :key="tf"
            type="button"
            :class="[
              'rounded px-2.5 py-1 text-xs font-semibold transition',
              selectedTimeframe === tf
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-300'
            ]"
            @click="selectedTimeframe = tf"
          >
            {{ tf }}
          </button>
        </div>
      </div>

      <div class="mb-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
        <FeatherIcon name="alert-triangle" size="14" class="flex-shrink-0 text-amber-600" />
        <span>We regret to inform you that our server is currently experiencing technical issues.</span>
      </div>

      <div class="relative w-full overflow-hidden" style="min-height: 200px">
        <svg
          viewBox="0 0 720 190"
          class="h-full w-full overflow-visible"
          preserveAspectRatio="none"
          @mouseleave="hoveredPerfIndex = null"
        >
          <g class="text-gray-200 dark:text-gray-800">
            <line
              v-for="i in 4"
              :key="i"
              :x1="svgPerfMetrics.padLeft"
              :y1="svgPerfMetrics.padTop + ((i - 1) * svgPerfMetrics.innerH) / 3"
              :x2="svgPerfMetrics.width - 20"
              :y2="svgPerfMetrics.padTop + ((i - 1) * svgPerfMetrics.innerH) / 3"
              stroke="currentColor"
              stroke-width="1"
              stroke-dasharray="3 3"
            />
          </g>

          <g>
            <rect
              v-for="(p, i) in svgPerfMetrics.points"
              :key="'bar-' + i"
              :x="p.x - 12"
              :y="p.barY"
              width="24"
              :height="p.barH"
              rx="3"
              fill="#14B8A6"
              class="cursor-pointer transition-all duration-200 hover:opacity-85"
              @mouseenter="hoveredPerfIndex = i"
            />
          </g>

          <path
            :d="svgPerfMetrics.lineD"
            fill="none"
            stroke="#6366F1"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <g v-for="(p, i) in svgPerfMetrics.points" :key="'dot-' + i">
            <circle
              :cx="p.x"
              :cy="p.lineY"
              :r="hoveredPerfIndex === i ? 5 : 3.5"
              fill="#ffffff"
              stroke="#6366F1"
              stroke-width="2"
              class="cursor-pointer transition-all duration-150"
              @mouseenter="hoveredPerfIndex = i"
            />
          </g>

          <g class="select-none fill-gray-400 text-xs">
            <text
              v-for="(p, i) in svgPerfMetrics.points"
              :key="'txt-' + i"
              :x="p.x"
              :y="svgPerfMetrics.padTop + svgPerfMetrics.innerH + 16"
              text-anchor="middle"
              :class="{ 'font-bold fill-primary': hoveredPerfIndex === i }"
            >
              {{ p.month }}
            </text>
          </g>
        </svg>

        <div
          v-if="hoveredPerfIndex !== null"
          class="pointer-events-none absolute -top-1 z-30 -translate-x-1/2 rounded-md bg-[#092C4C] px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all"
          :style="{ left: `${(svgPerfMetrics.points[hoveredPerfIndex].x / svgPerfMetrics.width) * 100}%` }"
        >
          <div>{{ svgPerfMetrics.points[hoveredPerfIndex].month }}</div>
          <div class="text-[#14B8A6]">Page Views: {{ svgPerfMetrics.points[hoveredPerfIndex].pv }}k</div>
          <div class="text-[#818CF8]">Clicks: {{ svgPerfMetrics.points[hoveredPerfIndex].clk }}k</div>
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-center justify-center gap-5 text-xs text-gray-500 dark:text-gray-400">
      <span class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded bg-[#14B8A6]"></span>
        Page Views
      </span>
      <span class="flex items-center gap-1.5">
        <span class="h-1 w-4 rounded bg-[#6366F1]"></span>
        Clicks
      </span>
    </div>
  </div>
</template>

