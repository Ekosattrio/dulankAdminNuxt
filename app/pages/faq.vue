<script setup lang="ts">
import FaqWorkspace from '~/components/Pages/Faq/FaqWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'FAQ - Frequently Asked Questions',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-faq">
    <FaqWorkspace />
  </div>
</template>
