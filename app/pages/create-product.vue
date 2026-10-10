<script setup lang="ts">
import ProductDocumentForm from '~/components/Pages/CreateProduct/ProductDocumentForm.vue'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'New Product - Create new product', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-create-product">
    <ProductDocumentForm />
  </div>
</template>
