<script setup lang="ts">
import IncentiveWorkspace from '~/components/Incentive/IncentiveWorkspace.vue'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Incentive Management - Insentif Karyawan',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-incentive">
    <IncentiveWorkspace />
  </div>
</template>
