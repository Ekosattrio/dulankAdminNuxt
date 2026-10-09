<script setup lang="ts">
import BannerWorkspace from '~/components/pages/banner/BannerWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/banner.html'],
})

useLegacyPage({
  title: 'Banner - Percetakan Dulank',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-banner p-4 md:p-6">
    <BannerWorkspace />
  </div>
</template>
