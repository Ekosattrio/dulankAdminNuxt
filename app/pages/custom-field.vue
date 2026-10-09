<script setup lang="ts">
import CustomFieldWorkspace from '~/components/pages/setting/CustomFieldWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/custom-field.html'],
})

useLegacyPage({
  title: 'Custom Fields',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-custom-field">
    <CustomFieldWorkspace />
  </div>
</template>
