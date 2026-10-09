<script setup lang="ts">
import type { InputTaxFormData, InputTaxView } from '#server/types/tax-document'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'
const props = defineProps<{ open: boolean; item: InputTaxView | null; busy?: boolean; error?: string }>()
const emit = defineEmits<{ close: []; submit: [payload: InputTaxFormData] }>()
const form = ref<InputTaxFormData>({ id: '', invoiceDate: '', fakturNo: '', credited: 'No' })
watch([() => props.open, () => props.item], ([open, item]) => { if (open && item) form.value = { id: item.id, invoiceDate: item.invoiceDate, fakturNo: item.fakturNo, credited: item.credited } }, { immediate: true })
</script>
<template>
  <SalesDialog :open="open" title="Edit Input Tax" size="lg" :busy="busy" @close="emit('close')"><form v-if="item" class="space-y-4" @submit.prevent="emit('submit', { ...form })">
    <p v-if="error" role="alert" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>
    <div :class="modalFormRowClass"><span :class="modalFormLabelClass">No. Purchase</span><span :class="modalFormInputColClass" class="font-semibold">{{ item.purchaseNo }}</span></div>
    <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Supplier Faktur No. <span class="text-red-500">*</span></label><div :class="modalFormInputColClass"><input v-model="form.fakturNo" :class="formControlClass" required /></div></div>
    <div :class="modalFormRowClass"><span :class="modalFormLabelClass">Supplier Name</span><span :class="modalFormInputColClass">{{ item.supplierName }}</span></div>
    <div :class="modalFormRowClass"><span :class="modalFormLabelClass">Other Tax Base / DPP</span><CurrencyDisplay :value="item.dpp" align="left" :class="modalFormInputColClass" /></div>
    <div :class="modalFormRowClass"><span :class="modalFormLabelClass">VAT - Input Tax</span><CurrencyDisplay :value="item.vat" align="left" bold :class="modalFormInputColClass" /></div>
    <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Date e-tax Invoice <span class="text-red-500">*</span></label><div :class="modalFormInputColClass"><input v-model="form.invoiceDate" type="date" :class="formControlClass" required /></div></div>
    <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Credited</label><div :class="modalFormInputColClass"><select v-model="form.credited" :class="formControlClass"><option value="Yes">Yes</option><option value="No">No</option></select></div></div>
    <div class="flex justify-end gap-2 border-t pt-4"><button type="button" class="h-9 rounded-md border px-4 text-sm" @click="emit('close')">Cancel</button><button type="submit" class="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button></div>
  </form></SalesDialog>
</template>

