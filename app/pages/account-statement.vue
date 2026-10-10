<script setup lang="ts">
import AccountStatementWorkspace from '~/components/Pages/Reports/AccountStatementWorkspace.vue'

useLegacyPage({
  title: 'Account Statement',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-account-statement">
    <AccountStatementWorkspace />
  </div>
</template>
