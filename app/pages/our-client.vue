<script setup lang="ts">
import OurClientWorkspace from '~/components/pages/our-client/OurClientWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Our Client',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-our-client p-4 md:p-6">
    <OurClientWorkspace />
  </div>
</template>
