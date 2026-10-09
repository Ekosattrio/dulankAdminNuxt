<script setup lang="ts">
import PreferenceWorkspace from '~/components/pages/setting/PreferenceWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/preference.html'],
})

useLegacyPage({
  title: 'Preferences',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-preference">
    <PreferenceWorkspace />
  </div>
</template>
