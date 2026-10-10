<script setup lang="ts">
import AddressWorkspace from '~/components/Pages/Address/AddressWorkspace.vue'

useLegacyPage({ title: 'Address List', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-address">
    <AddressWorkspace />
  </div>
</template>
