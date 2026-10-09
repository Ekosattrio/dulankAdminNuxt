<script setup lang="ts">
import type { SocialProviderConfig, SocialProviderKey } from '#server/types/social-auth'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { modalFormRowClass, modalFormLabelClass, modalFormInputColClass, formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  activeKey: SocialProviderKey | null
  config: SocialProviderConfig | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: SocialProviderConfig]
}>()

const modalTitle = computed(() => {
  switch (props.activeKey) {
    case 'facebook': return 'Pengaturan Login Facebook'
    case 'twitter': return 'Pengaturan Login Twitter'
    case 'google': return 'Pengaturan Login Google'
    case 'linkedin': return 'Pengaturan Login LinkedIn'
    default: return 'Pengaturan Otentikasi Sosial'
  }
})

const form = ref<SocialProviderConfig>({
  enabled: true,
  clientId: '',
  clientSecret: '',
  redirectUrl: ''
})

watch(() => props.config, (val) => {
  if (val) {
    form.value = { ...val }
  }
}, { immediate: true })

function handleSubmit() {
  emit('submit', { ...form.value, enabled: true })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="modalTitle"
    max-width="md"
    @close="emit('close')"
  >
    <form class="space-y-4 py-2" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">App / Client ID</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.clientId"
            type="text"
            required
            placeholder="Masukkan App ID dari developer console"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">App / Client Secret</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.clientSecret"
            type="password"
            required
            placeholder="••••••••••••••••••••••••"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Valid OAuth Redirect URL</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.redirectUrl"
            type="url"
            required
            placeholder="https://domain.com/auth/callback"
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
          {{ busy ? 'Menyimpan...' : 'Simpan Kredensial' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

