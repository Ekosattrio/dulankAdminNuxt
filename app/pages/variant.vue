<script setup lang="ts">
import VariantWorkspace from '~/components/Variant/VariantWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Variant',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-variant inventory-master-page">
    <VariantWorkspace />
  </div>
</template>
