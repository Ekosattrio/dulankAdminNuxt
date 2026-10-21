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
  <div class="dulank-page dulank-page-user">
    <MemberWorkspace />
  </div>
</template>
