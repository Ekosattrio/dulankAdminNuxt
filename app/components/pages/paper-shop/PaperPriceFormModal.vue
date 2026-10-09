<script setup lang="ts">
import type { PaperPrice, PaperPriceFormData, PaperGroup } from '#server/types/paper-shop'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import PaperPriceDimensionBox from '~/components/pages/paper-shop/PaperPriceDimensionBox.vue'
import PaperPriceOrderBox from '~/components/pages/paper-shop/PaperPriceOrderBox.vue'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  price: PaperPrice | null
  groups?: PaperGroup[]
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: PaperPriceFormData): void
}>()

const nama = ref('')
const selectedGroup = ref('Art Paper')
const panjang = ref<number | undefined>(21)
const lebar = ref<number | undefined>(29.7)
const satuanUkuran = ref<'cm' | 'mm'>('cm')
const gramatur = ref<number>(80)
const minOrderVal = ref<number>(1)
const minOrderUnit = ref<'Rim' | 'Lembar'>('Rim')
const kelipatanVal = ref<number>(1)
const kelipatanUnit = ref<'Rim' | 'Lembar'>('Rim')
const hargaVal = ref<number>(50000)
const hargaUnit = ref<'Rim' | 'Lembar'>('Rim')
const isActiveStatus = ref(true)

const availableGroups = computed(() => {
  if (props.groups && props.groups.length > 0) {
    return props.groups.map((g) => g.name)
  }
  return ['Art Carton', 'Art Paper', 'HVS Putih', 'Ivory', 'Duplex', 'BC TIK']
})

watch(
  () => props.price,
  (val) => {
    if (val) {
      nama.value = val.nama || ''
      selectedGroup.value = val.group || 'Art Paper'
      
      if (val.panjang !== undefined && val.lebar !== undefined) {
        panjang.value = val.panjang
        lebar.value = val.lebar
      } else if (val.ukuran && val.ukuran.includes('x')) {
        const parts = val.ukuran.split('x')
        panjang.value = parseFloat(parts[0] || '0') || undefined
        lebar.value = parseFloat(parts[1] || '0') || undefined
      } else {
        panjang.value = 21
        lebar.value = 29.7
      }

      satuanUkuran.value = (val.satuan as 'cm' | 'mm') || 'cm'
      gramatur.value = val.gramatur || 80

      if (val.minOrder) {
        const parts = val.minOrder.split(' ')
        minOrderVal.value = parseFloat(parts[0] || '1') || 1
        minOrderUnit.value = (parts[1]?.toLowerCase() === 'lembar' ? 'Lembar' : 'Rim')
      } else {
        minOrderVal.value = 1
        minOrderUnit.value = 'Rim'
      }

      if (val.kelipatan) {
        const parts = val.kelipatan.split(' ')
        kelipatanVal.value = parseFloat(parts[0] || '1') || 1
        kelipatanUnit.value = (parts[1]?.toLowerCase() === 'lembar' ? 'Lembar' : 'Rim')
      } else {
        kelipatanVal.value = 1
        kelipatanUnit.value = 'Rim'
      }

      hargaVal.value = val.harga || 50000
      hargaUnit.value = minOrderUnit.value
      isActiveStatus.value = val.status === 'Active'
    } else {
      nama.value = ''
      selectedGroup.value = availableGroups.value[0] || 'Art Paper'
      panjang.value = 21
      lebar.value = 29.7
      satuanUkuran.value = 'cm'
      gramatur.value = 80
      minOrderVal.value = 1
      minOrderUnit.value = 'Rim'
      kelipatanVal.value = 1
      kelipatanUnit.value = 'Rim'
      hargaVal.value = 50000
      hargaUnit.value = 'Rim'
      isActiveStatus.value = true
    }
  },
  { immediate: true }
)

function handleSubmit() {
  const groupObj = props.groups?.find((g) => g.name === selectedGroup.value)
  const merk = groupObj?.merk || 'Paperone'
  const ukuran = `${panjang.value || 0}x${lebar.value || 0}`

  const payload: PaperPriceFormData = {
    id: props.price?.id,
    nama: nama.value.trim() || ukuran,
    group: selectedGroup.value,
    merk,
    panjang: panjang.value,
    lebar: lebar.value,
    ukuran,
    satuan: satuanUkuran.value,
    gramatur: gramatur.value,
    minOrder: `${minOrderVal.value} ${minOrderUnit.value.toLowerCase()}`,
    minOrderUnit: minOrderUnit.value,
    kelipatan: `${kelipatanVal.value} ${kelipatanUnit.value.toLowerCase()}`,
    kelipatanUnit: kelipatanUnit.value,
    harga: hargaVal.value,
    hargaUnit: hargaUnit.value,
    status: isActiveStatus.value ? 'Active' : 'Deactive'
  }

  emit('submit', payload)
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="price ? 'Edit Paper Price Item' : 'Add New Paper Price Item'"
    size="lg"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- 1. Nama Kertas (Opsional) -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Nama Kertas (Opsional)</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="nama"
            type="text"
            :class="formControlClass"
            placeholder="e.g. A4, Plano"
          />
        </div>
      </div>

      <!-- 2. Group Kertas tersedia (Radio options) -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Group Kertas tersedia <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <div class="flex flex-wrap gap-2.5">
            <label
              v-for="grp in availableGroups"
              :key="grp"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all"
              :class="
                selectedGroup === grp
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
              "
            >
              <input
                v-model="selectedGroup"
                type="radio"
                name="group-radio"
                :value="grp"
                class="text-amber-600 focus:ring-amber-500 h-3.5 w-3.5"
              />
              {{ grp }}
            </label>
          </div>
        </div>
      </div>

      <!-- 3, 4, 5. Dimensions Box (Panjang, Lebar, Satuan, Gramatur) -->
      <PaperPriceDimensionBox
        v-model:panjang="panjang"
        v-model:lebar="lebar"
        v-model:satuan-ukuran="satuanUkuran"
        v-model:gramatur="gramatur"
      />

      <!-- 6, 7, 8. Order & Price Box (Min Order, Kelipatan, Harga Kertas) -->
      <PaperPriceOrderBox
        v-model:min-order-val="minOrderVal"
        v-model:min-order-unit="minOrderUnit"
        v-model:kelipatan-val="kelipatanVal"
        v-model:kelipatan-unit="kelipatanUnit"
        v-model:harga-val="hargaVal"
        v-model:harga-unit="hargaUnit"
      />

      <!-- 9. Status Toggle -->
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
