<script setup lang="ts">
import type { BannerItem } from '#server/types/banner'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  title: string
  addLabel: string
  banners: BannerItem[]
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'edit', banner: BannerItem): void
  (e: 'delete', banner: BannerItem): void
}>()

function isVisibleNow(b: BannerItem): boolean {
  if (b.status === 'Inactive') return false
  const now = new Date()
  if (b.start) {
    const s = new Date(b.start)
    if (!isNaN(s.getTime()) && now < s) return false
  }
  if (b.end) {
    const e = new Date(b.end)
    if (!isNaN(e.getTime()) && now > e) return false
  }
  return true
}

function formatScheduleDate(dateStr?: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
    <div class="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
      <h5 class="text-base font-bold text-gray-900 dark:text-white">{{ title }}</h5>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md bg-[#f97316] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#ea580c] transition-colors"
        @click="emit('add')"
      >
        <FeatherIcon name="plus" :size="13" />
        <span>{{ addLabel }}</span>
      </button>
    </div>
    <div class="p-4">
      <div v-if="banners.length === 0" class="py-12 text-center text-xs text-gray-400">
        No banners yet.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="b in banners"
          :key="b.id"
          class="rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 transition hover:shadow-sm dark:border-gray-800 dark:bg-gray-800/40"
        >
          <!-- Thumbnail Container with Badges & Actions -->
          <div class="relative mb-2.5 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
            <!-- Status Badge -->
            <span
              :class="[
                'absolute top-2 left-2 z-10 rounded px-2 py-0.5 text-xs font-semibold text-white shadow-xs',
                isVisibleNow(b) ? 'bg-[#28c76f]' : 'bg-[#6c757d]'
              ]"
            >
              {{ isVisibleNow(b) ? 'Active' : 'Inactive' }}
            </span>

            <!-- Action Buttons -->
            <div class="absolute top-2 right-2 z-10 flex items-center gap-1.5">
              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:text-primary transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                title="Edit"
                @click="emit('edit', b)"
              >
                <FeatherIcon name="edit" :size="13" />
              </button>
              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded bg-[#ef4444] text-white shadow-sm hover:bg-red-600 transition-colors"
                title="Delete"
                @click="emit('delete', b)"
              >
                <FeatherIcon name="trash-2" :size="13" />
              </button>
            </div>

            <!-- Banner Image -->
            <a :href="b.src || b.imageUrl" target="_blank" rel="noopener noreferrer" class="block">
              <img
                :src="b.src || b.imageUrl"
                :alt="b.title"
                class="h-[120px] w-full object-cover transition-transform duration-300 hover:scale-105"
                @error="($event.target as HTMLImageElement).src = 'https://percetakan-dulank.netlify.app/images/brosur.jpg'"
              />
            </a>
          </div>

          <!-- Information Details -->
          <div class="space-y-0.5 pt-0.5">
            <strong class="block text-xs font-bold text-gray-900 truncate dark:text-white">
              {{ b.title }}
            </strong>
            <p class="text-xs text-gray-500 truncate dark:text-gray-400 mb-1">
              {{ b.desc || b.description || '—' }}
            </p>
            <div class="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
              <div>Start: {{ formatScheduleDate(b.start || b.startDate) }}</div>
              <div>End: {{ formatScheduleDate(b.end || b.endDate) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

