<script setup lang="ts">
import OnlineOrdersWorkspace from '~/components/Pages/OnlineOrders/OnlineOrdersWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Online Orders',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-online-orders">
    <OnlineOrdersWorkspace />
  </div>
</template>
