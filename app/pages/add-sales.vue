<script setup lang="ts">
import SalesStandaloneEditor from '~/components/Pages/Sales/SalesStandaloneEditor.vue'

useLegacyPage({ title: 'Add Sales', sweetAlert: false })
const { busy, error, message, submit } = useAddSalesPage()
</script>

<template>
  <div class="dulank-page dulank-page-add-sales">
    <SalesStandaloneEditor :busy="busy" :error="error" :message="message" @submit="submit" />
  </div>
</template>
