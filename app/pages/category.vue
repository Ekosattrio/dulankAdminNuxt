<script setup lang="ts">
import CategoryWorkspace from '~/components/Category/CategoryWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Category',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-category inventory-master-page">
    <CategoryWorkspace />
  </div>
</template>
