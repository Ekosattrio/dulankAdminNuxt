<script setup lang="ts">
import type { InputTaxFormData, InputTaxView } from '#server/types/tax-document'
import type { DateRangeValue } from '~/composables/useDateRange'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import { useTablePrint } from '~/composables/useTablePrint'
import { isDateInRange } from '~/composables/useDateRange'
import { salesErrorMessage } from '~/utils/salesDocuments'
import InputTaxFormModal from './InputTaxFormModal.vue'
import InputTaxRecordsTable from './InputTaxRecordsTable.vue'
const domain = useInputTaxes()
const search = ref(''); const credited = ref(''); const dateRange = ref<DateRangeValue | null>(null)
const currentPageItems = ref<InputTaxView[]>([]); const editTarget = ref<InputTaxView | null>(null)
const busy = ref(false); const mutationError = ref(''); const message = ref('')
const print = useTablePrint()
const items = computed(() => { const q = search.value.toLowerCase(); return domain.items.value.filter((item) => (!credited.value || item.credited === credited.value) && isDateInRange(item.invoiceDate, dateRange.value) && (!q || [item.purchaseNo, item.fakturNo, item.supplierName].some((value) => value.toLowerCase().includes(q)))) })
async function save(payload: InputTaxFormData) { busy.value = true; mutationError.value = ''; try { const result = await domain.save(payload); editTarget.value = null; message.value = result.message } catch (error) { mutationError.value = salesErrorMessage(error) } finally { busy.value = false } }
const columns = [{ key: 'purchaseNo', label: 'No. Purchase' }, { key: 'invoiceDate', label: 'Date e-tax Invoice' }, { key: 'fakturNo', label: 'Supplier Faktur No.' }, { key: 'supplierName', label: 'Supplier Name' }, { key: 'dpp', label: 'DPP', align: 'right' as const }, { key: 'vat', label: 'VAT - Input Tax', align: 'right' as const }, { key: 'credited', label: 'Credited', align: 'center' as const }]
</script>
<template><div class="space-y-6">
  <SalesListHeader title="Input Tax (Pajak Masukan)" subtitle="Manage your Purchase & Input VAT Invoices" :refreshing="domain.pending.value" @refresh="domain.refresh" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')" />
  <SalesFeedback :pending="domain.pending.value" :error="domain.error.value ? 'Unable to load Input Tax.' : ''" :message="message" skeleton="table" :skeleton-cols="8" @retry="domain.refresh" @dismiss="message = ''" />
  <InputTaxRecordsTable v-if="!domain.pending.value && !domain.error.value" :items="items" :search="search" :credited="credited" :date-range="dateRange" @update:search="search = $event" @update:credited="credited = $event" @update:date-range="dateRange = $event" @update:current-page-items="currentPageItems = $event" @edit="editTarget = $event" />
  <InputTaxFormModal :open="!!editTarget" :item="editTarget" :busy="busy" :error="mutationError" @close="editTarget = null" @submit="save" />
  <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Input Tax Report" :columns="columns" :items="items" :current-page-items="currentPageItems" :initial-date-range="dateRange" :default-action="print.defaultPrintAction.value" date-field="invoiceDate" @close="print.closePrintModal" />
</div></template>

