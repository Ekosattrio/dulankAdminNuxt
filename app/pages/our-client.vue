<script setup lang="ts">
import OurClientWorkspace from '~/components/Pages/OurClient/OurClientWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Our Client',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-our-client">
    <OurClientWorkspace />
  </div>
</template>
