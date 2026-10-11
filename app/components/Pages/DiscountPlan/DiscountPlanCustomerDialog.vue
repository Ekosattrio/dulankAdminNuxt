<script setup lang="ts">
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass, salesPrimaryButton, salesSecondaryButton } from '~/utils/salesUi'
const props = defineProps<{ open: boolean; busy?: boolean; error?: string }>()
const emit = defineEmits<{ close: []; submit: [name: string] }>()
const name = ref(''), localError = ref('')
watch(() => props.open, (open) => { if (open) { name.value = ''; localError.value = '' } })
function submit() { if (!name.value.trim()) return void (localError.value = 'Customer is required'); emit('submit', name.value.trim()) }
</script>

<template>
  <SalesDialog :open="open" title="Add Customer" :busy="busy" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="localError || error" role="alert" class="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ localError || error }}</p>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Customer <span class="text-rose-600">*</span></label><div :class="modalFormInputColClass"><input v-model="name" :class="formControlClass" required /></div></div>
      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800"><button type="button" :class="salesSecondaryButton" :disabled="busy" @click="emit('close')">Cancel</button><button type="submit" :class="salesPrimaryButton" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button></div>
    </form>
  </SalesDialog>
</template>
