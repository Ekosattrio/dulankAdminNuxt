<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

interface ContactForm {
  email: string
  phone: string
  fax: string
  website: string
}

defineProps<{
  form: ContactForm
}>()
</script>

<template>
  <div class="mt-8 border-t border-gray-100 pt-6 dark:border-gray-800">
    <div class="mb-5 flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
        <FeatherIcon name="phone-call" size="18" />
      </div>
      <div>
        <h2 class="text-base font-bold text-gray-900 dark:text-white">
          Kontak & Komunikasi Resmi
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Saluran komunikasi resmi untuk pelanggan, vendor, dan penawaran cetak
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Email -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Email Resmi Perusahaan <span class="text-rose-500">*</span>
        </label>
        <div class="relative">
          <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FeatherIcon name="mail" size="14" />
          </span>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="kontak@dulanksemesta.com"
            class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <!-- Phone -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          No. Telepon Kantor <span class="text-rose-500">*</span>
        </label>
        <div class="relative">
          <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FeatherIcon name="phone" size="14" />
          </span>
          <input
            v-model="form.phone"
            type="text"
            required
            placeholder="+62 21 4256 7890"
            class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <!-- Fax -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Nomor Fax (Opsional)
        </label>
        <div class="relative">
          <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FeatherIcon name="printer" size="14" />
          </span>
          <input
            v-model="form.fax"
            type="text"
            placeholder="+62 21 4256 7891"
            class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <!-- Website -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          Alamat Website / Portal
        </label>
        <div class="relative">
          <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FeatherIcon name="globe" size="14" />
          </span>
          <input
            v-model="form.website"
            type="url"
            placeholder="https://dulanksemesta.com"
            class="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF9F43] focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
    </div>
  </div>
</template>

