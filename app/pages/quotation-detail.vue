<script setup lang="ts">
import QuotationDetailDocument from '~/components/Pages/Quotation/QuotationDetailDocument.vue'
import type { Quotation } from '#server/types/quotation'

useLegacyPage({ title: 'Quotation Detail', sweetAlert: false })
const route = useRoute()
const { quotations, pending, error, refresh, saveQuotation } = useQuotations()
const selectedId = computed(() => String(route.query.id || route.query.no || ''))
const record = computed(() => quotations.value.find((item) => item.id === selectedId.value || item.noQuotation === selectedId.value))
const busy = ref(false)
const message = ref('')
const actionError = ref('')
async function updateStatus(status: Quotation['status']) {
  if (!record.value || busy.value) return
  busy.value = true
  actionError.value = ''
  try {
    await saveQuotation({ ...record.value, status })
    message.value = status === 'Ordered' ? 'Quotation accepted.' : 'Quotation rejected.'
  } catch (cause) { actionError.value = salesErrorMessage(cause) } finally { busy.value = false }
}
</script>

<template>
  <QuotationDetailDocument v-if="record" :record="record" :busy="busy" :message="message" :error="actionError" @status="updateStatus" />
  <SalesFeedback v-else :pending="pending" :error="error ? 'Unable to load quotation.' : !pending ? 'Quotation not found.' : ''" @retry="refresh()" />
</template>
