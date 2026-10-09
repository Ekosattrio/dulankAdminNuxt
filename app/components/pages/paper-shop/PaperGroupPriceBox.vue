<script setup lang="ts">
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const priceType = defineModel<'Fix Price' | 'Sample Price'>('priceType', { default: 'Fix Price' })
const price = defineModel<number>('price', { default: 0 })
const unitPrice = defineModel<string>('unitPrice', { default: 'Ream' })
const gramature = defineModel<number | undefined>('gramature')
const paperSize = defineModel<string>('paperSize', { default: '109x79 Cm' })

const emit = defineEmits<{
  (e: 'reset'): void
}>()
</script>

<template>
  <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 p-4 space-y-4">
    <div class="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
      <div>
        <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100">Add Price Group</h5>
        <span class="text-xs italic text-gray-500 dark:text-gray-400">Optional</span>
      </div>
      <button
        type="button"
        class="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1 cursor-pointer"
        @click="emit('reset')"
      >
        <span class="italic">Cancel</span> ✕
      </button>
    </div>

    <!-- Price Type Radio -->
    <div :class="modalFormRowClass">
      <label :class="modalFormLabelClass">Price Type</label>
      <div :class="modalFormInputColClass">
        <div class="flex items-center gap-4">
          <label class="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
            <input
              v-model="priceType"
              type="radio"
              value="Fix Price"
              class="text-primary focus:ring-primary h-4 w-4"
            />
            Fix Price
          </label>
          <label class="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
            <input
              v-model="priceType"
              type="radio"
              value="Sample Price"
              class="text-primary focus:ring-primary h-4 w-4"
            />
            Sample Price
          </label>
        </div>
      </div>
    </div>

    <!-- Dynamic Info for Sample Price -->
    <div
      v-if="priceType === 'Sample Price'"
      class="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-3 text-xs text-amber-900 dark:text-amber-200"
    >
      <p class="font-semibold mb-1">Information :</p>
      <p>
        The entered price will be calculated per kilogram and applied to all sizes and weights within the same paper group
      </p>
    </div>

    <!-- Price Input -->
    <div :class="modalFormRowClass">
      <label :class="modalFormLabelClass">Price</label>
      <div :class="modalFormInputColClass">
        <CurrencyInput v-model="price" placeholder="52.000" />
      </div>
    </div>

    <!-- Unit Price Select -->
    <div :class="modalFormRowClass">
      <label :class="modalFormLabelClass">Unit Price</label>
      <div :class="modalFormInputColClass">
        <select v-model="unitPrice" :class="formControlClass">
          <option value="Kilograms">Kilograms</option>
          <option value="Ream">Ream</option>
          <option value="Pcs">Pcs</option>
        </select>
      </div>
    </div>

    <!-- Sample Fields (Gramature & Paper Size) -->
    <template v-if="priceType === 'Sample Price'">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Gramature</label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="gramature"
            type="number"
            min="0"
            :class="formControlClass"
            placeholder="e.g. 310"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Paper Size</label>
        <div :class="modalFormInputColClass">
          <select v-model="paperSize" :class="formControlClass">
            <option value="109x79 Cm">109x79 Cm</option>
            <option value="90x120 Cm">90x120 Cm</option>
            <option value="65x100 Cm">65x100 Cm</option>
            <option value="61x86 Cm">61x86 Cm</option>
          </select>
        </div>
      </div>
    </template>
  </div>
</template>

