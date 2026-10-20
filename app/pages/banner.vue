<script setup lang="ts">
import BannerWorkspace from '~/components/Pages/Banner/BannerWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Banner - Percetakan Dulank',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-banner">
    <BannerWorkspace />
  </div>
</template>
