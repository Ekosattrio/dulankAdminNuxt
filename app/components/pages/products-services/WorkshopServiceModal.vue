<script setup lang="ts">
import type { WorkshopService, WorkshopServiceCategory, WorkshopServiceFormData } from '#server/types/workshop-service'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'
import { workshopServiceConfig } from '~/utils/workshopServices'

const props = defineProps<{ open: boolean; category: WorkshopServiceCategory; service?: WorkshopService | null; busy?: boolean; error?: string }>()
const emit = defineEmits<{ close: []; submit: [value: WorkshopServiceFormData] }>()

const form = reactive({
  name: '', printingType: 'Offset' as 'Offset' | 'Digital Print' | 'Large Format', maxHeight: 0, maxWidth: 0,
  sizeUnit: 'cm' as 'cm' | 'mm', quantityMinimum: 0, price: 0, priceUnit: 'sheet' as 'pcs' | 'box' | 'sheet' | 'cm2' | 'm2',
  druckPrice: 0, pricePerCm: 0, minimumPrice: 0, standardPrice: 0, standardMinimum: 0,
  halfCutPrice: 0, halfCutMinimum: 0, minimumCalculation: 0,
})

function parseSize(value?: string) {
  const values = value?.match(/[\d.]+/g)?.map(Number) || []
  return { width: values[0] || 0, height: values[1] || 0 }
}

watch(() => [props.open, props.service] as const, () => {
  if (!props.open) return
  const record = props.service
  const size = parseSize(record?.maxSize)
  Object.assign(form, {
    name: record?.name || '', printingType: record?.printingType || 'Offset',
    maxHeight: record?.maxHeight || size.height, maxWidth: record?.maxWidth || size.width,
    sizeUnit: record?.sizeUnit || (props.category === 'die_cutting' ? 'mm' : 'cm'),
    quantityMinimum: record?.quantityMinimum || 0, price: record?.price || 0, priceUnit: record?.priceUnit || 'sheet',
    druckPrice: record?.druckPrice || 0, pricePerCm: record?.pricePerCm || 0, minimumPrice: record?.minimumPrice || 0,
    standardPrice: record?.standardPrice || 0, standardMinimum: record?.standardMinimum || 0,
    halfCutPrice: record?.halfCutPrice || 0, halfCutMinimum: record?.halfCutMinimum || 0,
    minimumCalculation: record?.minimumCalculation || 0,
  })
}, { immediate: true })

function rowClass(multiline = false) { return multiline ? 'grid grid-cols-12 items-start gap-3 sm:gap-4' : modalFormRowClass }
function submit() {
  const maxSize = form.maxWidth && form.maxHeight ? `${form.maxWidth} x ${form.maxHeight} ${props.category === 'die_cutting' ? 'mm' : 'cm'}` : undefined
  const base = { id: props.service?.id, category: props.category, name: form.name.trim(), storeId: props.service?.storeId || '1' }
  let payload: WorkshopServiceFormData
  if (props.category === 'printing') {
    payload = { ...base, printingType: form.printingType, price: form.price, priceUnit: form.priceUnit }
    if (form.printingType !== 'Large Format') Object.assign(payload, { maxHeight: form.maxHeight, maxWidth: form.maxWidth, sizeUnit: form.sizeUnit })
    if (form.printingType === 'Offset') Object.assign(payload, { quantityMinimum: form.quantityMinimum, druckPrice: form.druckPrice })
  } else if (props.category === 'laminate') {
    payload = { ...base, maxSize, pricePerCm: form.pricePerCm, minimumPrice: form.minimumPrice }
  } else if (props.category === 'die_cutting') {
    payload = { ...base, maxSize, standardPrice: form.standardPrice, standardMinimum: form.standardMinimum, halfCutPrice: form.halfCutPrice, halfCutMinimum: form.halfCutMinimum }
  } else {
    payload = { ...base, maxSize, pricePerCm: form.pricePerCm, minimumPrice: form.minimumPrice, minimumCalculation: form.minimumCalculation }
  }
  emit('submit', payload)
}
</script>

