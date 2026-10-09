<script setup lang="ts">
import BalanceAccountWorkspace from '~/components/pages/reports/BalanceAccountWorkspace.vue'

useLegacyPage({
  title: 'Balance Account',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-balance-account">
    <BalanceAccountWorkspace />
  </div>
</template>
