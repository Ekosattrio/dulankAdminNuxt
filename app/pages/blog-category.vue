<script setup lang="ts">
import BlogCategoryWorkspace from '~/components/blog/BlogCategoryWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Blog Categories',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-blog-category p-4 md:p-6">
    <BlogCategoryWorkspace />
  </div>
</template>
