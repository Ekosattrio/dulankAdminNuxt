<script setup lang="ts">
import SmsGatewayWorkspace from '~/components/Pages/Setting/SmsGatewayWorkspace.vue'

useLegacyPage({
  title: 'SMS Gateways',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-sms-gateway">
    <SmsGatewayWorkspace />
  </div>
</template>
