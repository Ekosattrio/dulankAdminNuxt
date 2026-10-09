<script setup lang="ts">
import type { CalendarConfig } from '#server/types/calendar-setting'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import CalendarWorkspace from '~/components/pages/products-services/CalendarWorkspace.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

definePageMeta({
  layout: 'default',
  alias: ['/calender.html'],
})
useLegacyPage({ title: 'Calender', sweetAlert: false })

const { config, pending, error, refresh, saveCalendarConfig } = useCalendarSettings()
const draft = ref<CalendarConfig | null>(null)
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
    const response = await saveCalendarConfig(draft.value)
    message.value = response.message || 'Calender settings saved successfully'
  } catch (cause: any) {
    saveError.value = cause?.data?.statusMessage || cause?.message || 'Calender settings gagal disimpan'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-calender space-y-6">
    <!-- Page Header -->
    <SalesListHeader
      title="Calender"
      subtitle="Manage your Calender"
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
      :error="saveError || (error ? 'Unable to load calender configuration.' : '')"
      :message="message"
      @retry="refresh()"
      @dismiss="message = ''"
    />

    <!-- Main Workspace -->
    <CalendarWorkspace
      v-if="draft && !pending && !error"
      v-model:draft="draft"
      :busy="busy"
      @save="handleSave"
    />
  </div>
</template>
