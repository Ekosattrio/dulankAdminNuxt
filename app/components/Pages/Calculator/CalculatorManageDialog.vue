<script setup lang="ts">
import type { CalculatorModerationInput, CalculatorPartner } from '#server/types/calculator-marketplace'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'

const props = defineProps<{ open: boolean; partner: Pick<CalculatorPartner, 'id' | 'name'> | null; busy?: boolean; error?: string }>()
const emit = defineEmits<{ close: []; submit: [value: CalculatorModerationInput] }>()

const form = reactive<CalculatorModerationInput>({ action: 'warning', freezeDays: 7, notification: 'whatsapp', message: '' })
watch(() => props.open, (open) => {
  if (open) Object.assign(form, { action: 'warning', freezeDays: 7, notification: 'whatsapp', message: '' })
})

function submit() {
  emit('submit', { ...form, message: form.message.trim() })
}
</script>

<template>
  <SalesDialog :open="open" :title="`Manage: ${partner?.name || ''}`" medium :busy="busy" @close="$emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p class="text-xs text-gray-500">Pilih tindakan untuk sumber data ini. Setiap tindakan disimpan dalam riwayat moderasi.</p>
      <p v-if="error" role="alert" class="rounded-md bg-red-50 p-3 text-xs text-red-700">{{ error }}</p>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Tindakan <span class="text-red-500">*</span></label>
        <div :class="modalFormInputColClass"><select v-model="form.action" :class="formControlClass" required><option value="warning">Peringatan</option><option value="ban">Ban Permanen</option><option value="freeze">Bekukan Sementara</option></select></div>
      </div>
      <div v-if="form.action === 'freeze'" :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Durasi Bekukan (hari) <span class="text-red-500">*</span></label>
        <div :class="modalFormInputColClass"><input v-model.number="form.freezeDays" type="number" min="1" required :class="formControlClass" /></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Notifikasi</label>
        <div :class="modalFormInputColClass"><select v-model="form.notification" :class="formControlClass"><option value="no">Jangan kirim notifikasi</option><option value="whatsapp">Kirim notifikasi ke WhatsApp</option><option value="email">Kirim notifikasi via Email</option></select></div>
      </div>
      <div class="grid grid-cols-12 items-start gap-3 sm:gap-4">
        <label :class="modalFormLabelClass">Pesan <span class="text-red-500">*</span></label>
        <div :class="modalFormInputColClass"><textarea v-model="form.message" rows="4" required :class="[formControlClass, '!h-auto py-2']" placeholder="Tulis pesan/peringatan..." /></div>
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button type="button" class="h-9 rounded-md border border-gray-300 px-4 text-xs font-semibold" :disabled="busy" @click="$emit('close')">Cancel</button>
        <button type="submit" class="h-9 rounded-md bg-amber-500 px-4 text-xs font-semibold text-white disabled:opacity-50" :disabled="busy || !form.message.trim()">{{ busy ? 'Saving...' : 'Submit Tindakan' }}</button>
      </div>
    </form>
  </SalesDialog>
</template>
