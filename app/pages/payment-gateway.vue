<script setup lang="ts">
import PaymentGatewayWorkspace from '~/components/pages/setting/PaymentGatewayWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/payment-gateway.html'],
})

useLegacyPage({
  title: 'Payment Gateway',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-payment-gateway">
    <PaymentGatewayWorkspace />
  </div>
</template>
