<script setup lang="ts">
import LanguageWorkspace from '~/components/pages/language/LanguageWorkspace.vue'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Language', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-language">
    <LanguageWorkspace />
  </div>
</template>
