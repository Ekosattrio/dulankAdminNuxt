<script setup lang="ts">
import PrefixesSettingWorkspace from '~/components/pages/setting/PrefixesSettingWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/prefixes.html'],
})

useLegacyPage({
  title: 'Prefix Settings',
  sweetAlert: false
})
</script>

<template>
  <div class="dulank-page dulank-page-prefixes">
    <PrefixesSettingWorkspace />
  </div>
</template>
