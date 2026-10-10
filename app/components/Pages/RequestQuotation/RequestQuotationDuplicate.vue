<script setup lang="ts">
import type { RFQItem } from '#server/types/request-quotation'
import type { SalesContact } from '#server/types/sales-document'
const props = defineProps<{ record: RFQItem | null; busy: boolean; error: string }>()
defineEmits<{ close: []; submit: [contact: SalesContact] }>()
const contact = ref<SalesContact>({ name: '', phone: '', email: '', address: '' })
watch(
  () => props.record,
  () => {
    contact.value = { name: '', phone: '', email: '', address: '' }
  },
)
</script>
<template>
  <SalesDialog :open="!!record" title="Duplicate Request for Quotation" :busy="busy" @close="$emit('close')">
    <form @submit.prevent="$emit('submit', contact)">
      <fieldset :disabled="busy" class="space-y-5 disabled:opacity-60">
        <p v-if="error" role="alert" class="text-xs text-red-600">{{ error }}</p>
        <SalesCustomerField v-model="contact" label="To:" :allow-new="false" />
        <div class="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button type="button" :class="salesSecondaryButton" @click="$emit('close')">Cancel</button
          ><button type="submit" :class="salesPrimaryButton">{{ busy ? 'Saving...' : 'Submit' }}</button>
        </div>
      </fieldset>
    </form>
  </SalesDialog>
</template>
