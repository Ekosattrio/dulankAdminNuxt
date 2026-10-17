<script setup lang="ts">
import type { FooterConfig } from '#server/types/footer'

defineProps<{
  alamat: string
  telepon: string
  email: string
  socials: FooterConfig['socials']
}>()

const emit = defineEmits<{
  'update:alamat': [value: string]
  'update:telepon': [value: string]
  'update:email': [value: string]
  'update:socials': [value: FooterConfig['socials']]
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- Kontak & Alamat -->
    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        Kontak & Alamat
      </h5>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Alamat</label>
          <textarea
            :value="alamat"
            rows="2"
            placeholder="Alamat kantor / workshop..."
            class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @input="emit('update:alamat', ($event.target as HTMLTextAreaElement).value)"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Telepon</label>
            <input
              :value="telepon"
              type="text"
              placeholder="+62 21 ..."
              class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              @input="emit('update:telepon', ($event.target as HTMLInputElement).value)"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input
              :value="email"
              type="text"
              placeholder="info@..."
              class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              @input="emit('update:email', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Social Media -->
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
            :value="socials.facebook"
            type="url"
            placeholder="https://facebook.com/..."
            class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @input="emit('update:socials', { ...socials, facebook: ($event.target as HTMLInputElement).value })"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Instagram</label>
          <input
            :value="socials.instagram"
            type="url"
            placeholder="https://instagram.com/..."
            class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @input="emit('update:socials', { ...socials, instagram: ($event.target as HTMLInputElement).value })"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Twitter / X</label>
          <input
            :value="socials.twitter"
            type="url"
            placeholder="https://twitter.com/..."
            class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @input="emit('update:socials', { ...socials, twitter: ($event.target as HTMLInputElement).value })"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">LinkedIn</label>
          <input
            :value="socials.linkedin"
            type="url"
            placeholder="https://linkedin.com/..."
            class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @input="emit('update:socials', { ...socials, linkedin: ($event.target as HTMLInputElement).value })"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">YouTube</label>
          <input
            :value="socials.youtube"
            type="url"
            placeholder="https://youtube.com/..."
            class="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @input="emit('update:socials', { ...socials, youtube: ($event.target as HTMLInputElement).value })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

