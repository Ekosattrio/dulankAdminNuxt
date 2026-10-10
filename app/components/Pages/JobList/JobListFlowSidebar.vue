<script setup lang="ts">
import type { FlowSummary } from '#server/types/job-list'

const props = defineProps<{
  flows: FlowSummary[]
  activeFlow: string
}>()

const emit = defineEmits<{
  'select-flow': [flowName: string]
}>()
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
      <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100">All Flow</h5>
    </div>

    <div class="max-h-[540px] overflow-y-auto">
      <table class="w-full text-left text-xs">
        <thead class="border-b border-gray-100 bg-gray-50/75 dark:border-gray-800 dark:bg-gray-800/50">
          <tr>
            <th class="px-4 py-2.5 font-bold text-gray-700 dark:text-gray-300">Flow Name</th>
            <th class="px-4 py-2.5 text-right font-bold text-gray-700 dark:text-gray-300">Job Qty</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <!-- All Option -->
          <tr
            class="cursor-pointer transition hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
            :class="!activeFlow ? 'bg-[#ff9f43]/10 font-bold text-[#ff9f43]' : 'text-gray-700 dark:text-gray-300'"
            @click="$emit('select-flow', '')"
          >
            <td class="px-4 py-2.5">All Flow</td>
            <td class="px-4 py-2.5 text-right">-</td>
          </tr>

          <!-- Individual Flows -->
          <tr
            v-for="fl in flows"
            :key="fl.name"
            class="cursor-pointer transition hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
            :class="activeFlow === fl.name ? 'bg-[#ff9f43]/10 font-bold text-[#ff9f43]' : 'text-gray-700 dark:text-gray-300'"
            @click="$emit('select-flow', fl.name)"
          >
            <td class="px-4 py-2.5">{{ fl.name }}</td>
            <td class="px-4 py-2.5 text-right font-semibold">{{ fl.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
