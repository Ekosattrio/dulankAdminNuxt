<script setup lang="ts">
import CustomersWorkspace from '~/components/Pages/Customers/CustomersWorkspace.vue'

useLegacyPage({ title: 'Customers', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-customers">
    <CustomersWorkspace />
  </div>
</template>
