<script setup lang="ts">
import ProfileWorkspace from '~/components/Pages/Setting/ProfileWorkspace.vue'

definePageMeta({
  layout: 'default'
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
