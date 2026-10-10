<script setup lang="ts">
import type { LanguageFormData, LanguageItem } from '#server/types/system-settings'
import { useLanguages } from '~/composables/useLanguages'
import { useTablePrint } from '~/composables/useTablePrint'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import LanguageFormModal from '~/components/Pages/Language/LanguageFormModal.vue'
import LanguageRecordsTable from '~/components/Pages/Language/LanguageRecordsTable.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'

const {
  languages,
  pending,
  error,
  refresh,
  saveLanguage,
  toggleLanguageStatus,
  toggleRtl,
  getTranslations,
  importTranslations,
} = useLanguages()

const searchQuery = ref('')
const filterStatus = ref('')
const isFormOpen = ref(false)
const isEdit = ref(false)
const activeLanguage = ref<LanguageItem | null>(null)
const importTarget = ref<LanguageItem | null>(null)
const importInput = ref<HTMLInputElement | null>(null)
const isBusy = ref(false)
const feedbackMessage = ref('')
const actionError = ref('')
const currentPageLanguages = ref<LanguageItem[]>([])

const filteredLanguages = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return languages.value.filter((item) => {
    if (filterStatus.value && item.status !== filterStatus.value) return false
    if (query && !item.name.toLowerCase().includes(query) && !item.code.toLowerCase().includes(query)) return false
    return true
  })
})

const printItems = computed(() => filteredLanguages.value.map((item) => ({
  ...item,
  code: item.code.toUpperCase(),
  rtlLabel: item.rtl ? 'Yes' : 'No',
  progressLabel: `${item.progress || 0}%`,
  statusLabel: item.status === 'active' ? 'Active' : 'Inactive',
})))

const printColumns = [
  { key: 'name', label: 'Language' },
  { key: 'code', label: 'Code' },
  { key: 'rtlLabel', label: 'RTL', align: 'center' as const },
  { key: 'totalKeys', label: 'Total', align: 'right' as const },
  { key: 'doneKeys', label: 'Done', align: 'right' as const },
  { key: 'progressLabel', label: 'Progress', align: 'center' as const },
  { key: 'statusLabel', label: 'Status', align: 'center' as const },
]

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

function clearFeedback() {
  feedbackMessage.value = ''
  actionError.value = ''
}

function openAdd() {
  clearFeedback()
  isEdit.value = false
  activeLanguage.value = null
  isFormOpen.value = true
}

function openEdit(item: LanguageItem) {
  clearFeedback()
  isEdit.value = true
  activeLanguage.value = item
  isFormOpen.value = true
}

function requestImport(item: LanguageItem) {
  clearFeedback()
  importTarget.value = item
  importInput.value?.click()
}

async function handleSave(formData: LanguageFormData) {
  isBusy.value = true
  clearFeedback()
  try {
    const response = await saveLanguage(formData)
    feedbackMessage.value = response.message || 'Language saved successfully.'
    isFormOpen.value = false
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Failed to save language.'
  } finally {
    isBusy.value = false
  }
}

async function handleToggleStatus(item: LanguageItem) {
  isBusy.value = true
  clearFeedback()
  try {
    const response = await toggleLanguageStatus(item)
    feedbackMessage.value = response.message || `${item.name} status updated.`
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Failed to update language status.'
  } finally {
    isBusy.value = false
  }
}

async function handleToggleRtl(item: LanguageItem) {
  isBusy.value = true
  clearFeedback()
  try {
    const response = await toggleRtl(item)
    feedbackMessage.value = response.message || `${item.name} direction updated.`
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Failed to update RTL setting.'
  } finally {
    isBusy.value = false
  }
}

async function handleImportFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  const target = importTarget.value
  input.value = ''
  if (!file || !target) return

  isBusy.value = true
  clearFeedback()
  try {
    const parsed = JSON.parse(await file.text())
    const translations = parsed?.translations && typeof parsed.translations === 'object'
      ? parsed.translations
      : parsed
    if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
      throw new Error('Translation file must contain a JSON object.')
    }
    const response = await importTranslations(target, translations)
    feedbackMessage.value = response.message || `${target.name} translations imported.`
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Failed to import translation file.'
  } finally {
    isBusy.value = false
    importTarget.value = null
  }
}

async function handleExport(item: LanguageItem) {
  isBusy.value = true
  clearFeedback()
  try {
    const response = await getTranslations(item)
    const blob = new Blob([JSON.stringify(response.data.translations, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${item.code}.json`
    link.click()
    URL.revokeObjectURL(url)
    feedbackMessage.value = `${item.name} translations exported.`
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.data?.statusMessage || cause?.message || 'Failed to export translation file.'
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <input ref="importInput" type="file" accept="application/json,.json" class="hidden" @change="handleImportFile" />

    <SalesListHeader
      title="Language"
      subtitle="Manage your website translations"
      add-label="Add Translation"
      :refreshing="pending"
      @add="openAdd"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :error="actionError || (error ? 'Unable to load languages. Please try again.' : '')"
      :message="feedbackMessage"
      @retry="refresh()"
      @dismiss="clearFeedback"
    />

    <LanguageRecordsTable
      v-if="!pending && !error"
      :languages="filteredLanguages"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @update:current-page-items="currentPageLanguages = $event"
      @edit="openEdit"
      @import="requestImport"
      @export="handleExport"
      @toggle-rtl="handleToggleRtl"
      @toggle-status="handleToggleStatus"
    />

    <LanguageFormModal
      :open="isFormOpen"
      :is-edit="isEdit"
      :language="activeLanguage"
      :busy="isBusy"
      @close="isFormOpen = false"
      @submit="handleSave"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Language Report"
      subtitle="Website translation progress and language configuration"
      :columns="printColumns"
      :items="printItems"
      :current-page-items="currentPageLanguages.map((item) => ({
        ...item,
        code: item.code.toUpperCase(),
        rtlLabel: item.rtl ? 'Yes' : 'No',
        progressLabel: `${item.progress || 0}%`,
        statusLabel: item.status === 'active' ? 'Active' : 'Inactive',
      }))"
      date-field="updatedAt"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

