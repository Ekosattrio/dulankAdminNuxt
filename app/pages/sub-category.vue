<script setup lang="ts">
import SubCategoryWorkspace from '~/components/sub-category/SubCategoryWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Sub Category',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-sub-category">
    <SubCategoryWorkspace />
  </div>
</template>
