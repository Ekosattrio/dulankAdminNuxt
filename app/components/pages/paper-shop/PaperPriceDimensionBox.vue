<script setup lang="ts">
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const panjang = defineModel<number | undefined>('panjang', { default: 21 })
const lebar = defineModel<number | undefined>('lebar', { default: 29.7 })
const satuanUkuran = defineModel<'cm' | 'mm'>('satuanUkuran', { default: 'cm' })
const gramatur = defineModel<number>('gramatur', { default: 80 })
</script>

<template>
  <div class="space-y-4">
    <!-- Ukuran Area Kertas (P & L input group) -->
    <div :class="modalFormRowClass">
      <label :class="modalFormLabelClass">Ukuran Area Kertas <span class="text-rose-500">*</span></label>
      <div :class="modalFormInputColClass">
        <div class="grid grid-cols-2 gap-3">
          <div class="flex rounded-md shadow-xs">
            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">
              P
            </span>
            <input
              v-model.number="panjang"
              type="number"
              step="0.1"
              min="0"
              class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-900 focus:border-primary focus:ring-primary h-9"
              required
              placeholder="Panjang"
            />
          </div>
          <div class="flex rounded-md shadow-xs">
            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-600 dark:text-gray-300">
              L
            </span>
            <input
              v-model.number="lebar"
              type="number"
              step="0.1"
              min="0"
              class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-900 focus:border-primary focus:ring-primary h-9"
              required
              placeholder="Lebar"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Pilih Satuan Ukuran (Centimeter / Milimeter Radio Pills) -->
    <div :class="modalFormRowClass">
      <label :class="modalFormLabelClass">Pilih Satuan Ukuran</label>
      <div :class="modalFormInputColClass">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer"
            :class="
              satuanUkuran === 'cm'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-primary'
            "
            @click="satuanUkuran = 'cm'"
          >
            Centimeter
          </button>
          <button
            type="button"
            class="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer"
            :class="
              satuanUkuran === 'mm'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-primary'
            "
            @click="satuanUkuran = 'mm'"
          >
            Milimeter
          </button>
        </div>
      </div>
    </div>

    <!-- Masukan Gramatur -->
    <div :class="modalFormRowClass">
      <label :class="modalFormLabelClass">Masukan Gramatur <span class="text-rose-500">*</span></label>
      <div :class="modalFormInputColClass">
        <input
          v-model.number="gramatur"
          type="number"
          min="0"
          :class="formControlClass"
          required
          placeholder="e.g. 80, 150, 260"
        />
      </div>
    </div>
  </div>
</template>

