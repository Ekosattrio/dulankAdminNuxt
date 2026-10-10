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
      <FeatherIcon name="globe" class="text-primary" :size="18" />
      <h3 class="text-sm font-bold text-gray-900 dark:text-white">Basic Information & Waktu</h3>
    </div>

    <div class="space-y-4">
      <!-- Language -->
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-12 sm:gap-4">
        <div class="sm:col-span-5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Bahasa Utama Sistem</label>
          <p class="text-[11px] text-gray-400">Pilih bahasa default antarmuka</p>
        </div>
        <div class="sm:col-span-7">
          <select v-model="form.language" class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="Indonesian">Indonesian (Bahasa Indonesia)</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>
      </div>

      <!-- Language Switcher -->
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-12 sm:gap-4">
        <div class="sm:col-span-5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Language Switcher</label>
          <p class="text-[11px] text-gray-400">Tampilkan pemilih bahasa di header</p>
        </div>
        <div class="sm:col-span-7 flex items-center">
          <input
            v-model="form.languageSwitcher"
            type="checkbox"
            id="lang-switcher"
            class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label for="lang-switcher" class="ms-2 text-xs text-gray-700 dark:text-gray-300">Aktifkan switcher di header</label>
        </div>
      </div>

      <!-- Timezone -->
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-12 sm:gap-4">
        <div class="sm:col-span-5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Timezone (Zona Waktu)</label>
          <p class="text-[11px] text-gray-400">Zona waktu pencatatan transaksi</p>
        </div>
        <div class="sm:col-span-7">
          <select v-model="form.timezone" class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="Asia/Jakarta">Asia/Jakarta (WIB GMT+7)</option>
            <option value="Asia/Makassar">Asia/Makassar (WITA GMT+8)</option>
            <option value="Asia/Jayapura">Asia/Jayapura (WIT GMT+9)</option>
          </select>
        </div>
      </div>

      <!-- Date Format -->
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-12 sm:gap-4">
        <div class="sm:col-span-5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Format Tanggal</label>
          <p class="text-[11px] text-gray-400">Pola penampilan tanggal dokumen</p>
        </div>
        <div class="sm:col-span-7">
          <select v-model="form.dateFormat" class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="DD MMM YYYY">DD MMM YYYY (e.g. 09 Okt 2026)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 09/10/2026)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-10-09)</option>
          </select>
        </div>
      </div>

      <!-- Time Format -->
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-12 sm:gap-4">
        <div class="sm:col-span-5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Format Jam</label>
        </div>
        <div class="sm:col-span-7">
          <select v-model="form.timeFormat" class="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="24 Hours">24 Jam (21:30)</option>
            <option value="12 Hours">12 Jam AM/PM (09:30 PM)</option>
          </select>
        </div>
      </div>

      <!-- Financial Year & Starting Month -->
      <div class="grid grid-cols-1 items-center gap-2 sm:grid-cols-12 sm:gap-4">
        <div class="sm:col-span-5">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Tahun Buku Finansial</label>
        </div>
        <div class="sm:col-span-7 grid grid-cols-2 gap-2">
          <input
            v-model="form.financialYear"
            type="text"
            class="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <select v-model="form.startingMonth" class="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="January">January</option>
            <option value="April">April</option>
            <option value="July">July</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

