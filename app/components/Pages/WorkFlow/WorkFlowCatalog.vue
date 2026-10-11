<script setup lang="ts">
import type { WorkFlowEditorFlow, WorkFlowStepItem } from '#server/types/work-flow'

const props = defineProps<{ categories: string[]; flows: WorkFlowEditorFlow[]; arranged: WorkFlowStepItem[] }>()
const emit = defineEmits<{ toggle: [flow: WorkFlowEditorFlow]; template: [flow: WorkFlowEditorFlow, template: string]; addCategory: []; addName: [category: string] }>()
const opened = ref<Record<string, boolean>>({})
const flowsFor = (category: string) => props.flows.filter((flow) => flow.category === category)
const selected = (flow: WorkFlowEditorFlow) => props.arranged.find((item) => item.name.toLowerCase() === flow.name.toLowerCase())
</script>

<template>
  <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <h2 class="app-section-title mb-4">Setting all flow to show in default job order</h2>
    <div class="space-y-6">
      <div v-for="category in categories" :key="category" class="border-t border-gray-100 pt-4 first:border-0 first:pt-0 dark:border-gray-800">
        <div class="mb-3 flex flex-wrap gap-4 text-xs font-semibold">
          <button type="button" class="text-amber-500 hover:underline" @click="$emit('addCategory')">Add New Flow Category</button>
          <button type="button" class="text-amber-500 hover:underline" @click="$emit('addName', category)">Add New Flow Name</button>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div class="md:col-span-4"><div class="text-xs text-gray-500">Flow Category :</div><div class="mt-0.5 text-sm font-bold">{{ category }}</div></div>
          <div class="space-y-3 md:col-span-8">
            <div class="text-xs text-gray-500">Flow Name :</div>
            <div v-for="flow in flowsFor(category)" :key="flow.id" class="space-y-2 rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 dark:border-gray-800 dark:bg-gray-800/30">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <label class="flex cursor-pointer items-center gap-2 text-sm font-medium"><input type="checkbox" :checked="!!selected(flow)" class="size-4 accent-primary" @change="$emit('toggle', flow)" />{{ flow.name }}</label>
                <div v-if="selected(flow)" class="flex items-center gap-2 text-xs">
                  <button type="button" class="font-bold text-primary hover:underline" @click="opened[flow.id] = !opened[flow.id]">{{ opened[flow.id] ? 'Hide Template' : 'Add Flow Template' }}</button>
                  <span class="text-gray-400">|</span>
                  <button type="button" class="font-bold text-red-500 hover:underline" @click="$emit('template', flow, '')">Reset Template</button>
                </div>
              </div>
              <div v-if="opened[flow.id] && selected(flow)" class="ms-6 space-y-1 pt-1">
                <label class="block text-xs font-semibold text-gray-500">Flow Template</label>
                <select :value="selected(flow)?.template || ''" class="h-9 w-full rounded-md border border-gray-200 bg-white px-2.5 text-sm dark:border-gray-700 dark:bg-gray-800" @change="$emit('template', flow, ($event.target as HTMLSelectElement).value)">
                  <option value="">Choose Flow Templete</option><option v-for="template in flow.templateNames" :key="template">{{ template }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
