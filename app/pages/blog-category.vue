<script setup lang="ts">
import BlogCategoryWorkspace from '~/components/Blog/BlogCategoryWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Blog Categories',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-blog-category">
    <BlogCategoryWorkspace />
  </div>
</template>
