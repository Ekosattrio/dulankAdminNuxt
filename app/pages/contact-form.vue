<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Contact Form" subtitle="Manage customer contact inquiries">
      <template #actions>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
          title="Refresh"
          @click="refresh"
        >
          <CommonFeatherIcon name="rotate-ccw" size="18" />
        </button>
      </template>
    </CommonPageHeader>

    <!-- KPI Widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <CommonStatCard label="Total Inquiries" :value="String(messages.length)" icon="mail" tone="primary" />
      <CommonStatCard label="Pending Replies" :value="String(pendingCount)" icon="clock" tone="warning" />
      <CommonStatCard label="Answered" :value="String(answeredCount)" icon="check" tone="success" />
    </div>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <CommonSearchFilter v-model="searchQuery" placeholder="Search name, email, or message..." />
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="Status: All"
            :options="[
              { value: 'Pending', label: 'Pending' },
              { value: 'Answered', label: 'Answered' },
            ]"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Email</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Phone</th>
              <th class="min-w-[250px] px-4 py-3 text-start whitespace-nowrap">Message</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="m in filteredMessages" :key="m.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ m.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <a :href="`mailto:${m.email}`" class="text-primary hover:underline">{{ m.email }}</a>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <a :href="`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`" target="_blank" class="inline-flex items-center gap-1 text-emerald-600 hover:underline dark:text-emerald-400">
                  <CommonFeatherIcon name="message-circle" size="13" />
                  {{ m.phone }}
                </a>
              </td>
              <td class="max-w-[250px] truncate px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ m.message }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ m.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="m.status" :tone="m.status === 'Answered' ? 'emerald' : 'amber'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="m" show-view @view="openReplyModal(m)" @delete="deleteMessage(m.id)" />
              </td>
            </tr>
            <tr v-if="filteredMessages.length === 0">
              <td colspan="7" class="p-8 text-center text-gray-400">No contact messages found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reply / Detail Modal -->
    <CommonBaseModal v-model="modalVisible" :title="`Inquiry Details — ${activeMessage?.name ?? ''}`" maxWidth="lg">
      <div v-if="activeMessage" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-0 block text-xs text-gray-400">Sender Name</label>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ activeMessage.name }}</p>
          </div>
          <div>
            <label class="mb-0 block text-xs text-gray-400">Received Date</label>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ activeMessage.date }}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-0 block text-xs text-gray-400">Email</label>
            <p><a :href="`mailto:${activeMessage.email}`" class="text-primary hover:underline">{{ activeMessage.email }}</a></p>
          </div>
          <div>
            <label class="mb-0 block text-xs text-gray-400">Phone</label>
            <p class="font-semibold text-gray-800 dark:text-gray-200">{{ activeMessage.phone }}</p>
          </div>
        </div>
        <div>
          <label class="mb-0 block text-xs text-gray-400">Original Message</label>
          <div class="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200">
            {{ activeMessage.message }}
          </div>
        </div>
        <CommonFormField label="Quick Reply via Email">
          <textarea
            v-model="replyText"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Write response to customer..."
          ></textarea>
        </CommonFormField>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="modalVisible = false"
          >
            Close
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary-600"
            @click="sendReply"
          >
            <CommonFeatherIcon name="send" size="14" />
            Send Response
          </button>
        </div>
      </template>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: contactFormData } = await useFetch<ContactMessage[]>('/api/contact-form')
const messages = ref<ContactMessage[]>(contactFormData.value ?? [])
useMockSync('contact-form', messages)

const searchQuery = ref('')
const filterStatus = ref('')
const statusDropdownOpen = ref(false)

const pendingCount = computed(() => messages.value.filter(m => m.status === 'Pending').length)
const answeredCount = computed(() => messages.value.filter(m => m.status === 'Answered').length)

const filteredMessages = computed(() => {
  return messages.value.filter(m => {
    const matchStatus = !filterStatus.value || m.status === filterStatus.value
    const matchQuery = !searchQuery.value ||
      m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.phone.includes(searchQuery.value) ||
      m.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchQuery
  })
})

const modalVisible = ref(false)
const activeMessage = ref<ContactMessage | null>(null)
const replyText = ref('')

function openReplyModal(m: ContactMessage) {
  activeMessage.value = m
  replyText.value = `Dear ${m.name},\n\nThank you for contacting Dulank Printing. Regarding your inquiry:\n`
  modalVisible.value = true
}

function sendReply() {
  if (!replyText.value.trim()) {
    alert('Please enter a reply message.')
    return
  }
  if (activeMessage.value) {
    activeMessage.value.status = 'Answered'
  }
  alert('Reply sent successfully to ' + activeMessage.value?.email)
  modalVisible.value = false
}

function deleteMessage(id: number) {
  if (confirm('Are you sure you want to delete this contact message?')) {
    messages.value = messages.value.filter(m => m.id !== id)
  }
}

function exportPdf() {
  alert('Exporting messages as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterStatus.value = ''
}
</script>
=======
<script setup lang="ts">
import type { ContactFormItem, ContactFormFilterQuery } from '#server/types/contact-form'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useContactForms } from '~/composables/useContactForms'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import ContactFormStatsWidgets from '~/components/pages/contact-form/ContactFormStatsWidgets.vue'
import ContactFormRecordsTable from '~/components/pages/contact-form/ContactFormRecordsTable.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

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

    <!-- Error & Skeleton Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="5"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Gagal memuat pesan formulir kontak. Silakan coba lagi.') : ''"
      @retry="refresh"
    />

    <!-- Contact Form Records Table (Name, Email, Phone, Message, Date - NO Action column) -->
    <ContactFormRecordsTable
      v-if="!pending && !error"
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
>>>>>>> origin/eko
