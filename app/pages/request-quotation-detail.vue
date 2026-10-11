<script setup lang="ts">
import RequestQuotationDetailDocument from '~/components/Pages/RequestQuotation/RequestQuotationDetailDocument.vue'
import type { RFQItem } from '#server/types/request-quotation'

useLegacyPage({ title: 'Request Quotation Detail', sweetAlert: false })
const route = useRoute()
const { rfqs, pending, error, refresh, saveRequestQuotation } = useRequestQuotations()
const selectedId = computed(() => String(route.query.id || route.query.no || ''))
const record = computed(() => rfqs.value.find((item) => item.id === selectedId.value || item.noRequest === selectedId.value))
const busy = ref(false)
const message = ref('')
const actionError = ref('')
async function updateStatus(status: RFQItem['status']) {
  if (!record.value || busy.value) return
  busy.value = true
  actionError.value = ''
  try {
    await saveRequestQuotation({ ...record.value, status })
    message.value = status === 'Ordered' ? 'Request quotation ordered.' : 'Request quotation marked unavailable.'
  } catch (cause) { actionError.value = salesErrorMessage(cause) } finally { busy.value = false }
}
</script>

<template>
  <RequestQuotationDetailDocument v-if="record" :record="record" :busy="busy" :message="message" :error="actionError" @status="updateStatus" />
  <SalesFeedback v-else :pending="pending" :error="error ? 'Unable to load request quotation.' : !pending ? 'Request quotation not found.' : ''" @retry="refresh()" />
</template>
