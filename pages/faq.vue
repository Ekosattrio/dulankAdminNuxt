<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>FAQ</h4>
            <h6>Manage your frequently asked questions</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Pdf" href="javascript:void(0);" @click="exportPdf"><img src="/assets/img/icons/pdf.svg" alt="img"></a>
          </li>
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
        </ul>
        <div class="page-btn">
          <button type="button" class="btn btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-1"></i>Add FAQ
          </button>
        </div>
      </div>

      <div class="card table-list-card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div class="search-set">
            <div class="search-input">
              <span class="btn-searchset"><i class="ti ti-search"></i></span>
              <input v-model="searchQuery" type="text" class="form-control" placeholder="Search questions or answers..." />
            </div>
          </div>
          <div class="d-flex align-items-center gap-3">
            <div class="dropdown">
              <button
                class="btn btn-white dropdown-toggle d-inline-flex align-items-center"
                type="button"
                @click="catDropdownOpen = !catDropdownOpen"
              >
                Category: {{ filterCategory || 'All' }}
                <i class="ti ti-chevron-down ms-1"></i>
              </button>
              <ul v-if="catDropdownOpen" class="dropdown-menu dropdown-menu-end p-2 show" style="display: block; position: absolute;">
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterCategory = ''; catDropdownOpen = false">All Categories</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterCategory = 'General'; catDropdownOpen = false">General</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterCategory = 'Features'; catDropdownOpen = false">Features</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterCategory = 'Hardware'; catDropdownOpen = false">Hardware</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="filterCategory = 'Printing'; catDropdownOpen = false">Printing</a></li>
              </ul>
            </div>
            <div class="dropdown">
              <button
                class="btn btn-white dropdown-toggle d-inline-flex align-items-center"
                type="button"
                @click="sortDropdownOpen = !sortDropdownOpen"
              >
                Sort By: {{ sortByLabel }}
                <i class="ti ti-chevron-down ms-1"></i>
              </button>
              <ul v-if="sortDropdownOpen" class="dropdown-menu dropdown-menu-end p-2 show" style="display: block; position: absolute;">
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="sortBy = 'recent'; sortDropdownOpen = false">Recently Added</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="sortBy = 'asc'; sortDropdownOpen = false">Ascending</a></li>
                <li><a href="javascript:void(0);" class="dropdown-item rounded-1" @click="sortBy = 'desc'; sortDropdownOpen = false">Descending</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th class="no-sort" style="width: 40px;">
                    <div class="form-check form-check-md">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :checked="selectAll"
                        @change="toggleSelectAll"
                      />
                    </div>
                  </th>
                  <th style="min-width: 250px;">Question</th>
                  <th style="min-width: 320px;">Answer</th>
                  <th>Category</th>
                  <th class="text-center" style="width: 100px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="faq in filteredFaqs" :key="faq.id">
                  <td>
                    <div class="form-check form-check-md">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="faq.id"
                        v-model="selectedIds"
                      />
                    </div>
                  </td>
                  <td class="text-dark fw-semibold">{{ faq.question }}</td>
                  <td class="text-muted small text-wrap">{{ faq.answer }}</td>
                  <td>
                    <span class="badge bg-light text-dark border px-2 py-1 fs-12">{{ faq.category }}</span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="Edit"
                        @click="openEditModal(faq)"
                      >
                        <i class="ti ti-edit fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete"
                        @click="deleteFaq(faq.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredFaqs.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">
                    No FAQs found matching your criteria.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit FAQ Modal -->
    <div
      v-if="modalVisible"
      class="modal fade show d-block"
      style="background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{ isEdit ? 'Edit FAQ' : 'Add FAQ' }}</h4>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveFaq">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Category <span class="text-danger">*</span></label>
                  <select v-model="form.category" class="form-select" required>
                    <option value="General">General</option>
                    <option value="Features">Features</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Printing">Printing</option>
                    <option value="Payment">Payment</option>
                  </select>
                </div>
                <div class="col-md-12">
                  <label class="form-label">Question <span class="text-danger">*</span></label>
                  <input
                    v-model="form.question"
                    type="text"
                    class="form-control"
                    placeholder="Enter question"
                    required
                  />
                </div>
                <div class="col-md-12">
                  <label class="form-label">Answer <span class="text-danger">*</span></label>
                  <textarea
                    v-model="form.answer"
                    rows="4"
                    class="form-control"
                    placeholder="Enter detailed answer"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer modal-action-footer justify-content-end gap-2">
              <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning modal-action-submit">
                {{ isEdit ? 'Update' : 'Submit' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
}

const faqs = ref<FAQItem[]>([
  {
    id: 1,
    question: 'Does it support multiple payment methods?',
    answer: 'Yes, including cash, bank transfer, QRIS, e-wallets, credit cards, and customer deposit accounts.',
    category: 'Features'
  },
  {
    id: 2,
    question: 'What is a POS platform?',
    answer: 'A software system that processes sales, calculates paper layout efficiency, manages job tickets, and syncs inventory.',
    category: 'General'
  },
  {
    id: 3,
    question: 'Who uses it?',
    answer: 'Commercial printers, packaging manufacturers, copy centers, digital printing houses, and screen printers.',
    category: 'General'
  },
  {
    id: 4,
    question: 'What are the key features?',
    answer: 'Automated print sheet estimation, paper wastage calculations, multi-station job order workflow, and thermal receipt printing.',
    category: 'Features'
  },
  {
    id: 5,
    question: 'Can I connect thermal receipt and barcode printers?',
    answer: 'Yes, the system is plug-and-play compatible with standard ESC/POS 80mm and 58mm thermal printers.',
    category: 'Hardware'
  },
  {
    id: 6,
    question: 'How do paper plan formulas calculate cuts per plano?',
    answer: 'The calculator tests both grain directions (parallel and perpendicular) to maximize yield and minimize scrap waste.',
    category: 'Printing'
  }
])

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
