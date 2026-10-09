<script setup lang="ts">
import DistrictWorkspace from '~/components/pages/location/DistrictWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'District / Kecamatan List',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-district">
    <DistrictWorkspace />
  </div>
</template>
