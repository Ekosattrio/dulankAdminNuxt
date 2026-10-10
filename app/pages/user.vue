<script setup lang="ts">
import MemberWorkspace from '~/components/Pages/User/MemberWorkspace.vue'

definePageMeta({
  layout: 'default',
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
