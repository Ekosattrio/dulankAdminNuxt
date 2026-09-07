<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Flow Category</h4>
            <h6>Manage master stages and manufacturing categories</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add Flow Category
          </button>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search category..." />
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>No</th>
                  <th>Flow Process Category</th>
                  <th class="text-center">Used Count</th>
                  <th>Created By</th>
                  <th>Created Date</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cat in filteredList" :key="cat.id">
                  <td class="fw-bold text-primary">{{ cat.code }}</td>
                  <td class="fw-bold text-dark">{{ cat.name }}</td>
                  <td class="text-center">
                    <span class="badge bg-light text-dark border">{{ cat.usedCount }}</span>
                  </td>
                  <td>{{ cat.createdBy }}</td>
                  <td class="small text-muted">{{ cat.createdDate }}</td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-icon text-primary" title="Edit" @click="openEditModal(cat)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-danger" title="Delete" @click="deleteCategory(cat.id)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredList.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">
                    No flow categories found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="modalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">{{ isEditing ? 'Edit Flow Category' : 'Add Flow Category' }}</h5>
            <button type="button" class="btn-close" @click="modalVisible = false"></button>
          </div>
          <form @submit.prevent="saveCategory">
            <div class="modal-body pt-0">
              <div class="mb-3">
                <label class="form-label">Category Name <span class="text-danger">*</span></label>
                <input v-model="formData.name" type="text" class="form-control" placeholder="e.g. Design, Pracetak, Cetak, Finishing" required />
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="modalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update Category' : 'Save Category' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Flow Category - Kacetak System'
})

interface FlowCategory {
  id: number
  code: string
  name: string
  usedCount: number
  createdBy: string
  createdDate: string
}

const categories = ref<FlowCategory[]>([
  { id: 1, code: 'PCC-001', name: 'Design', usedCount: 10, createdBy: 'Admin', createdDate: '2025-10-13 10:35:00' },
  { id: 2, code: 'PCC-002', name: 'Pracetak', usedCount: 15, createdBy: 'Admin', createdDate: '2025-10-13 10:35:00' },
  { id: 3, code: 'PCC-003', name: 'Cetak', usedCount: 22, createdBy: 'Admin', createdDate: '2025-10-13 10:35:00' },
  { id: 4, code: 'PCC-004', name: 'Finishing', usedCount: 32, createdBy: 'Admin', createdDate: '2025-10-13 10:35:00' }
])

const searchQuery = ref('')

const filteredList = computed(() => {
  return categories.value.filter(c => {
    return (
      c.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

const modalVisible = ref(false)
const isEditing = ref(false)
const formData = reactive({
  id: 0,
  name: ''
})

function openAddModal() {
  isEditing.value = false
  formData.id = 0
  formData.name = ''
  modalVisible.value = true
}

function openEditModal(cat: FlowCategory) {
  isEditing.value = true
  formData.id = cat.id
  formData.name = cat.name
  modalVisible.value = true
}

function saveCategory() {
  if (isEditing.value) {
    const idx = categories.value.findIndex(c => c.id === formData.id)
    if (idx !== -1) {
      categories.value[idx].name = formData.name
    }
  } else {
    categories.value.push({
      id: Date.now(),
      code: 'PCC-00' + (categories.value.length + 1),
      name: formData.name,
      usedCount: 0,
      createdBy: 'Admin',
      createdDate: new Date().toISOString().replace('T', ' ').substring(0, 19)
    })
  }
  modalVisible.value = false
}

function deleteCategory(id: number) {
  if (confirm('Delete this flow category?')) {
    categories.value = categories.value.filter(c => c.id !== id)
  }
}

function exportPdf() {
  alert('Exporting PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
}
</script>
