<script setup lang="ts">
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

useLegacyPage({
  title: 'Blank Page',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-blank space-y-6">
    <SalesListHeader
      title="Blank Page"
      subtitle="Starter page template"
    />
    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <p class="text-sm text-gray-500 dark:text-gray-400">Main content goes here.</p>
    </div>
  </div>
</template>
