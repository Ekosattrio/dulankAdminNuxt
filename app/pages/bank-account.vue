<script setup lang="ts">
import BankAccountWorkspace from '~/components/pages/bank-account/BankAccountWorkspace.vue'

useLegacyPage({ title: 'Bank Accounts', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-bank-account">
    <BankAccountWorkspace />
  </div>
</template>

