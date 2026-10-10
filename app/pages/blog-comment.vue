<script setup lang="ts">
import BlogCommentWorkspace from '~/components/Blog/BlogCommentWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Blog Comments',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-blog-comment p-4 md:p-6">
    <BlogCommentWorkspace />
  </div>
</template>
