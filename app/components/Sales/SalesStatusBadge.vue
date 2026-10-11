<script setup lang="ts">
import AppBadge from "~/components/Common/AppBadge.vue";

defineProps<{ status: string }>();
</script>

<template>
  <AppBadge :label="status" />
</template>
