<script setup lang="ts">
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import { modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const minOrderVal = defineModel<number>('minOrderVal', { default: 1 })
const minOrderUnit = defineModel<'Rim' | 'Lembar'>('minOrderUnit', { default: 'Rim' })
const kelipatanVal = defineModel<number>('kelipatanVal', { default: 1 })
const kelipatanUnit = defineModel<'Rim' | 'Lembar'>('kelipatanUnit', { default: 'Rim' })
const hargaVal = defineModel<number>('hargaVal', { default: 50000 })
const hargaUnit = defineModel<'Rim' | 'Lembar'>('hargaUnit', { default: 'Rim' })
</script>

<template>
  <div class="space-y-4">
    <!-- Minimal Order (Value + Unit Radio) -->
    <div :class="modalFormRowClass">
      <label :class="modalFormLabelClass">Minimal Order</label>
      <div :class="modalFormInputColClass">
        <div class="flex items-center gap-2">
          <input
            v-model.number="minOrderVal"
            type="number"
            min="1"
            class="w-32 rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-900 focus:border-primary focus:ring-primary h-9"
            placeholder="Qty"
          />
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer"
              :class="
                minOrderUnit === 'Rim'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
              "
              @click="minOrderUnit = 'Rim'"
            >
              Rim
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer"
              :class="
                minOrderUnit === 'Lembar'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
              "
              @click="minOrderUnit = 'Lembar'"
            >
              Lembar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Kelipatan (Value + Unit Radio) -->
    <div :class="modalFormRowClass">
      <label :class="modalFormLabelClass">Order Kelipatan</label>
      <div :class="modalFormInputColClass">
        <div class="flex items-center gap-2">
          <input
            v-model.number="kelipatanVal"
            type="number"
            min="1"
            class="w-32 rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-900 focus:border-primary focus:ring-primary h-9"
            placeholder="Qty"
          />
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer"
              :class="
                kelipatanUnit === 'Rim'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
              "
              @click="kelipatanUnit = 'Rim'"
            >
              Rim
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer"
              :class="
                kelipatanUnit === 'Lembar'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
              "
              @click="kelipatanUnit = 'Lembar'"
            >
              Lembar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Harga Kertas (CurrencyInput + Unit Radio) -->
    <div :class="modalFormRowClass">
      <label :class="modalFormLabelClass">Harga Kertas <span class="text-rose-500">*</span></label>
      <div :class="modalFormInputColClass">
        <div class="flex items-center gap-2">
          <div class="flex-1">
            <CurrencyInput v-model="hargaVal" placeholder="50.000" />
          </div>
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer"
              :class="
                hargaUnit === 'Rim'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
              "
              @click="hargaUnit = 'Rim'"
            >
              Rim
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer"
              :class="
                hargaUnit === 'Lembar'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
              "
              @click="hargaUnit = 'Lembar'"
            >
              Lembar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

