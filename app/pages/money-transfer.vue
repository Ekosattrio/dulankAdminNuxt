<script setup lang="ts">
import MoneyTransferWorkspace from '~/components/pages/money-transfer/MoneyTransferWorkspace.vue'

useLegacyPage({ title: 'Money Transfer', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-money-transfer">
    <MoneyTransferWorkspace />
  </div>
</template>
