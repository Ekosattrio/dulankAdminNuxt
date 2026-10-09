<script setup lang="ts">
import type { IntegrationKey, SystemIntegrations } from '#server/types/system-integrations'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { modalFormRowClass, modalFormLabelClass, modalFormInputColClass, formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  activeKey: IntegrationKey | null
  integrations: SystemIntegrations
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: Partial<SystemIntegrations>]
}>()

const modalTitle = computed(() => {
  switch (props.activeKey) {
    case 'captcha': return 'Konfigurasi Google reCAPTCHA'
    case 'analytics': return 'Konfigurasi Google Analytics'
    case 'adsense': return 'Konfigurasi Google AdSense'
    case 'map': return 'Konfigurasi Google Maps API'
    default: return 'Konfigurasi Integrasi'
  }
})

const captchaForm = ref({ siteKey: '', secretKey: '' })
const analyticsForm = ref({ trackingId: '' })
const adsenseForm = ref({ code: '' })
const mapForm = ref({ mapId: '' })

watch(() => props.activeKey, () => {
  if (props.integrations) {
    captchaForm.value = { ...props.integrations.captcha }
    analyticsForm.value = { ...props.integrations.analytics }
    adsenseForm.value = { ...props.integrations.adsense }
    mapForm.value = { ...props.integrations.map }
  }
}, { immediate: true })

function handleSubmit() {
  if (props.activeKey === 'captcha') {
    emit('submit', { captcha: { ...props.integrations.captcha, ...captchaForm.value } })
  } else if (props.activeKey === 'analytics') {
    emit('submit', { analytics: { ...props.integrations.analytics, ...analyticsForm.value } })
  } else if (props.activeKey === 'adsense') {
    emit('submit', { adsense: { ...props.integrations.adsense, ...adsenseForm.value } })
  } else if (props.activeKey === 'map') {
    emit('submit', { map: { ...props.integrations.map, ...mapForm.value } })
  }
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
      <!-- Captcha -->
      <template v-if="activeKey === 'captcha'">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">reCAPTCHA Site Key</label>
          <div :class="modalFormInputColClass">
            <input v-model="captchaForm.siteKey" type="text" required :class="formControlClass" />
          </div>
        </div>
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">reCAPTCHA Secret Key</label>
          <div :class="modalFormInputColClass">
            <input v-model="captchaForm.secretKey" type="password" required :class="formControlClass" />
          </div>
        </div>
      </template>

      <!-- Analytics -->
      <template v-else-if="activeKey === 'analytics'">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Measurement ID</label>
          <div :class="modalFormInputColClass">
            <input v-model="analyticsForm.trackingId" type="text" required placeholder="G-XXXXXXXXXX" :class="formControlClass" />
          </div>
        </div>
      </template>

      <!-- Adsense -->
      <template v-else-if="activeKey === 'adsense'">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Publisher ID / Code</label>
          <div :class="modalFormInputColClass">
            <input v-model="adsenseForm.code" type="text" required placeholder="ca-pub-XXXXXXXXXX" :class="formControlClass" />
          </div>
        </div>
      </template>

      <!-- Map -->
      <template v-else-if="activeKey === 'map'">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Maps API Key / Map ID</label>
          <div :class="modalFormInputColClass">
            <input v-model="mapForm.mapId" type="text" required :class="formControlClass" />
          </div>
        </div>
      </template>

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
          {{ busy ? 'Menyimpan...' : 'Simpan Konfigurasi' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

