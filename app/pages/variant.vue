<script setup lang="ts">
import VariantWorkspace from '~/components/variant/VariantWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Variant',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-variant">
    <VariantWorkspace />
  </div>
</template>
