<script setup lang="ts">
import BanIpAddressWorkspace from '~/components/pages/setting/BanIpAddressWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/ban-ip-address.html'],
})

useLegacyPage({
  title: 'Ban IP Address',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-ban-ip-address">
    <BanIpAddressWorkspace />
  </div>
</template>
