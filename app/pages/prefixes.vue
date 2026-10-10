<script setup lang="ts">
import PrefixesSettingWorkspace from '~/components/Pages/Setting/PrefixesSettingWorkspace.vue'

definePageMeta({
  layout: 'default'
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
