<script setup lang="ts">
import type { ContactFormItem, ContactFormFilterQuery } from '#server/types/contact-form'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useContactForms } from '~/composables/useContactForms'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import ContactFormStatsWidgets from '~/components/pages/contact-form/ContactFormStatsWidgets.vue'
import ContactFormRecordsTable from '~/components/pages/contact-form/ContactFormRecordsTable.vue'

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Contact Form List - Dulank Admin',
  sweetAlert: false
})

const searchQuery = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const filterParams = computed<ContactFormFilterQuery>(() => ({
  search: searchQuery.value || undefined,
  startDate: filterDateRange.value?.start || undefined,
  endDate: filterDateRange.value?.end || undefined
}))

const { contacts, stats, pending, error, refresh } = useContactForms(filterParams)
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const contactPrintColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'message', label: 'Message' },
  { key: 'date', label: 'Date' }
]
</script>

<template>
  <div class="dulank-page dulank-page-contact-form max-w-7xl mx-auto px-4 py-6">
    <!-- Header with literal title and subtitle from Netlify / legacy HTML -->
    <SalesListHeader
      title="Contact Form List"
      subtitle="Manage Contact Form"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- KPI Widgets -->
    <ContactFormStatsWidgets :stats="stats" />

    <!-- Error State -->
    <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
      Gagal memuat pesan formulir kontak: {{ error.message }}
      <button class="ml-2 underline font-semibold" @click="refresh">Coba lagi</button>
    </div>

    <!-- Contact Form Records Table (Name, Email, Phone, Message, Date - NO Action column) -->
    <ContactFormRecordsTable
      :contacts="contacts"
      v-model:search-query="searchQuery"
      v-model:filter-date-range="filterDateRange"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Formulir Kontak (Contact Form List)"
      :columns="contactPrintColumns"
      :items="contacts"
      date-field="date"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
