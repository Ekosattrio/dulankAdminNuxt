<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Flow Template</h4>
            <h6>Manage master SPK parameter templates and production checklists</h6>
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
            <i class="ti ti-circle-plus me-1"></i>Add Flow Template
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
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search template name or parameter..." />
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>No</th>
                  <th>Flow Template Name</th>
                  <th>Required Information / Checklist Parameters</th>
                  <th class="text-center" style="width: 100px;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in filteredList" :key="t.id">
                  <td class="fw-bold text-primary">{{ t.code }}</td>
                  <td class="fw-bold text-dark text-nowrap">{{ t.name }}</td>
                  <td class="small text-muted" style="line-height: 1.5;">
                    <span v-for="(info, i) in t.information.split(', ')" :key="i" class="badge bg-light text-dark border me-1 mb-1">
                      {{ info }}
                    </span>
                  </td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-icon text-primary" title="Edit" @click="openEditModal(t)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-danger" title="Delete" @click="deleteTemplate(t.id)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredList.length === 0">
                  <td colspan="4" class="text-center py-4 text-muted">
                    No flow templates found.
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
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">{{ isEditing ? 'Edit Flow Template' : 'Add Flow Template' }}</h5>
            <button type="button" class="btn-close" @click="modalVisible = false"></button>
          </div>
          <form @submit.prevent="saveTemplate">
            <div class="modal-body pt-0">
              <div class="mb-3">
                <label class="form-label">Flow Template Name <span class="text-danger">*</span></label>
                <input v-model="formData.name" type="text" class="form-control" placeholder="e.g. SPK Heidelberg SM52 4 Warna" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Required Parameters (Comma-separated) <span class="text-danger">*</span></label>
                <textarea
                  v-model="formData.information"
                  class="form-control"
                  rows="4"
                  placeholder="Project Name, Kertas, Sisi Cetak, Panjang Kertas, Lebar Kertas, Jumlah Plat, etc."
                  required
                ></textarea>
                <div class="form-text small">Enter checklist items separated by commas.</div>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="modalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update Template' : 'Save Template' }}</button>
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
  title: 'Flow Template - Kacetak System'
})

interface FlowTemplateItem {
  id: number
  code: string
  name: string
  information: string
}

const templates = ref<FlowTemplateItem[]>([
  {
    id: 1,
    code: 'FT-0001',
    name: 'SPK Heidelberg SM52 4 Warna',
    information: 'Project Name, Kertas, Sisi Cetak, Panjang Kertas, Lebar Kertas, Kater/Model, Jumlah Plat, Jumlah Bahan, Jumlah Insit, Jumlah Butuh, Ada Contoh, Acc Warna, Keterangan'
  },
  {
    id: 2,
    code: 'FT-0002',
    name: 'SPK Cetak Outdoor',
    information: 'Project Name, Bahan/Media, Lebar Bahan, Panjang Cetak, Lebar Cetak, Jumlah Order, Finishing Mata Ayam, Sambung Media, Sisa Bahan, Keterangan'
  },
  {
    id: 3,
    code: 'FT-0003',
    name: 'SPK Cetak Indoor',
    information: 'Project Name, Bahan/Media, Resolusi Cetak, Panjang Cetak, Lebar Cetak, Jumlah Order, Laminasi Dingin, Cutting Pola, Ada Contoh, Keterangan'
  },
  {
    id: 4,
    code: 'FT-0004',
    name: 'SPK Cetak Digital A3',
    information: 'Project Name, Jenis Kertas, Sisi Cetak, Jumlah Klik/Lembar, Jenis Mesin, Potong Jadi, Garis Lipat, Laminasi, Keterangan'
  },
  {
    id: 5,
    code: 'FT-0005',
    name: 'SPK Proses Laminating',
    information: 'Project Name, Jenis Laminasi, Sisi Laminasi, Jumlah Lembar, Lebar Bahan, Suhu Mesin, Kecepatan, Keterangan'
  }
])

const searchQuery = ref('')

const filteredList = computed(() => {
  return templates.value.filter(t => {
    return (
      t.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.information.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

const modalVisible = ref(false)
const isEditing = ref(false)
const formData = reactive({
  id: 0,
  name: '',
  information: ''
})

function openAddModal() {
  isEditing.value = false
  formData.id = 0
  formData.name = ''
  formData.information = ''
  modalVisible.value = true
}

function openEditModal(t: FlowTemplateItem) {
  isEditing.value = true
  formData.id = t.id
  formData.name = t.name
  formData.information = t.information
  modalVisible.value = true
}

function saveTemplate() {
  if (isEditing.value) {
    const idx = templates.value.findIndex(t => t.id === formData.id)
    if (idx !== -1) {
      templates.value[idx].name = formData.name
      templates.value[idx].information = formData.information
    }
  } else {
    templates.value.push({
      id: Date.now(),
      code: 'FT-000' + (templates.value.length + 1),
      name: formData.name,
      information: formData.information
    })
  }
  modalVisible.value = false
}

function deleteTemplate(id: number) {
  if (confirm('Delete this flow template?')) {
    templates.value = templates.value.filter(t => t.id !== id)
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
