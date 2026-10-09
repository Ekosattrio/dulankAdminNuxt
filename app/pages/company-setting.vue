<script setup lang="ts">
import CompanySettingWorkspace from '~/components/pages/setting/CompanySettingWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Company Settings - Kacetak System',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-company-setting">
    <CompanySettingWorkspace />
  </div>
</template>
