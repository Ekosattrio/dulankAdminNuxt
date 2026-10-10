<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

interface LegalForm {
  companyName: string
  currency: string
  tagline: string
  npwp: string
}

defineProps<{
  form: LegalForm
}>()
</script>

<template>
  <div>
    <div class="mb-5 flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#FF9F43] dark:bg-amber-950/60 dark:text-amber-400">
        <FeatherIcon name="briefcase" size="18" />
      </div>
      <div>
        <h2 class="text-base font-bold text-gray-900 dark:text-white">
          Informasi Legal & Bisnis
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Nama entitas, nomor pajak (NPWP), dan mata uang standar transaksi percetakan
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <!-- Company Name -->
      <div class="lg:col-span-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Nama Perusahaan <span class="text-rose-500">*</span>
        </label>
        <input
          v-model="form.companyName"
          type="text"
          required
          placeholder="PT. Dulank Semesta Cida"
          class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <!-- Currency -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Mata Uang Default
        </label>
        <div class="relative">
          <select
            v-model="form.currency"
            class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="IDR">IDR - Rupiah Indonesia (Rp)</option>
            <option value="USD">USD - US Dollar ($)</option>
            <option value="SGD">SGD - Singapore Dollar (S$)</option>
          </select>
        </div>
      </div>

      <!-- Tagline -->
      <div class="lg:col-span-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Slogan / Tagline Perusahaan
        </label>
        <input
          v-model="form.tagline"
          type="text"
          placeholder="Pusat Solusi Percetakan Offset & Digital Printing Berkualitas Tinggi"
          class="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <!-- NPWP -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Nomor NPWP Perusahaan
        </label>
        <div class="relative">
          <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FeatherIcon name="file-text" size="14" />
          </span>
          <input
            v-model="form.npwp"
            type="text"
            placeholder="01.345.678.9-012.000"
            class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
    </div>
  </div>
</template>

