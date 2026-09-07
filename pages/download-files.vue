<template>
  <div class="page-wrapper notes-page-wrapper file-manager mt-3">
    <div class="content">
      <div class="page-header page-add-notes d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div class="add-item d-flex align-items-center">
          <div class="page-title">
            <h4>Download Files</h4>
            <p>Manage and download documents and assets</p>
          </div>
        </div>
        <div class="d-sm-flex align-items-center gap-2">
          <div class="form-sort owned-by w-auto">
            <select v-model="filterOwner" class="form-select form-select-sm">
              <option value="all">Owned by Anyone</option>
              <option value="me">Owned By Me</option>
              <option value="others">Not Owned by Me</option>
            </select>
          </div>
          <button type="button" class="btn btn-primary btn-added" @click="showUploadModal = true">
            <i class="ti ti-upload me-1"></i>Upload Files
          </button>
        </div>
      </div>

      <div class="row g-4">
        <!-- Sidebar -->
        <div class="col-lg-3 col-md-12">
          <aside class="card file-manager-sidebar p-3 mb-0">
            <h5 class="d-flex align-items-center mb-3">
              <i class="ti ti-folder fs-20 text-primary me-2"></i>Files & Storage
            </h5>

            <div class="dropdown mb-4">
              <button class="btn btn-primary w-100 dropdown-toggle d-flex align-items-center justify-content-center gap-1" type="button" data-bs-toggle="dropdown">
                <i class="ti ti-circle-plus"></i> New
              </button>
              <ul class="dropdown-menu w-100">
                <li><a class="dropdown-item" href="javascript:void(0);" @click="showUploadModal = true"><i class="ti ti-upload me-2"></i>Upload File</a></li>
                <li><a class="dropdown-item" href="javascript:void(0);" @click="showCreateFolderModal = true"><i class="ti ti-folder-plus me-2"></i>Create Folder</a></li>
              </ul>
            </div>

            <div class="d-flex align-items-center justify-content-between mb-1">
              <div class="d-flex align-items-center gap-1 text-muted small">
                <i class="ti ti-device-floppy"></i>
                <span>Storage</span>
              </div>
              <span class="small fw-bold">70%</span>
            </div>
            <div class="progress mb-2" style="height: 6px;">
              <div class="progress-bar bg-danger" role="progressbar" style="width: 70%"></div>
            </div>
            <span class="text-muted small">78.5 GB of 1 TB Used</span>

            <hr class="my-3" />

            <div class="list-group list-group-flush">
              <a
                href="javascript:void(0);"
                class="list-group-item list-group-item-action d-flex align-items-center justify-content-between border-0 px-2 py-2 rounded"
                :class="{ 'bg-light text-primary fw-bold': selectedType === '' }"
                @click="selectedType = ''"
              >
                <span><i class="ti ti-files me-2"></i>All Files</span>
                <span class="badge bg-secondary rounded-pill">{{ fileList.length }}</span>
              </a>
              <a
                href="javascript:void(0);"
                class="list-group-item list-group-item-action d-flex align-items-center justify-content-between border-0 px-2 py-2 rounded"
                :class="{ 'bg-light text-primary fw-bold': selectedType === 'pdf' }"
                @click="selectedType = 'pdf'"
              >
                <span><i class="ti ti-file-text me-2 text-danger"></i>PDF Documents</span>
              </a>
              <a
                href="javascript:void(0);"
                class="list-group-item list-group-item-action d-flex align-items-center justify-content-between border-0 px-2 py-2 rounded"
                :class="{ 'bg-light text-primary fw-bold': selectedType === 'excel' }"
                @click="selectedType = 'excel'"
              >
                <span><i class="ti ti-file-spreadsheet me-2 text-success"></i>Spreadsheets</span>
              </a>
              <a
                href="javascript:void(0);"
                class="list-group-item list-group-item-action d-flex align-items-center justify-content-between border-0 px-2 py-2 rounded"
                :class="{ 'bg-light text-primary fw-bold': selectedType === 'image' }"
                @click="selectedType = 'image'"
              >
                <span><i class="ti ti-photo me-2 text-info"></i>Images / Proofs</span>
              </a>
            </div>
          </aside>
        </div>

        <!-- Main Content -->
        <div class="col-lg-9">
          <!-- Filter toolbar -->
          <div class="card p-3 mb-4">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div class="search-input" style="min-width: 250px;">
                <input v-model="searchQuery" type="text" class="form-control form-control-sm" placeholder="Search file name..." />
              </div>

              <div class="d-flex align-items-center gap-2">
                <select v-model="selectedType" class="form-select form-select-sm" style="width: auto;">
                  <option value="">All File Types</option>
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="image">Image</option>
                </select>
                <select v-model="sortBy" class="form-select form-select-sm" style="width: auto;">
                  <option value="name">Sort by Name</option>
                  <option value="size">Sort by Size</option>
                  <option value="date">Sort by Date</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Files Grid -->
          <div class="row g-3">
            <div v-for="file in filteredFiles" :key="file.id" class="col-md-4 col-sm-6 col-12">
              <div class="card h-100 p-3 shadow-sm border position-relative">
                <div class="d-flex align-items-start justify-content-between mb-2">
                  <div class="p-2 rounded bg-light">
                    <i v-if="file.type === 'pdf'" class="ti ti-file-text text-danger fs-28"></i>
                    <i v-else-if="file.type === 'excel'" class="ti ti-file-spreadsheet text-success fs-28"></i>
                    <i v-else-if="file.type === 'image'" class="ti ti-photo text-info fs-28"></i>
                    <i v-else class="ti ti-file text-secondary fs-28"></i>
                  </div>
                  <div class="dropdown">
                    <button class="btn btn-sm btn-white border-0" type="button" data-bs-toggle="dropdown">
                      <i class="ti ti-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li><a class="dropdown-item" href="javascript:void(0);" @click="downloadFile(file)"><i class="ti ti-download me-2"></i>Download</a></li>
                      <li><a class="dropdown-item text-danger" href="javascript:void(0);" @click="deleteFile(file.id)"><i class="ti ti-trash me-2"></i>Delete</a></li>
                    </ul>
                  </div>
                </div>

                <h6 class="fw-bold text-dark text-truncate mb-1" :title="file.name">{{ file.name }}</h6>
                <div class="d-flex align-items-center justify-content-between text-muted small mt-2">
                  <span>{{ file.size }}</span>
                  <span>{{ file.date }}</span>
                </div>

                <div class="mt-3 pt-2 border-top">
                  <button type="button" class="btn btn-sm btn-outline-primary w-100" @click="downloadFile(file)">
                    <i class="ti ti-download me-1"></i>Download
                  </button>
                </div>
              </div>
            </div>

            <div v-if="filteredFiles.length === 0" class="col-12 text-center py-5 text-muted">
              No files found matching your search.
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Modal -->
      <div v-if="showUploadModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Upload File</h5>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="showUploadModal = false">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body text-center p-4">
              <div class="border border-dashed p-4 rounded mb-3">
                <i class="ti ti-cloud-upload fs-40 text-primary mb-2"></i>
                <p class="mb-1">Drag and drop file here or click to browse</p>
                <input type="file" class="form-control" @change="onFileSelected" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showUploadModal = false">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Folder Modal -->
      <div v-if="showCreateFolderModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Create Folder</h5>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="showCreateFolderModal = false">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <label class="form-label">Folder Name</label>
              <input v-model="newFolderName" type="text" class="form-control" placeholder="e.g. Design Proofs 2026" />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showCreateFolderModal = false">Cancel</button>
              <button type="button" class="btn btn-primary" @click="createFolder">Create</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Download Files - Kacetak System'
})

