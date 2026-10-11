<script setup lang="ts">
import UnitWorkspace from '~/components/Unit/UnitWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Unit',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-unit inventory-master-page">
    <UnitWorkspace />
  </div>
</template>
