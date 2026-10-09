<script setup lang="ts">
import SocialAuthenticationWorkspace from '~/components/pages/setting/SocialAuthenticationWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/social-authentication.html'],
})

useLegacyPage({
  title: 'Social Authentication',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-social-authentication">
    <SocialAuthenticationWorkspace />
  </div>
</template>
