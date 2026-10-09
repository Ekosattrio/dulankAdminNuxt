<script setup lang="ts">
import type { BanIpItem, BanIpInput } from '#server/types/ban-ip'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { modalFormRowClass, modalFormLabelClass, modalFormInputColClass, formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  item: BanIpItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: BanIpInput]
}>()

const form = ref<BanIpInput>({
  ip: '',
  reason: '',
  status: true
})

watch(() => props.item, (val) => {
  if (val) {
    form.value = {
      ip: val.ip,
      reason: val.reason,
      status: val.status
    }
  } else {
    form.value = {
      ip: '',
      reason: '',
      status: true
    }
  }
}, { immediate: true })

function handleSubmit() {
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="item ? 'Edit Pemblokiran IP' : 'Blokir Alamat IP Baru'"
    max-width="md"
    @close="emit('close')"
  >
    <form class="space-y-4 py-2" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Alamat IP</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.ip"
            type="text"
            required
            placeholder="Contoh: 192.168.1.100"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Alasan Blokir</label>
        <div :class="modalFormInputColClass">
          <textarea
            v-model="form.reason"
            rows="3"
            required
            placeholder="Jelaskan indikasi aktivitas mencurigakan..."
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status Blokir</label>
        <div :class="modalFormInputColClass" class="flex items-center gap-2">
          <input
            v-model="form.status"
            type="checkbox"
            id="ban-status"
            class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label for="ban-status" class="text-xs text-gray-700 dark:text-gray-300">Blokir akses saat ini (Aktif)</label>
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
          {{ busy ? 'Menyimpan...' : 'Simpan Pemblokiran' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

