<script setup lang="ts">
import CategoryWorkspace from '~/components/category/CategoryWorkspace.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Category',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-category">
    <CategoryWorkspace />
  </div>
</template>
