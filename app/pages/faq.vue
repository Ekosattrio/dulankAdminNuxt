<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="FAQ" subtitle="Manage your frequently asked questions">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refresh"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add FAQ</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search questions or answers..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterCategory"
            allLabel="All Categories"
            :options="[
              { value: 'General', label: 'General' },
              { value: 'Features', label: 'Features' },
              { value: 'Hardware', label: 'Hardware' },
              { value: 'Printing', label: 'Printing' },
            ]"
          />
          <select
            v-model="sortBy"
            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="recent">Sort By: Recently Added</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="w-10 px-4 py-3 text-center whitespace-nowrap">
                <input type="checkbox" class="h-3.5 w-3.5 accent-primary" :checked="selectAll" @change="toggleSelectAll" />
              </th>
              <th class="min-w-[250px] px-4 py-3 text-start whitespace-nowrap">Question</th>
              <th class="min-w-[320px] px-4 py-3 text-start whitespace-nowrap">Answer</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Category</th>
              <th class="w-24 px-4 py-3 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="faq in filteredFaqs" :key="faq.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 text-center whitespace-nowrap">
                <input type="checkbox" :value="faq.id" v-model="selectedIds" class="h-3.5 w-3.5 accent-primary" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ faq.question }}</td>
              <td class="max-w-[320px] truncate px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ faq.answer }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {{ faq.category }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="faq" @edit="openEditModal(faq)" @delete="deleteFaq(faq.id)" />
              </td>
            </tr>
            <tr v-if="filteredFaqs.length === 0">
              <td colspan="5" class="p-8 text-center text-gray-400">No FAQs found matching your criteria.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit FAQ Modal -->
    <CommonBaseModal v-model="modalVisible" :title="isEdit ? 'Edit FAQ' : 'Add FAQ'" maxWidth="lg">
      <form @submit.prevent="saveFaq" class="space-y-4">
        <CommonFormField label="Category" required>
          <select
            v-model="form.category"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          >
            <option value="General">General</option>
            <option value="Features">Features</option>
            <option value="Hardware">Hardware</option>
            <option value="Printing">Printing</option>
            <option value="Payment">Payment</option>
          </select>
        </CommonFormField>
        <CommonFormField label="Question" required>
          <input
            v-model="form.question"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Enter question"
            required
          />
        </CommonFormField>
        <CommonFormField label="Answer" required>
          <textarea
            v-model="form.answer"
            rows="4"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Enter detailed answer"
            required
          ></textarea>
        </CommonFormField>
        <CommonModalFooter :submit-label="isEdit ? 'Update' : 'Submit'" @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: faqData } = await useFetch<FAQItem[]>('/api/faq')
const faqs = ref<FAQItem[]>(faqData.value ?? [])
useMockSync('faq', faqs)

const searchQuery = ref('')
const filterCategory = ref('')
const sortBy = ref<'recent' | 'asc' | 'desc'>('recent')
const catDropdownOpen = ref(false)
const sortDropdownOpen = ref(false)
const selectedIds = ref<number[]>([])

const sortByLabel = computed(() => {
  if (sortBy.value === 'asc') return 'Ascending'
  if (sortBy.value === 'desc') return 'Descending'
  return 'Recently Added'
})

const filteredFaqs = computed(() => {
  return faqs.value
    .filter(f => {
      const matchCat = !filterCategory.value || f.category === filterCategory.value
      const matchQuery = !searchQuery.value ||
        f.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
      return matchCat && matchQuery
    })
    .sort((a, b) => {
      if (sortBy.value === 'asc') return a.question.localeCompare(b.question)
      if (sortBy.value === 'desc') return b.question.localeCompare(a.question)
      return b.id - a.id
    })
})

const selectAll = computed(() => {
  return filteredFaqs.value.length > 0 && selectedIds.value.length === filteredFaqs.value.length
})

function toggleSelectAll(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.checked) {
    selectedIds.value = filteredFaqs.value.map(f => f.id)
  } else {
    selectedIds.value = []
  }
}

// Modal state
const modalVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)
const form = ref({
  question: '',
  answer: '',
  category: 'General'
})

function openAddModal() {
  isEdit.value = false
  currentId.value = null
  form.value = {
    question: '',
    answer: '',
    category: 'General'
  }
  modalVisible.value = true
}

function openEditModal(f: FAQItem) {
  isEdit.value = true
  currentId.value = f.id
  form.value = {
    question: f.question,
    answer: f.answer,
    category: f.category
  }
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function saveFaq() {
  if (isEdit.value && currentId.value !== null) {
    const idx = faqs.value.findIndex(f => f.id === currentId.value)
    if (idx !== -1) {
      faqs.value[idx] = {
        ...faqs.value[idx],
        ...form.value
      }
    }
  } else {
    const newId = faqs.value.length ? Math.max(...faqs.value.map(f => f.id)) + 1 : 1
    faqs.value.unshift({
      id: newId,
      ...form.value
    })
  }
  closeModal()
}

function deleteFaq(id: number) {
  if (confirm('Are you sure you want to delete this FAQ?')) {
    faqs.value = faqs.value.filter(f => f.id !== id)
    selectedIds.value = selectedIds.value.filter(item => item !== id)
  }
}

function exportPdf() {
  alert('Exporting FAQ list as PDF...')
}

function refresh() {
  searchQuery.value = ''
  filterCategory.value = ''
  sortBy.value = 'recent'
  selectedIds.value = []
}
</script>
=======
<script setup lang="ts">
import FaqWorkspace from '~/components/pages/faq/FaqWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'FAQ - Frequently Asked Questions',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-faq p-4 md:p-6">
    <FaqWorkspace />
  </div>
</template>
>>>>>>> origin/eko
