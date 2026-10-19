<script setup lang="ts">
import PurchaseDocumentForm from '~/components/Pages/Purchase/PurchaseDocumentForm.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Add Purchase',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-add-purchase">
    <PurchaseDocumentForm />
  </div>
</template>
