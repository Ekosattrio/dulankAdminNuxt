<script setup lang="ts">
import PermissionsWorkspace from '~/components/pages/roles/PermissionsWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/permissions.html'],
})

useLegacyPage({
  title: 'Permissions',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-permissions">
    <PermissionsWorkspace />
  </div>
</template>
