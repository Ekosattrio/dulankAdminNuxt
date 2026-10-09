<script setup lang="ts">
import type { LocalizationConfig } from '#server/types/system-settings'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  form: LocalizationConfig
}>()
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
    <div class="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
      <FeatherIcon name="dollar-sign" class="text-primary" :size="18" />
      <h3 class="text-sm font-bold text-gray-900 dark:text-white">Format Mata Uang & Separator</h3>
    </div>

    <div class="space-y-4">
      <!-- Currency & Symbol -->
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-12 sm:gap-4">
        <div class="sm:col-span-5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Mata Uang & Simbol</label>
        </div>
        <div class="sm:col-span-7 grid grid-cols-2 gap-2">
          <select v-model="form.currency" class="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="IDR">IDR (Rupiah)</option>
            <option value="USD">USD (Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
          </select>
          <input
            v-model="form.currencySymbol"
            type="text"
            placeholder="Symbol (e.g. Rp)"
            class="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <!-- Currency Position -->
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-12 sm:gap-4">
        <div class="sm:col-span-5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Posisi Simbol Mata Uang</label>
        </div>
        <div class="sm:col-span-7">
          <select v-model="form.currencyPosition" class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="before">Sebelum Angka (Rp 10.000)</option>
            <option value="after">Setelah Angka (10.000 Rp)</option>
          </select>
        </div>
      </div>

      <!-- Decimal & Thousand Separator -->
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-12 sm:gap-4">
        <div class="sm:col-span-5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Pemisah Desimal & Ribuan</label>
        </div>
        <div class="sm:col-span-7 grid grid-cols-2 gap-2">
          <div>
            <label class="text-[11px] text-gray-400">Desimal</label>
            <select v-model="form.decimalSeparator" class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value=",">Koma (,)</option>
              <option value=".">Titik (.)</option>
            </select>
          </div>
          <div>
            <label class="text-[11px] text-gray-400">Ribuan</label>
            <select v-model="form.thousandSeparator" class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
              <option value=".">Titik (.)</option>
              <option value=",">Koma (,)</option>
              <option value=" ">Spasi ( )</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

