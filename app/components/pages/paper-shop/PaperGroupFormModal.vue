<script setup lang="ts">
import type { PaperGroup, PaperGroupFormData } from '#server/types/paper-shop'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import PaperGroupPriceBox from '~/components/pages/paper-shop/PaperGroupPriceBox.vue'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  group: PaperGroup | null
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: PaperGroupFormData): void
}>()

const form = ref<PaperGroupFormData>({
  name: '',
  merk: '',
  priceType: 'Yes',
  status: 'Active'
})

const priceTypeSelection = ref<'Fix Price' | 'Sample Price'>('Fix Price')
const priceVal = ref<number>(0)
const unitPriceVal = ref<string>('Ream')
const gramatureVal = ref<number | undefined>(undefined)
const paperSizeVal = ref<string>('109x79 Cm')
const isActiveStatus = ref<boolean>(true)

watch(
  () => props.group,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        merk: val.merk,
        priceType: val.priceType || 'Yes',
        status: val.status || 'Active'
      }
      isActiveStatus.value = val.status === 'Active'
      priceTypeSelection.value = (val.priceDetail?.priceType as 'Fix Price' | 'Sample Price') || 'Fix Price'
      priceVal.value = val.price ?? val.priceDetail?.price ?? 0
      unitPriceVal.value = val.unitPrice || val.priceDetail?.unitPrice || 'Ream'
      gramatureVal.value = val.gramature ?? val.priceDetail?.gramature
      paperSizeVal.value = val.paperSize || val.priceDetail?.paperSize || '109x79 Cm'
    } else {
      form.value = {
        name: '',
        merk: '',
        priceType: 'Yes',
        status: 'Active'
      }
      isActiveStatus.value = true
      resetPriceGroup()
    }
  },
  { immediate: true }
)

function resetPriceGroup() {
  priceTypeSelection.value = 'Fix Price'
  priceVal.value = 0
  unitPriceVal.value = 'Ream'
  gramatureVal.value = undefined
  paperSizeVal.value = '109x79 Cm'
}

function handleSubmit() {
  if (!form.value.name.trim()) return

  const payload: PaperGroupFormData = {
    ...form.value,
    status: isActiveStatus.value ? 'Active' : 'Deactive',
    priceDetail: {
      priceType: priceTypeSelection.value,
      price: priceVal.value,
      unitPrice: unitPriceVal.value,
      gramature: gramatureVal.value,
      paperSize: priceTypeSelection.value === 'Sample Price' ? paperSizeVal.value : undefined
    },
    price: priceVal.value,
    unitPrice: unitPriceVal.value,
    gramature: gramatureVal.value,
    paperSize: priceTypeSelection.value === 'Sample Price' ? paperSizeVal.value : undefined
  }

  emit('submit', payload)
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="group ? 'Edit Paper Group' : 'Add Paper Group'"
    size="lg"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Section 1: Group Detail -->
      <div>
        <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 pb-1 border-b border-gray-100 dark:border-gray-800">
          Group Detail
        </h5>

        <div class="space-y-3">
          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Paper Group Name <span class="text-rose-500">*</span></label>
            <div :class="modalFormInputColClass">
              <input
                v-model="form.name"
                type="text"
                :class="formControlClass"
                required
                placeholder="e.g. Art Paper"
              />
            </div>
          </div>

          <div :class="modalFormRowClass">
            <label :class="modalFormLabelClass">Merk <span class="text-rose-500">*</span></label>
            <div :class="modalFormInputColClass">
              <input
                v-model="form.merk"
                type="text"
                :class="formControlClass"
                required
                placeholder="e.g. Pindo Deli"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Box Add Price Group (Decomposed) -->
      <PaperGroupPriceBox
        v-model:price-type="priceTypeSelection"
        v-model:price="priceVal"
        v-model:unit-price="unitPriceVal"
        v-model:gramature="gramatureVal"
        v-model:paper-size="paperSizeVal"
        @reset="resetPriceGroup"
      />

      <!-- Section 3: Status Toggle -->
      <div class="flex items-center justify-between py-2 border-y border-gray-100 dark:border-gray-800">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
        <label class="inline-flex items-center gap-2 cursor-pointer">
          <input
            v-model="isActiveStatus"
            type="checkbox"
            class="sr-only peer"
          />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          <span class="text-sm font-medium text-gray-800 dark:text-gray-200">
            {{ isActiveStatus ? 'Active' : 'Deactive' }}
          </span>
        </label>
      </div>

      <!-- Footer Buttons -->
      <div class="flex items-center justify-end gap-3 pt-3">
        <button
          type="button"
          class="h-9 px-4 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="h-9 px-5 rounded-md bg-amber-500 hover:bg-amber-600 text-sm font-semibold text-white shadow disabled:opacity-50"
          :disabled="busy"
        >
          {{ busy ? 'Saving...' : 'Submit' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
