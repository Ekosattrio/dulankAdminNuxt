<script setup lang="ts">
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { formControlClass } from '~/utils/salesUi'
const props = defineProps<{ open: boolean; enabled: boolean }>()
const emit = defineEmits<{ close: []; updated: [] }>()
const { setupTwoFactor, confirmTwoFactor, disableTwoFactor } = useSecuritySettings()
const password = ref('')
const code = ref('')
const secret = ref('')
const busy = ref(false)
const error = ref('')
watch(() => props.open, () => { password.value = ''; code.value = ''; secret.value = ''; error.value = '' })
async function submit() {
  if (busy.value) return
  busy.value = true
  error.value = ''
  try {
    if (props.enabled) await disableTwoFactor(password.value)
    else if (!secret.value) { const setup = await setupTwoFactor(password.value); secret.value = setup.secret; password.value = ''; return }
    else await confirmTwoFactor(code.value)
    emit('updated')
    emit('close')
  } catch (cause: any) { error.value = cause?.data?.message || 'Gagal memperbarui autentikasi.' }
  finally { busy.value = false }
}
</script>
<template>
  <SalesDialog :open="open" title="Autentikasi Dua Faktor" @close="!busy && emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="error" role="alert" class="text-sm text-red-600">{{ error }}</p>
      <template v-if="!secret">
        <label class="block text-sm">Password saat ini</label>
        <input v-model="password" type="password" autocomplete="current-password" :class="formControlClass" required />
      </template>
      <template v-else>
        <p class="text-sm">Tambahkan kunci berikut ke aplikasi authenticator, lalu masukkan kode enam digit.</p>
        <code class="block break-all rounded bg-gray-100 p-3 text-sm dark:bg-gray-800">{{ secret }}</code>
        <input v-model="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" :class="formControlClass" required />
      </template>
      <button type="submit" :disabled="busy" class="rounded bg-primary px-4 py-2 text-sm text-white disabled:opacity-50">{{ busy ? 'Memproses...' : enabled ? 'Nonaktifkan' : secret ? 'Konfirmasi' : 'Siapkan Authenticator' }}</button>
    </form>
  </SalesDialog>
</template>
