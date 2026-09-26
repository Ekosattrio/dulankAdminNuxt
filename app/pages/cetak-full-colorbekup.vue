<script setup lang="ts">
import CetakFullColor from "./cetak-full-color.vue";

definePageMeta({
  layout: "default",
});

useLegacyPage({
  title: 'Cetak Full Color (Backup)',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
});
</script>

<template>
  <CetakFullColor />
</template>
