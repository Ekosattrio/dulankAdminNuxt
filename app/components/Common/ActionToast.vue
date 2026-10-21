<script setup lang="ts">
import { showActionToast, type ActionToastTone } from '~/utils/actionToast'
const props = withDefaults(defineProps<{ message?: string; tone?: ActionToastTone }>(), { message: '', tone: 'success' })
const emit = defineEmits<{ dismiss: [] }>()
watch(() => props.message, value => {
  if (!value || !import.meta.client) return
  showActionToast(value, /gagal|failed|error|tidak dapat|tidak bisa|invalid|unable|unprocessable|conflict|forbidden|unauthorized|\b[45]\d\d\b/i.test(value) ? 'error' : props.tone)
  emit('dismiss')
}, { immediate: true, flush: 'post' })
</script>
<template><span class="hidden" aria-hidden="true" /></template>
