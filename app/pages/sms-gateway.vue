<script setup lang="ts">
import SmsGatewayWorkspace from '~/components/pages/setting/SmsGatewayWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/sms-gateway.html'],
})

useLegacyPage({
  title: 'SMS Gateways',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-sms-gateway">
    <SmsGatewayWorkspace />
  </div>
</template>
