<script setup lang="ts">
import FaqWorkspace from '~/components/pages/faq/FaqWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'FAQ - Frequently Asked Questions',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-faq p-4 md:p-6">
    <FaqWorkspace />
  </div>
</template>
