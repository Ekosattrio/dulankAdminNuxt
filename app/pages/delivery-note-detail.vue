<script setup lang="ts">
import DeliveryNoteDetailDocument from '~/components/Pages/DeliveryNote/DeliveryNoteDetailDocument.vue'
import type { DeliveryNote } from '#server/types/delivery-note'

useLegacyPage({ title: 'Delivery Note Detail', sweetAlert: false })
const route = useRoute()
const { deliveryNotes, pending, error, refresh, saveDeliveryNote } = useDeliveryNotes()
const selectedId = computed(() => String(route.query.id || route.query.no || ''))
const record = computed(() => deliveryNotes.value.find((item) => item.id === selectedId.value || item.dnNo === selectedId.value))
const busy = ref(false)
const message = ref('')
const actionError = ref('')
async function updateStatus(status: DeliveryNote['status']) {
  if (!record.value || busy.value) return
  busy.value = true
  actionError.value = ''
  try {
    await saveDeliveryNote({ ...record.value, status })
    message.value = status === 'Complete' ? 'Delivery Note marked as Complete.' : 'Delivery Note marked as Rescheduled.'
  } catch (cause) { actionError.value = salesErrorMessage(cause) } finally { busy.value = false }
}
</script>

<template>
  <DeliveryNoteDetailDocument v-if="record" :record="record" :busy="busy" :message="message" :error="actionError" @status="updateStatus" />
  <SalesFeedback v-else :pending="pending" :error="error ? 'Unable to load delivery note.' : !pending ? 'Delivery note not found.' : ''" @retry="refresh()" />
</template>
