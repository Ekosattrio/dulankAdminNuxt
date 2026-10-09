<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import type { EmailConfig } from '#server/types/system-settings'

const props = defineProps<{
  open: boolean
  busy: boolean
  form: EmailConfig
}>()

const emit = defineEmits<{
  'send-test': [email: string]
  close: []
}>()

const testEmailAddress = ref('')

function handleSubmit() {
  if (testEmailAddress.value) {
    emit('send-test', testEmailAddress.value)
  }
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Send Test Email"
    :busy="busy"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Kirimkan pesan uji coba untuk memverifikasi bahwa kredensial SMTP, Host, Port, dan Autentikasi berfungsi dengan baik.
      </p>

      <div>
        <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
          Email Penerima Uji Coba <span class="text-red-500">*</span>
        </label>
        <input
          v-model="testEmailAddress"
          type="email"
          required
          placeholder="nama@domain.com"
          class="h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div class="rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-800/60 dark:text-gray-400 space-y-1">
        <div class="font-medium text-gray-700 dark:text-gray-300">Parameter Uji Coba:</div>
        <div>• Host: <span class="font-mono">{{ form.mailHost || '-' }}</span> (Port {{ form.mailPort }})</div>
        <div>• Pengirim: <span class="font-mono">{{ form.fromEmail || '-' }}</span> ({{ form.fromName || '-' }})</div>
        <div>• Enkripsi: <span class="font-mono uppercase">{{ form.mailEncryption }}</span></div>
      </div>

      <div class="flex justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="emit('close')"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="busy"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
        >
          <span v-if="busy" class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          <FeatherIcon v-else name="send" :size="14" />
          <span>{{ busy ? 'Mengirim...' : 'Kirim Sekarang' }}</span>
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

