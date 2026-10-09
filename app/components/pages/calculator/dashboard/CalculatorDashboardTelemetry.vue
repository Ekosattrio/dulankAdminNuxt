<script setup lang="ts">
import type { CalculatorDashboardTelemetry } from '#server/types/calculator-dashboard'

const props = defineProps<{
  telemetry: CalculatorDashboardTelemetry
}>()

function getChartPath(points: number[], maxVal = 1000, height = 90, width = 340) {
  const stepX = width / (points.length - 1)
  return points
    .map((val, i) => {
      const x = i * stepX
      const y = height - (val / maxVal) * (height - 15) - 5
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

const thisWeekPath = computed(() => getChartPath([0, 100, 0, 0, 1000, 0, 0]))
const lastWeekPath = computed(() => getChartPath([16, 16, 15, 15, 16, 16, 16]))
</script>

<template>
  <div class="rounded-xl border border-slate-700/60 bg-[#161D31] p-5 sm:p-6 text-white shadow-md">
    <div class="mb-4">
      <span class="inline-block rounded bg-[#334155] px-2.5 py-1 text-xs font-semibold text-slate-200">
        Realtime Database
      </span>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <!-- Col 1: User (current) -->
      <div class="flex flex-col justify-between">
        <div>
          <div class="text-xs font-semibold text-slate-400">User (current)</div>
          <div class="text-3xl font-bold text-white mb-2">{{ telemetry.currentUsers || 56 }}</div>
        </div>
        <div class="w-full pt-2">
          <svg viewBox="0 0 340 90" class="w-full h-24 overflow-visible">
            <path :d="lastWeekPath" fill="none" stroke="#64748B" stroke-width="1.5" stroke-dasharray="4 4" />
            <path :d="thisWeekPath" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" />
            <circle cx="226" cy="18" r="4.5" fill="#3B82F6" stroke="#ffffff" stroke-width="2" />
          </svg>
        </div>
      </div>

      <!-- Col 2: Total Request (7d total) -->
      <div class="flex flex-col justify-between">
        <div>
          <div class="text-xs font-semibold text-slate-400">Total Request (7d total)</div>
          <div class="text-3xl font-bold text-white">{{ (telemetry.totalRequest || 7920).toLocaleString() }} Requests</div>
          <div class="text-xs font-semibold text-[#28C76F] mt-0.5 mb-2">{{ telemetry.requestGrowth || '+5,056.2%' }}</div>
        </div>
        <div class="w-full pt-2">
          <svg viewBox="0 0 340 90" class="w-full h-24 overflow-visible">
            <path :d="lastWeekPath" fill="none" stroke="#64748B" stroke-width="1.5" stroke-dasharray="4 4" />
            <path :d="thisWeekPath" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" />
            <circle cx="226" cy="18" r="4.5" fill="#3B82F6" stroke="#ffffff" stroke-width="2" />
          </svg>
        </div>
      </div>

      <!-- Col 3: Total Calculate (7d total) -->
      <div class="flex flex-col justify-between">
        <div>
          <div class="text-xs font-semibold text-slate-400">Total Calculate (7d total)</div>
          <div class="text-3xl font-bold text-white">{{ (telemetry.totalCalculate || 18032).toLocaleString() }} Calculates</div>
          <div class="text-xs font-semibold text-[#28C76F] mt-0.5 mb-2">{{ telemetry.calculateGrowth || '+2,056.2%' }}</div>
        </div>
        <div class="w-full pt-2">
          <svg viewBox="0 0 340 90" class="w-full h-24 overflow-visible">
            <path :d="lastWeekPath" fill="none" stroke="#64748B" stroke-width="1.5" stroke-dasharray="4 4" />
            <path :d="thisWeekPath" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" />
            <circle cx="226" cy="18" r="4.5" fill="#3B82F6" stroke="#ffffff" stroke-width="2" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Legend Footer -->
    <div class="mt-4 flex items-center justify-between border-t border-slate-700/60 pt-3 text-xs text-slate-400">
      <span class="flex items-center gap-1.5">
        <span class="h-2.5 w-2.5 rounded-full bg-[#3B82F6]"></span>
        This week
      </span>
      <span class="flex items-center gap-1.5">
        <span class="inline-block w-4 border-t border-dashed border-slate-400"></span>
        Last week
      </span>
    </div>
  </div>
</template>

