<script setup lang="ts">
import type { FooterSocials } from '#server/types/footer'

defineProps<{
  socials: FooterSocials
}>()
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
      Social Media
    </h5>
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
      Masukan URL lengkap (https://...)
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Facebook</label>
        <input
          v-model="socials.facebook"
          type="url"
          placeholder="https://facebook.com/..."
          class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Instagram</label>
        <input
          v-model="socials.instagram"
          type="url"
          placeholder="https://instagram.com/..."
          class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Twitter / X</label>
        <input
          v-model="socials.twitter"
          type="url"
          placeholder="https://twitter.com/..."
          class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">LinkedIn</label>
        <input
          v-model="socials.linkedin"
          type="url"
          placeholder="https://linkedin.com/..."
          class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">YouTube</label>
        <input
          v-model="socials.youtube"
          type="url"
          placeholder="https://youtube.com/..."
          class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>
    </div>
  </div>
</template>

