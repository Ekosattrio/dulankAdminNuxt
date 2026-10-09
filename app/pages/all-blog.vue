<script setup lang="ts">
import AllBlogWorkspace from '~/components/blog/AllBlogWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'All Blogs',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-all-blog p-4 md:p-6">
    <AllBlogWorkspace />
  </div>
</template>
