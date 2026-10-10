<script setup lang="ts">
import type { PaperPrice, PaperPriceFormData, PaperGroup } from '#server/types/paper-shop'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
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

const form = ref<PaperPriceFormData>({
  nama: '',
  group: '',
  merk: '',
  ukuran: '',
  satuan: 'rim',
  gramatur: 80,
  minOrder: '1 rim',
  kelipatan: '1 rim',
  harga: 50000,
  status: 'Active'
})

watch(
  () => props.price,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        nama: val.nama,
        group: val.group,
        merk: val.merk,
        ukuran: val.ukuran,
        satuan: val.satuan,
        gramatur: val.gramatur,
        minOrder: val.minOrder,
        kelipatan: val.kelipatan,
        harga: val.harga,
        status: val.status
      }
    } else {
      const defaultGroup = props.groups?.[0]?.name || 'HVS Putih'
      const defaultMerk = props.groups?.[0]?.merk || 'Paperone'
      form.value = {
        nama: '',
        group: defaultGroup,
        merk: defaultMerk,
        ukuran: '',
        satuan: 'rim',
        gramatur: 80,
        minOrder: '1 rim',
        kelipatan: '1 rim',
        harga: 50000,
        status: 'Active'
      }
    }
  },
  { immediate: true }
)

function onGroupChange() {
  const g = props.groups?.find((group) => group.name === form.value.group)
  if (g) {
    form.value.merk = g.merk
  }
}

function handleSubmit() {
  if (!form.value.nama.trim()) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="price ? 'Edit Harga Kertas' : 'Tambah Harga Kertas'"
    size="lg"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Group Kertas <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-if="groups && groups.length > 0" v-model="form.group" :class="formControlClass" required @change="onGroupChange">
            <option v-for="g in groups" :key="g.id" :value="g.name">
              {{ g.name }}
            </option>
          </select>
          <input
            v-else
            v-model="form.group"
            type="text"
            :class="formControlClass"
            required
            placeholder="e.g. HVS Putih"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Nama Kertas <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.nama"
            type="text"
            :class="formControlClass"
            required
            placeholder="e.g. A4, Plano"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Merk / Brand <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.merk"
            type="text"
            :class="formControlClass"
            required
            placeholder="e.g. Paperone, Sinar Mas"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Ukuran & Satuan</label>
        <div :class="modalFormInputColClass">
          <div class="grid grid-cols-2 gap-2">
            <input
              v-model="form.ukuran"
              type="text"
              :class="formControlClass"
              placeholder="e.g. 21x29.7 cm"
            />
            <select v-model="form.satuan" :class="formControlClass">
              <option value="rim">rim</option>
              <option value="lembar">lembar</option>
              <option value="kg">kg</option>
              <option value="plano">plano</option>
            </select>
          </div>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Gramatur (GSM) <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="form.gramatur"
            type="number"
            min="0"
            :class="formControlClass"
            required
            placeholder="e.g. 80"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Min Order & Order Kelipatan</label>
        <div :class="modalFormInputColClass">
          <div class="grid grid-cols-2 gap-2">
            <input
              v-model="form.minOrder"
              type="text"
              :class="formControlClass"
              placeholder="e.g. 1 rim"
            />
            <input
              v-model="form.kelipatan"
              type="text"
              :class="formControlClass"
              placeholder="e.g. 1 rim"
            />
          </div>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Harga Kertas <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <CurrencyInput v-model="form.harga" placeholder="50.000" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option value="Active">Active</option>
            <option value="Deactive">Deactive</option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="h-9 px-4 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="h-9 px-4 rounded-md bg-primary text-sm font-semibold text-white shadow hover:bg-primary/90 disabled:opacity-50"
          :disabled="busy"
        >
          {{ busy ? 'Saving...' : price ? 'Update Harga' : 'Save Harga' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

