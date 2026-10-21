<script setup lang="ts">
import type { WorkflowStepPreset } from '#server/types/cetak-full-color'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

const props = defineProps<{ items: WorkflowStepPreset[] }>()
const emit = defineEmits<{ 'update:items': [items: WorkflowStepPreset[]]; save: [] }>()

function move(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= props.items.length) return
  const rows = props.items.map(item => ({ ...item }))
  const current = rows[index]
  const replacement = rows[target]
  if (!current || !replacement) return
  rows[index] = replacement
  rows[target] = current
  rows.forEach((item, itemIndex) => { item.step = itemIndex + 1 })
  emit('update:items', rows)
}
</script>

<template>
  <section class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <h4 class="app-section-title mb-4 text-gray-900 dark:text-white">Work Flow Setting</h4>
    <div class="overflow-x-auto">
      <table class="min-w-[620px] w-full text-left text-sm">
        <thead class="border-b border-gray-200 bg-gray-50 font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
          <tr><th class="w-16 px-4 py-3">No</th><th class="w-28 px-4 py-3">Action</th><th class="px-4 py-3">Flow Category</th><th class="px-4 py-3">Flow Name</th></tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="(item, index) in items" :key="item.id">
            <td class="px-4 py-3">{{ item.step }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button type="button" class="flex size-8 items-center justify-center rounded border border-gray-300 text-gray-600 disabled:opacity-30" :disabled="index === 0" :aria-label="`Move ${item.name} up`" @click="move(index, -1)"><FeatherIcon name="arrow-up" :size="14" /></button>
                <button type="button" class="flex size-8 items-center justify-center rounded border border-gray-300 text-gray-600 disabled:opacity-30" :disabled="index === items.length - 1" :aria-label="`Move ${item.name} down`" @click="move(index, 1)"><FeatherIcon name="arrow-down" :size="14" /></button>
              </div>
            </td>
            <td class="px-4 py-3">{{ item.category }}</td>
            <td class="px-4 py-3">{{ item.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
      <button type="button" class="h-9 rounded-md bg-gray-800 px-4 text-sm font-semibold text-white">Cancel</button>
      <button type="button" class="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white" @click="emit('save')">Save</button>
    </div>
  </section>
</template>
