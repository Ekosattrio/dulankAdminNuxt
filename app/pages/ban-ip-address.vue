<script setup lang="ts">
import BanIpAddressWorkspace from '~/components/Pages/Setting/BanIpAddressWorkspace.vue'

useLegacyPage({
  title: 'Ban IP Address',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-ban-ip-address">
    <BanIpAddressWorkspace />
  </div>
</template>
