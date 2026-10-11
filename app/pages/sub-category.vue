<script setup lang="ts">
import SubCategoryWorkspace from '~/components/SubCategory/SubCategoryWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Sub Category',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-sub-category inventory-master-page">
    <SubCategoryWorkspace />
  </div>
</template>
