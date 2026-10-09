<script setup lang="ts">
import type { CalculatorDashboardUser } from '#server/types/calculator-dashboard'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { modalFormRowClass, modalFormLabelClass, modalFormInputColClass, formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  user: CalculatorDashboardUser | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: Partial<CalculatorDashboardUser>]
}>()

const form = ref({
  user: '',
  calculate: 0,
  request: 0,
  usage: 0,
  status: 'Active' as 'Active' | 'Disabled'
})

watch(() => props.user, (val) => {
  if (val) {
    form.value = {
      user: val.user,
      calculate: val.calculate,
      request: val.request,
      usage: val.usage,
      status: val.status
    }
  }
}, { immediate: true })

function handleSubmit() {
  emit('submit', {
    user: form.value.user,
    calculate: Number(form.value.calculate),
    request: Number(form.value.request),
    usage: Number(form.value.usage),
    status: form.value.status
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Edit Data User Kalkulator"
    max-width="md"
    @close="emit('close')"
  >
    <form class="space-y-4 py-2" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Nama User</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.user"
            type="text"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Total Calculate</label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="form.calculate"
            type="number"
            min="0"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Total Request</label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="form.request"
            type="number"
            min="0"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Usage (%)</label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="form.usage"
            type="number"
            min="0"
            max="100"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button
          type="button"
          class="h-9 rounded-md border border-gray-300 px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
          :disabled="busy"
          @click="emit('close')"
        >
          Batal
        </button>
        <button
          type="submit"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-white shadow hover:bg-primary/90 disabled:opacity-50"
          :disabled="busy"
        >
          {{ busy ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

