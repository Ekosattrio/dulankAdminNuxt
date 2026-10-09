<script setup lang="ts">
import BlogTagWorkspace from '~/components/blog/BlogTagWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Blog Tags',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-blog-tag p-4 md:p-6">
    <BlogTagWorkspace />
  </div>
</template>
