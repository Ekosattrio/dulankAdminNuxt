<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Blog Categories</h4>
            <h6>Manage your blog categories</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Pdf" href="javascript:void(0);" @click="exportPdf"><img src="/assets/img/icons/pdf.svg" alt="img" /></a>
          </li>
          <li>
            <a title="Print" href="javascript:void(0);" @click="printTable"><i class="ti ti-printer"></i></a>
          </li>
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
        </ul>
        <div class="page-btn">
          <button type="button" class="btn btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-1"></i>Add Categories
          </button>
        </div>
      </div>

      <div class="card table-list-card">
        <div class="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div class="search-set">
            <div class="search-input">
              <span class="btn-searchset"><i class="ti ti-search"></i></span>
              <input v-model="searchQuery" type="text" class="form-control" placeholder="Search category..." />
            </div>
          </div>
          <div class="d-flex align-items-center gap-3">
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
                  <th>Category</th>
                  <th>Created Date</th>
                  <th>Status</th>
                  <th class="text-center" style="width: 100px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cat in filteredCategories" :key="cat.id">
                  <td>
                    <div class="form-check form-check-md">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="cat.id"
                        v-model="selectedIds"
                      />
                    </div>
                  </td>
                  <td class="text-dark fw-medium">{{ cat.name }}</td>
                  <td>{{ cat.createdDate }}</td>
                  <td>
                    <span
                      class="badge rounded"
                      :class="cat.status === 'Active' ? 'badge-success' : 'badge-secondary'"
                    >
                      • {{ cat.status }}
                    </span>
                  </td>
                  <td class="action-table-data">
                    <div class="edit-delete-action justify-content-center gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-primary p-1"
                        title="Edit"
                        @click="openEditModal(cat)"
                      >
                        <i class="ti ti-edit fs-16"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon text-danger p-1"
                        title="Delete"
                        @click="deleteCategory(cat.id)"
                      >
                        <i class="ti ti-trash fs-16"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCategories.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">
                    No categories found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div
      v-if="modalVisible"
      class="modal fade show d-block"
      style="background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{ isEdit ? 'Edit Blog Category' : 'Add Blog Category' }}</h4>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveCategory">
            <div class="modal-body pb-0">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label">Category Name <span class="text-danger">*</span></label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div class="col-md-12">
                  <div class="d-flex align-items-center justify-content-between my-2">
                    <label class="form-label mb-0">Status</label>
                    <div class="form-check form-switch">
                      <input
                        v-model="statusActive"
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="catStatusSwitch"
                      />
                    </div>
                  </div>
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

interface BlogCategory {
  id: number
  name: string
  createdDate: string
  status: 'Active' | 'Inactive'
}

const categories = ref<BlogCategory[]>([
  { id: 1, name: 'PointOfSale', createdDate: '12 Sep 2024', status: 'Active' },
  { id: 2, name: 'Features', createdDate: '15 Sep 2024', status: 'Active' },
  { id: 3, name: 'Innovations', createdDate: '20 Sep 2024', status: 'Active' },
  { id: 4, name: 'Printing Technology', createdDate: '01 Oct 2024', status: 'Active' },
  { id: 5, name: 'Packaging Guide', createdDate: '10 Oct 2024', status: 'Inactive' }
])

const searchQuery = ref('')
const sortBy = ref<'recent' | 'asc' | 'desc'>('recent')
const sortDropdownOpen = ref(false)
const selectedIds = ref<number[]>([])

const sortByLabel = computed(() => {
  if (sortBy.value === 'asc') return 'Ascending'
  if (sortBy.value === 'desc') return 'Descending'
  return 'Recently Added'
})

const filteredCategories = computed(() => {
  return categories.value
    .filter(c => !searchQuery.value || c.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .sort((a, b) => {
      if (sortBy.value === 'asc') return a.name.localeCompare(b.name)
      if (sortBy.value === 'desc') return b.name.localeCompare(a.name)
      return b.id - a.id
    })
})

const selectAll = computed(() => {
  return filteredCategories.value.length > 0 && selectedIds.value.length === filteredCategories.value.length
})

function toggleSelectAll(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.checked) {
    selectedIds.value = filteredCategories.value.map(c => c.id)
  } else {
    selectedIds.value = []
  }
}

// Modal state
const modalVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)
const form = ref({
  name: '',
  status: 'Active' as 'Active' | 'Inactive'
})

const statusActive = computed({
  get: () => form.value.status === 'Active',
  set: (val: boolean) => {
    form.value.status = val ? 'Active' : 'Inactive'
  }
})

function openAddModal() {
  isEdit.value = false
  currentId.value = null
  form.value = {
    name: '',
    status: 'Active'
  }
  modalVisible.value = true
}

function openEditModal(cat: BlogCategory) {
  isEdit.value = true
  currentId.value = cat.id
  form.value = {
    name: cat.name,
    status: cat.status
  }
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
}

function saveCategory() {
  if (isEdit.value && currentId.value !== null) {
    const idx = categories.value.findIndex(c => c.id === currentId.value)
    if (idx !== -1) {
      categories.value[idx].name = form.value.name
      categories.value[idx].status = form.value.status
    }
  } else {
    const newId = categories.value.length ? Math.max(...categories.value.map(c => c.id)) + 1 : 1
    categories.value.unshift({
      id: newId,
      name: form.value.name,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: form.value.status
    })
  }
  closeModal()
}

function deleteCategory(id: number) {
  if (confirm('Are you sure you want to delete this category?')) {
    categories.value = categories.value.filter(c => c.id !== id)
    selectedIds.value = selectedIds.value.filter(item => item !== id)
  }
}

function exportPdf() {
  alert('Exporting categories as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  sortBy.value = 'recent'
  selectedIds.value = []
}
</script>

