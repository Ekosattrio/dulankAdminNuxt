<script setup lang="ts">
import MemberWorkspace from '~/components/pages/user/MemberWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/user.html']
})

useLegacyPage({
  title: 'All Members - User Management',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-user p-4 md:p-6">
    <MemberWorkspace />
  </div>
</template>
