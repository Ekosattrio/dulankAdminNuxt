<script setup lang="ts">
import ProfileWorkspace from '~/components/pages/setting/ProfileWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/profile.html'],
})

useLegacyPage({
  title: 'Profile Settings - Kacetak System',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-profile">
    <ProfileWorkspace />
  </div>
</template>
