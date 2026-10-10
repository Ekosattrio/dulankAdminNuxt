<script setup lang="ts">
import BalanceSheetWorkspace from '~/components/Pages/Reports/BalanceSheetWorkspace.vue'

useLegacyPage({
  title: 'Balance Sheet',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-balance-sheet">
    <BalanceSheetWorkspace />
  </div>
</template>
