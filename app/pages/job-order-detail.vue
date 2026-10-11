<script setup lang="ts">
import JobOrderDetailDocument from '~/components/Pages/JobOrder/JobOrderDetailDocument.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import { useJobOrderDocument } from '~/composables/useJobOrderDocument'

useLegacyPage({ title: 'Job Order Detail', sweetAlert: false })
const { jobOrder, pending, error, refresh } = useJobOrderDocument()
</script>

<template>
  <div class="dulank-page dulank-page-job-order-detail">
    <SalesFeedback :pending="pending" :error="error ? 'Unable to load the selected job order.' : ''" @retry="refresh()" />
    <JobOrderDetailDocument v-if="!pending && !error && jobOrder" :job-order="jobOrder" />
    <div v-else-if="!pending && !error" class="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">No Job Order has been configured for this order.</div>
  </div>
</template>
