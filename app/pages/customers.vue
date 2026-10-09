<script setup lang="ts">
import CustomersWorkspace from '~/components/pages/customers/CustomersWorkspace.vue'

useLegacyPage({ title: 'Customers', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-customers">
    <CustomersWorkspace />
  </div>
</template>
