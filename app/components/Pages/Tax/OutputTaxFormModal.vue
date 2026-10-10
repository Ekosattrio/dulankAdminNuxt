<script setup lang="ts">
import type { OutputTaxFormData, OutputTaxView } from '#server/types/tax-document'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'
const props = defineProps<{ open: boolean; item: OutputTaxView | null; txCodes: string[]; busy?: boolean; error?: string }>()
const emit = defineEmits<{ close: []; submit: [payload: OutputTaxFormData] }>()
const form = ref<OutputTaxFormData>({ id: '', etaxDate: '', etaxNumber: '', txCode: '', status: 'Draft' })
watch([() => props.open, () => props.item], ([open, item]) => { if (open && item) form.value = { id: item.id, etaxDate: item.etaxDate, etaxNumber: item.etaxNumber, txCode: item.txCode, status: item.status } }, { immediate: true })
</script>
<template>
  <SalesDialog :open="open" title="Edit Output Tax" size="lg" :busy="busy" @close="emit('close')"><form v-if="item" class="space-y-4" @submit.prevent="emit('submit', { ...form })">
    <p v-if="error" role="alert" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>
    <div :class="modalFormRowClass"><span :class="modalFormLabelClass">No Sales</span><span :class="modalFormInputColClass" class="font-semibold">{{ item.salesNo }}</span></div>
    <div :class="modalFormRowClass"><span :class="modalFormLabelClass">Customer Name</span><span :class="modalFormInputColClass">{{ item.customerName }}</span></div>
    <div :class="modalFormRowClass"><span :class="modalFormLabelClass">Other Tax Base / DPP</span><CurrencyDisplay :value="item.dpp" align="left" :class="modalFormInputColClass" /></div>
    <div :class="modalFormRowClass"><span :class="modalFormLabelClass">VAT - Output Tax</span><CurrencyDisplay :value="item.vat" align="left" bold :class="modalFormInputColClass" /></div>
    <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Transaction Code</label><div :class="modalFormInputColClass"><select v-model="form.txCode" :class="formControlClass"><option v-for="code in txCodes" :key="code" :value="code">{{ code }}</option></select></div></div>
    <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Date e-tax Invoice</label><div :class="modalFormInputColClass"><input v-model="form.etaxDate" type="date" :class="formControlClass" required /></div></div>
    <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Number e-tax Invoice</label><div :class="modalFormInputColClass"><input v-model="form.etaxNumber" :class="formControlClass" required /></div></div>
    <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Status</label><div :class="modalFormInputColClass"><select v-model="form.status" :class="formControlClass"><option value="Issued">Issued</option><option value="Draft">Draft</option><option value="Cancelled">Cancelled</option></select></div></div>
    <div class="flex justify-end gap-2 border-t pt-4"><button type="button" class="h-9 rounded-md border px-4 text-sm" @click="emit('close')">Cancel</button><button type="submit" class="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button></div>
  </form></SalesDialog>
</template>

