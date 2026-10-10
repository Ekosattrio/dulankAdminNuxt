<script setup lang="ts">
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { modalFormRowClass, modalFormLabelClass, modalFormInputColClass, formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [newPassword: string]
}>()

const current = ref('')
const newPass = ref('')
const confirmPass = ref('')
const errorMsg = ref('')

function handleSubmit() {
  errorMsg.value = ''
  if (!current.value || !newPass.value || !confirmPass.value) {
    errorMsg.value = 'Semua field wajib diisi.'
    return
  }
  if (newPass.value !== confirmPass.value) {
    errorMsg.value = 'Konfirmasi password tidak cocok.'
    return
  }
  if (newPass.value.length < 6) {
    errorMsg.value = 'Password baru minimal 6 karakter.'
    return
  }
  emit('submit', newPass.value)
  current.value = ''
  newPass.value = ''
  confirmPass.value = ''
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Ubah Password Akun"
    max-width="md"
    @close="emit('close')"
  >
    <form class="space-y-4 py-2" @submit.prevent="handleSubmit">
      <div v-if="errorMsg" class="rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
        {{ errorMsg }}
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Password Saat Ini</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="current"
            type="password"
            required
            placeholder="••••••••"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Password Baru</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="newPass"
            type="password"
            required
            placeholder="••••••••"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Ulangi Password</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="confirmPass"
            type="password"
            required
            placeholder="••••••••"
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
          {{ busy ? 'Menyimpan...' : 'Perbarui Password' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

