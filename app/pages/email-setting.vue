<script setup lang="ts">
import EmailSettingWorkspace from '~/components/Pages/Setting/EmailSettingWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Email Settings',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-email-setting">
    <EmailSettingWorkspace />
  </div>
</template>
