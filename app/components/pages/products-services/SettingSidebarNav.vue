<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import type { SidebarTabItem } from '../../../types/configuration'

defineProps<{
  tabs: SidebarTabItem[]
  modelValue: string
  title?: string
}>()

defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()
</script>

<template>
  <aside class="h-fit rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900" aria-label="Settings sections">
    <div class="flex items-center justify-between border-b border-gray-100 pb-3 mb-2 dark:border-gray-800">
      <h5 class="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
        {{ title || 'Setting And Optional' }}
      </h5>
      <span class="inline-flex items-center justify-center rounded-full bg-[#ea5455] text-white px-2 py-0.5 text-xs font-bold shadow-sm">
        {{ tabs.length }}
      </span>
    </div>

    <nav class="space-y-1">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="[
          'flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-left text-sm font-medium transition cursor-pointer',
          modelValue === tab.id
            ? 'bg-[#f1f1f5] border border-[#e4e6ef] text-[#1f1f1f] font-semibold dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            : 'text-[#5e5873] hover:bg-[#7367f0]/10 hover:text-[#1f1f1f] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
        ]"
        @click="$emit('update:modelValue', tab.id)"
      >
        <FeatherIcon
          :name="tab.icon"
          :size="16"
          :class="modelValue === tab.id ? 'text-[#7367f0]' : 'text-[#6e6b7b] dark:text-gray-400'"
        />
        <span class="truncate">{{ tab.label }}</span>
      </button>
    </nav>
  </aside>
</template>

