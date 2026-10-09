<script setup lang="ts">
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { modalFormRowClass, modalFormLabelClass, modalFormInputColClass, formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  type: 'phone' | 'email'
  currentValue: string
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [value: string]
}>()

const value = ref('')

watch(() => props.currentValue, (val) => {
  value.value = val || ''
}, { immediate: true })

function handleSubmit() {
  if (!value.value.trim()) return
  emit('submit', value.value.trim())
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="type === 'phone' ? 'Ubah Nomor Telepon Verifikasi' : 'Ubah Alamat Email Verifikasi'"
    max-width="md"
    @close="emit('close')"
  >
    <form class="space-y-4 py-2" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">{{ type === 'phone' ? 'Nomor Telepon' : 'Alamat Email' }}</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="value"
            :type="type === 'phone' ? 'tel' : 'email'"
            required
            :placeholder="type === 'phone' ? '+628123456789' : 'nama@domain.com'"
            :class="formControlClass"
          />
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

