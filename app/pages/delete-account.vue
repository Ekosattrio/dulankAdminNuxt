<script setup lang="ts">
import DeleteAccountWorkspace from '~/components/Pages/DeleteAccount/DeleteAccountWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Delete Account Request - User Management',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-delete-account p-4 md:p-6">
    <DeleteAccountWorkspace />
  </div>
</template>
