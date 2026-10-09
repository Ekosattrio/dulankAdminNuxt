<script setup lang="ts">
import type { CetakFullColorConfig } from '~/types/cetak-full-color'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import CetakFullColorWorkspace from '~/components/pages/products-services/CetakFullColorWorkspace.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

definePageMeta({
  layout: 'default',
  alias: ['/cetak-full-color.html'],
})
useLegacyPage({ title: 'Cetak Full Color', sweetAlert: false })

const { config, pending, error, refresh, saveConfig } = useCetakFullColor()
const draft = ref<CetakFullColorConfig | null>(null)
const busy = ref(false)
const message = ref('')
const saveError = ref('')

watch(config, (value) => {
  if (value) draft.value = structuredClone(toRaw(value))
}, { immediate: true })

async function handleSave() {
  if (!draft.value) return
  busy.value = true
  saveError.value = ''
  message.value = ''
  try {
    const res = await saveConfig(draft.value)
    if (res?.success) {
      message.value = 'Configuration saved successfully.'
    } else {
      saveError.value = 'Failed to save configuration.'
    }
  } catch (err: any) {
    saveError.value = err?.data?.message || err?.message || 'Error occurred while saving.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-cetak-full-color space-y-6">
    <!-- Header -->
    <SalesListHeader
      title="Cetak Full Color"
      subtitle="Manage your Product"
      :refreshing="pending"
      @refresh="refresh()"
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow hover:bg-primary/90 disabled:opacity-50"
          :disabled="busy || !draft"
          @click="handleSave"
        >
          <FeatherIcon name="save" :size="15" />
          {{ busy ? 'Saving...' : 'Save All Settings' }}
        </button>
      </template>
    </SalesListHeader>

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :error="saveError || (error ? 'Unable to load cetak full color configuration.' : '')"
      :message="message"
      @retry="refresh()"
      @dismiss="message = ''"
    />

    <!-- Main Workspace -->
    <CetakFullColorWorkspace
      v-if="draft && !pending && !error"
      v-model:draft="draft"
      :busy="busy"
      @save="handleSave"
    />
  </div>
</template>
