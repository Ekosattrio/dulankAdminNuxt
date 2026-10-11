<script setup lang="ts">
defineProps<{ title: string; backTo: string; backLabel: string; busy?: boolean }>()
defineEmits<{ print: [] }>()
</script>

<template>
  <div class="mb-4 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
    <div class="flex min-w-0 items-center gap-3">
      <h1 class="app-page-title truncate">{{ title }}</h1>
      <slot name="status" />
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <NuxtLink :to="backTo" :class="salesSecondaryButton">
        <FeatherIcon name="arrow-left" :size="14" />{{ backLabel }}
      </NuxtLink>
      <button type="button" :class="salesSecondaryButton" title="Export PDF" :disabled="busy" @click="$emit('print')">
        <FeatherIcon name="file-text" :size="14" />PDF
      </button>
      <button type="button" :class="salesPrimaryButton" :disabled="busy" @click="$emit('print')">
        <FeatherIcon name="printer" :size="14" />Print
      </button>
    </div>
  </div>
</template>
