<script setup lang="ts">
import PaymentGatewayWorkspace from '~/components/Pages/Setting/PaymentGatewayWorkspace.vue'

useLegacyPage({
  title: 'Payment Gateway',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-payment-gateway">
    <PaymentGatewayWorkspace />
  </div>
</template>
