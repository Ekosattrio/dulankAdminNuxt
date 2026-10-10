<script setup lang="ts">
import OtpSettingWorkspace from '~/components/Pages/Setting/OtpSettingWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'OTP Settings',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-otp">
    <OtpSettingWorkspace />
  </div>
</template>
