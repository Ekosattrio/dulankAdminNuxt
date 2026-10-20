<script setup lang="ts">
import RolePermissionsWorkspace from '~/components/Pages/Roles/RolePermissionsWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Roles & Permission - User Management',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-role-permissions">
    <RolePermissionsWorkspace />
  </div>
</template>
