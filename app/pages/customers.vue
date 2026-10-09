<script setup lang="ts">
import CustomersWorkspace from '~/components/pages/customers/CustomersWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/customers.html']
})

useLegacyPage({
  title: 'Customer List',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-customers">
    <CustomersWorkspace />
  </div>
</template>
