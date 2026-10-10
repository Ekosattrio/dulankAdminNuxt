<script setup lang="ts">
import PermissionsWorkspace from '~/components/Pages/Roles/PermissionsWorkspace.vue'

useLegacyPage({
  title: 'Permissions',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})
</script>

<template>
  <div class="dulank-page dulank-page-permissions">
    <PermissionsWorkspace />
  </div>
</template>
