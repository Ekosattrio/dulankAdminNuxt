<script setup lang="ts">
import SocialAuthenticationWorkspace from '~/components/pages/setting/SocialAuthenticationWorkspace.vue'

useLegacyPage({
  title: 'Social Authentication',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-social-authentication">
    <SocialAuthenticationWorkspace />
  </div>
</template>
