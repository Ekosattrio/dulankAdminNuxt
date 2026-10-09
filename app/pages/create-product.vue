<script setup lang="ts">
import ProductDocumentForm from '~/components/pages/create-product/ProductDocumentForm.vue'

definePageMeta({
  layout: 'default',
  alias: ['/create-product.html'],
})
useLegacyPage({ title: 'New Product - Create new product', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-create-product">
    <ProductDocumentForm />
  </div>
</template>
