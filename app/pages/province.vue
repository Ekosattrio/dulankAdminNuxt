<script setup lang="ts">
import ProvinceWorkspace from '~/components/pages/location/ProvinceWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Province List',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-province">
    <ProvinceWorkspace />
  </div>
</template>
