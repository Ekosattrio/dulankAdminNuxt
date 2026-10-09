<script setup lang="ts">
import SupplierWorkspace from '~/components/pages/supplier/SupplierWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/supplier.html']
})

useLegacyPage({
  title: 'Supplier List',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-supplier">
    <SupplierWorkspace />
  </div>
</template>