interface FileItem {
  id: number
  name: string
  type: 'pdf' | 'excel' | 'image' | 'file'
  size: string
  date: string
}

const filterOwner = ref('all')
const selectedType = ref('')
const sortBy = ref('name')
const searchQuery = ref('')
const showUploadModal = ref(false)
const showCreateFolderModal = ref(false)
const newFolderName = ref('')

const fileList = ref<FileItem[]>([
  { id: 1, name: 'Sportsmodel.pdf', type: 'pdf', size: '2.4 MB', date: '01 Feb 2026' },
  { id: 2, name: 'Projectdetails.xls', type: 'excel', size: '850 KB', date: '02 Feb 2026' },
  { id: 3, name: 'Catalog_Dulank_Print_2026.pdf', type: 'pdf', size: '14.2 MB', date: '05 Feb 2026' },
  { id: 4, name: 'SPK_Template_Offset.xlsx', type: 'excel', size: '1.1 MB', date: '10 Feb 2026' },
  { id: 5, name: 'Proofing_Logo_Kacetak.png', type: 'image', size: '3.6 MB', date: '12 Feb 2026' },
  { id: 6, name: 'Tarif_Harga_Cetak_2026.pdf', type: 'pdf', size: '4.8 MB', date: '14 Feb 2026' }
])

const filteredFiles = computed(() => {
  return fileList.value.filter(file => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch = !q || file.name.toLowerCase().includes(q)
    const matchType = !selectedType.value || file.type === selectedType.value
    return matchSearch && matchType
  }).sort((a, b) => {
    if (sortBy.value === 'name') return a.name.localeCompare(b.name)
    if (sortBy.value === 'date') return b.date.localeCompare(a.date)
    return 0
  })
})

const downloadFile = (file: FileItem) => {
  alert(`Downloading ${file.name}...`)
}

const deleteFile = (id: number) => {
  if (confirm('Delete this file?')) {
    fileList.value = fileList.value.filter(f => f.id !== id)
  }
}

const onFileSelected = (e: any) => {
  const file = e.target.files[0]
  if (file) {
    fileList.value.unshift({
      id: Date.now(),
      name: file.name,
      type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? 'excel' : 'file',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toLocaleDateString('en-GB')
    })
    showUploadModal.value = false
  }
}

const createFolder = () => {
  if (newFolderName.value.trim()) {
    alert(`Folder "${newFolderName.value}" created successfully!`)
    newFolderName.value = ''
    showCreateFolderModal.value = false
  }
}
</script>

