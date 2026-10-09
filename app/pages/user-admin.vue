<script setup lang="ts">
import UserAdminWorkspace from '~/components/pages/user-admin/UserAdminWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/user-admin.html']
})

useLegacyPage({
  title: 'User Admin - User Management',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-user-admin p-4 md:p-6">
    <UserAdminWorkspace />
  </div>
</template>