<template>
  <SalesDialog :open="open" :title="service ? `Edit ${workshopServiceConfig[category].title.replace(' List', '')}` : workshopServiceConfig[category].addLabel" medium :busy="busy" @close="$emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="error" role="alert" class="rounded-md bg-red-50 p-3 text-xs text-red-700">{{ error }}</p>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">{{ category === 'printing' ? 'Machine Name' : category === 'die_cutting' ? 'Nama (Opsional)' : 'Nama' }}</label><div :class="modalFormInputColClass"><input v-model="form.name" :required="category !== 'die_cutting'" :class="formControlClass" /></div></div>

      <template v-if="category === 'printing'">
        <div :class="rowClass(true)"><span :class="modalFormLabelClass">Printing Type</span><div :class="[modalFormInputColClass, 'grid grid-cols-3 gap-2']"><label v-for="type in ['Offset', 'Digital Print', 'Large Format']" :key="type" :class="['flex min-h-9 cursor-pointer items-center justify-center rounded-md border px-2 text-center text-xs font-semibold', form.printingType === type ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200']"><input v-model="form.printingType" type="radio" :value="type" class="sr-only" />{{ type }}</label></div></div>
        <template v-if="form.printingType !== 'Large Format'">
          <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Max Size Paper Area</label><div :class="[modalFormInputColClass, 'grid grid-cols-2 gap-2']"><input v-model.number="form.maxHeight" type="number" min="0" placeholder="H" :class="formControlClass" /><input v-model.number="form.maxWidth" type="number" min="0" placeholder="W" :class="formControlClass" /></div></div>
          <div :class="modalFormRowClass"><span :class="modalFormLabelClass">Size Unit</span><div :class="[modalFormInputColClass, 'grid grid-cols-2 gap-2']"><label v-for="unit in ['cm', 'mm']" :key="unit" :class="['flex h-9 cursor-pointer items-center justify-center rounded-md border text-xs font-semibold', form.sizeUnit === unit ? 'border-primary bg-primary text-white' : 'border-gray-200']"><input v-model="form.sizeUnit" type="radio" :value="unit" class="sr-only" />{{ unit === 'cm' ? 'Centimeter' : 'Milimeter' }}</label></div></div>
        </template>
        <div v-if="form.printingType === 'Offset'" :class="modalFormRowClass"><label :class="modalFormLabelClass">Qty Minimum</label><div :class="modalFormInputColClass"><input v-model.number="form.quantityMinimum" type="number" min="0" :class="formControlClass" /></div></div>
        <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Price</label><div :class="modalFormInputColClass"><CurrencyInput v-model="form.price" prefix="Rp" align="right" /></div></div>
        <div v-if="form.printingType !== 'Offset'" :class="modalFormRowClass"><label :class="modalFormLabelClass">Unit Price</label><div :class="modalFormInputColClass"><select v-model="form.priceUnit" :class="formControlClass"><option v-if="form.printingType === 'Digital Print'" value="pcs">Pcs</option><option v-if="form.printingType === 'Digital Print'" value="box">Box</option><option v-if="form.printingType === 'Digital Print'" value="sheet">A3+ Sheet</option><option v-if="form.printingType === 'Large Format'" value="cm2">Square Centimeter</option><option v-if="form.printingType === 'Large Format'" value="m2">Square Meter</option></select></div></div>
        <div v-if="form.printingType === 'Offset'" :class="modalFormRowClass"><label :class="modalFormLabelClass">Druck Price</label><div :class="modalFormInputColClass"><CurrencyInput v-model="form.druckPrice" prefix="Rp" align="right" /></div></div>
      </template>

      <template v-else>
        <div :class="modalFormRowClass"><label :class="modalFormLabelClass">{{ category === 'die_cutting' ? 'Ukuran Mesin Pond' : 'Ukuran Maksimal (cm)' }}</label><div :class="[modalFormInputColClass, 'grid grid-cols-2 gap-2']"><input v-model.number="form.maxWidth" type="number" min="0" placeholder="W" :class="formControlClass" /><input v-model.number="form.maxHeight" type="number" min="0" placeholder="H" :class="formControlClass" /></div></div>
        <template v-if="category === 'die_cutting'">
          <p class="border-b border-gray-100 pb-1 text-xs font-bold text-gray-700">Teknik Pond Standard</p>
          <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Harga Jasa per pcs</label><div :class="modalFormInputColClass"><CurrencyInput v-model="form.standardPrice" prefix="Rp" /></div></div>
          <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Harga Minimal</label><div :class="modalFormInputColClass"><CurrencyInput v-model="form.standardMinimum" prefix="Rp" /></div></div>
          <p class="border-b border-gray-100 pb-1 text-xs font-bold text-gray-700">Teknik Pond Setengah Putus</p>
          <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Harga Jasa per pcs</label><div :class="modalFormInputColClass"><CurrencyInput v-model="form.halfCutPrice" prefix="Rp" /></div></div>
          <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Harga Minimal</label><div :class="modalFormInputColClass"><CurrencyInput v-model="form.halfCutMinimum" prefix="Rp" /></div></div>
        </template>
        <template v-else>
          <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Harga per Centimeter</label><div :class="modalFormInputColClass"><CurrencyInput v-model="form.pricePerCm" prefix="Rp" /></div></div>
          <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Harga Minimal</label><div :class="modalFormInputColClass"><CurrencyInput v-model="form.minimumPrice" prefix="Rp" /></div></div>
          <div v-if="category === 'hot_print'" :class="modalFormRowClass"><label :class="modalFormLabelClass">Harga Minim Hitungan</label><div :class="modalFormInputColClass"><CurrencyInput v-model="form.minimumCalculation" prefix="Rp" /></div></div>
        </template>
      </template>

      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4"><button type="button" class="h-9 rounded-md bg-gray-800 px-4 text-xs font-semibold text-white" :disabled="busy" @click="$emit('close')">Cancel</button><button type="submit" class="h-9 rounded-md bg-amber-500 px-4 text-xs font-semibold text-white disabled:opacity-50" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button></div>
    </form>
  </SalesDialog>
</template>
