<script setup lang="ts">
import type { OutputTaxFormData, OutputTaxView } from '#server/types/tax-document'
import type { DateRangeValue } from '~/composables/useDateRange'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import { isDateInRange } from '~/composables/useDateRange'
import { useTablePrint } from '~/composables/useTablePrint'
import { salesErrorMessage } from '~/utils/salesDocuments'
import { taxTransactionCodeOptions } from '~/utils/taxDocuments'
import OutputTaxFormModal from './OutputTaxFormModal.vue'
import OutputTaxRecordsTable from './OutputTaxRecordsTable.vue'
const domain = useOutputTaxes(); const search = ref(''); const txCode = ref(''); const dateRange = ref<DateRangeValue | null>(null)
const currentPageItems = ref<OutputTaxView[]>([]); const editTarget = ref<OutputTaxView | null>(null); const deleteTarget = ref<OutputTaxView | null>(null)
const busy = ref(false); const mutationError = ref(''); const message = ref(''); const print = useTablePrint()
const txCodes = [...taxTransactionCodeOptions]
const items = computed(() => { const q = search.value.toLowerCase(); return domain.items.value.filter((item) => (!txCode.value || item.txCode === txCode.value) && isDateInRange(item.etaxDate, dateRange.value) && (!q || [item.salesNo, item.etaxNumber, item.customerName].some((value) => value.toLowerCase().includes(q)))) })
async function save(payload: OutputTaxFormData) { busy.value = true; mutationError.value = ''; try { const result = await domain.save(payload); editTarget.value = null; message.value = result.message } catch (error) { mutationError.value = salesErrorMessage(error) } finally { busy.value = false } }
async function remove() { if (!deleteTarget.value) return; busy.value = true; mutationError.value = ''; try { const result = await domain.remove(deleteTarget.value.id); deleteTarget.value = null; message.value = result.message } catch (error) { mutationError.value = salesErrorMessage(error) } finally { busy.value = false } }
const columns = [{ key: 'salesNo', label: 'No Sales' }, { key: 'etaxDate', label: 'E-Tax Date' }, { key: 'etaxNumber', label: 'E-tax Invoice Number' }, { key: 'customerName', label: 'Customer Name' }, { key: 'dpp', label: 'DPP', align: 'right' as const }, { key: 'vat', label: 'VAT - Output Tax', align: 'right' as const }, { key: 'txCode', label: 'Transaction Code' }, { key: 'total', label: 'Total', align: 'right' as const }, { key: 'status', label: 'Status' }]
</script>
<template><div class="space-y-6">
  <SalesListHeader title="Output Tax (Pajak Keluaran)" subtitle="Manage your Sales & Output VAT Invoices" :refreshing="domain.pending.value" @refresh="domain.refresh" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')" />
  <SalesFeedback :pending="domain.pending.value" :error="domain.error.value ? 'Unable to load Output Tax.' : ''" :message="message" skeleton="table" :skeleton-cols="10" @retry="domain.refresh" @dismiss="message = ''" />
  <OutputTaxRecordsTable v-if="!domain.pending.value && !domain.error.value" :items="items" :search="search" :tx-code="txCode" :tx-codes="txCodes" :date-range="dateRange" @update:search="search = $event" @update:tx-code="txCode = $event" @update:date-range="dateRange = $event" @update:current-page-items="currentPageItems = $event" @edit="editTarget = $event" @delete="deleteTarget = $event" />
  <OutputTaxFormModal :open="!!editTarget" :item="editTarget" :tx-codes="txCodes" :busy="busy" :error="mutationError" @close="editTarget = null" @submit="save" />
  <SalesConfirmDelete :open="!!deleteTarget" title="Delete Invoice Record" message="This cancels the tax document without deleting its source Sales transaction." :busy="busy" :error="mutationError" @close="deleteTarget = null" @confirm="remove" />
  <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Output Tax Report" :columns="columns" :items="items" :current-page-items="currentPageItems" :initial-date-range="dateRange" :default-action="print.defaultPrintAction.value" date-field="etaxDate" @close="print.closePrintModal" />
</div></template>

