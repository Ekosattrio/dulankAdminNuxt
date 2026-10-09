<script setup lang="ts">
import StoreListWorkspace from '~/components/pages/store-list/StoreListWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/store-list.html'],
})

useLegacyPage({ title: 'Stores - Toko & Cabang Percetakan', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-store-list">
    <StoreListWorkspace />
  </div>
</template>
