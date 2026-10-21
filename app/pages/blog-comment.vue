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
  <div class="dulank-page dulank-page-blog-comment">
    <BlogCommentWorkspace />
  </div>
</template>
