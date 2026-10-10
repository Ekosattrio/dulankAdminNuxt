<script setup lang="ts">
import type { LocalizationConfig } from '#server/types/system-settings'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  form: LocalizationConfig
}>()
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
    <div class="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
      <FeatherIcon name="file" class="text-primary" :size="18" />
      <h3 class="text-sm font-bold text-gray-900 dark:text-white">Restriksi Berkas & Negara</h3>
    </div>

    <div class="space-y-4">
      <!-- Countries Restriction -->
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-12 sm:gap-4">
        <div class="sm:col-span-5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Batasan Akses Negara</label>
        </div>
        <div class="sm:col-span-7">
          <select v-model="form.countriesRestriction" class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="Allow All Countries">Izinkan Semua Negara (Allow All)</option>
            <option value="Indonesia Only">Hanya Wilayah Indonesia (Indonesia Only)</option>
          </select>
        </div>
      </div>

      <!-- Allowed Files -->
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-12 sm:gap-4">
        <div class="sm:col-span-5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Format Ekstensi Berkas Diizinkan</label>
        </div>
        <div class="sm:col-span-7">
          <input
            v-model="form.allowedFiles"
            type="text"
            class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <!-- Max File Size -->
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-12 sm:gap-4">
        <div class="sm:col-span-5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Maksimum Ukuran Berkas (KB)</label>
        </div>
        <div class="sm:col-span-7">
          <input
            v-model.number="form.maxFileSize"
            type="number"
            min="100"
            max="100000"
            class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
    </div>
  </div>
</template>

