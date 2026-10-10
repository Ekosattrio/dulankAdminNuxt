<script setup lang="ts">
import FooterWorkspace from '~/components/Pages/Footer/FooterWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Footer - Pengaturan Tautan & Konten Footer',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-footer p-4 md:p-6">
    <FooterWorkspace />
  </div>
</template>
