<script setup lang="ts">
import type { WorkFlowStepItem } from '#server/types/work-flow'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{ items: WorkFlowStepItem[] }>()
defineEmits<{ move: [index: number, direction: -1 | 1] }>()
</script>

<template>
  <aside class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm xl:sticky xl:top-6 dark:border-gray-700 dark:bg-gray-900">
    <div class="mb-4 flex items-center justify-between"><h2 class="app-section-title">Work Flow Arrange</h2><span class="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{{ items.length }} Steps</span></div>
    <div class="mb-2 grid grid-cols-[70px_minmax(0,1fr)_90px] items-center gap-3 border-b border-gray-200 pb-2 text-xs font-bold dark:border-gray-700"><div>Flow</div><div>Flow Name</div><div class="text-center">Up/Down</div></div>
    <div v-if="!items.length" class="rounded-lg border border-dashed border-gray-200 p-8 text-center text-xs text-gray-400 dark:border-gray-800">No workflow steps selected yet.<div class="mt-1">Select checkboxes on the left to add steps into sequence.</div></div>
    <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
      <div v-for="(item, index) in items" :key="item.id || item.name" class="grid grid-cols-[70px_minmax(0,1fr)_90px] items-center gap-3 py-2.5 text-xs">
        <div class="text-gray-500">No. {{ index + 1 }}</div>
        <div class="min-w-0"><div class="break-words font-semibold">{{ item.name }}</div><div v-if="item.template" class="break-words text-xs text-amber-600">{{ item.template }}</div></div>
        <div class="flex justify-center gap-2">
          <button type="button" :disabled="index === items.length - 1" class="flex size-9 items-center justify-center rounded border border-gray-200 disabled:opacity-30 dark:border-gray-700" aria-label="Move down" @click="$emit('move', index, 1)"><FeatherIcon name="arrow-down" :size="14" /></button>
          <button type="button" :disabled="index === 0" class="flex size-9 items-center justify-center rounded border border-gray-200 disabled:opacity-30 dark:border-gray-700" aria-label="Move up" @click="$emit('move', index, -1)"><FeatherIcon name="arrow-up" :size="14" /></button>
        </div>
      </div>
    </div>
  </aside>
</template>
