<script setup lang="ts">
import RegencyWorkspace from '~/components/Pages/Location/RegencyWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Regency / City List',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-regency">
    <RegencyWorkspace />
  </div>
</template>
