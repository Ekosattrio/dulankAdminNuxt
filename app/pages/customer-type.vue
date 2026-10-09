<script setup lang="ts">
import CustomerTypeWorkspace from '~/components/pages/customer-type/CustomerTypeWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/customer-type.html'],
})

useLegacyPage({ title: 'Customer Type', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-customer-type">
    <CustomerTypeWorkspace />
  </div>
</template>
