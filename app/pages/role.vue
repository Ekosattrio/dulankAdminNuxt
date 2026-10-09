<script setup lang="ts">
import PermissionMatrixWorkspace from '~/components/pages/roles/PermissionMatrixWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Permissions Matrix - User Management',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-role p-4 md:p-6">
    <PermissionMatrixWorkspace />
  </div>
</template>
