<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'FAQ Category',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-faq-category space-y-4 p-4 md:p-6">
    <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 text-center dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
      <FeatherIcon name="inbox" :size="40" class="text-gray-400 dark:text-gray-600 mb-3" />
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200">FAQ Category Kosong</h3>
      <p class="mt-1 max-w-sm text-xs text-gray-500 dark:text-gray-400">
        Halaman kategori FAQ belum tersedia pada template bawaan asli.
      </p>
      <NuxtLink
        to="/faq"
        class="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
      >
        <FeatherIcon name="help-circle" :size="14" />
        <span>Buka Halaman FAQ</span>
      </NuxtLink>
    </div>
  </div>
</template>
