<script setup lang="ts">
import UnitWorkspace from '~/components/Unit/UnitWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Unit',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-unit">
    <UnitWorkspace />
  </div>
</template>
