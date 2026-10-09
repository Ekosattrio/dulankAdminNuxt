<script setup lang="ts">
import RolePermissionsWorkspace from '~/components/pages/roles/RolePermissionsWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/role-permissions.html']
})

useLegacyPage({
  title: 'Roles & Permission - User Management',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-role-permissions p-4 md:p-6">
    <RolePermissionsWorkspace />
  </div>
</template>
