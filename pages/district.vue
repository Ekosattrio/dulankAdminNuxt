<template>
  <div class="page-wrapper">
    <div class="content container-fluid">
      <div class="page-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>District List</h4>
            <h6>Manage your District</h6>
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
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-added" @click="openAddModal">
            <i class="ti ti-plus me-1"></i> Add New District
          </button>
          <button class="btn btn-outline-primary" @click="showImportModal = true">
            <i class="ti ti-download me-1"></i> Import District
          </button>
        </div>
      </div>

      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set d-block d-md-flex align-items-center gap-2">
              <div class="search-input position-relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Search District, Regency or Province..."
                />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="selectedProvince" class="form-select form-select-sm" style="min-width: 140px;">
                <option value="">All Provinces</option>
                <option value="DKI Jakarta">DKI Jakarta</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead>
                <tr>
                  <th>Province</th>
                  <th>Regency</th>
                  <th>District</th>
                  <th>Added</th>
                  <th>Created by</th>
                  <th class="text-end no-sort">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(dist, idx) in filteredDistricts" :key="idx">
                  <td class="text-muted">{{ dist.province }}</td>
                  <td class="text-secondary">{{ dist.regency }}</td>
                  <td class="fw-semibold text-dark">{{ dist.name }}</td>
                  <td>{{ dist.added }}</td>
                  <td>
                    <div class="userimgname d-flex align-items-center gap-2">
                      <a href="javascript:void(0);" class="product-img">
                        <img :src="dist.avatar" alt="user" class="rounded-circle" style="width: 30px; height: 30px; object-fit: cover;" />
                      </a>
                      <span class="text-muted">{{ dist.createdBy }}</span>
                    </div>
                  </td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-outline-info p-1" title="View" @click="viewDistrict(dist)">
                        <i class="ti ti-eye"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-primary p-1" title="Edit" @click="openEditModal(dist)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger p-1" title="Delete" @click="deleteDistrict(idx)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredDistricts.length === 0">
                  <td colspan="6" class="text-center py-4 text-muted">No districts found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>{{ isEditing ? 'Edit District' : 'Add New District' }}</h4>
              </div>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="saveDistrict">
                <div class="mb-3">
                  <label class="form-label">Province</label>
                  <select v-model="currentDistrict.province" class="form-select" required>
                    <option value="DKI Jakarta">DKI Jakarta</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Regency / City</label>
                  <input v-model="currentDistrict.regency" type="text" class="form-control" required placeholder="e.g. Jakarta Selatan" />
                </div>
                <div class="mb-3">
                  <label class="form-label">District (Kecamatan) Name</label>
                  <input v-model="currentDistrict.name" type="text" class="form-control" required placeholder="e.g. Kebayoran Baru" />
                </div>
                <div class="modal-footer modal-action-footer justify-content-end pt-3 border-top">
                  <button type="button" class="btn btn-light" @click="showModal = false">Cancel</button>
                  <button type="submit" class="btn btn-warning text-white">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Import Modal -->
      <div v-if="showImportModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>Import District Data</h4>
              </div>
              <button type="button" class="btn-close" @click="showImportModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <div class="mb-3">
                <label class="form-label">Choose CSV / Excel File</label>
                <input type="file" class="form-control" accept=".csv,.xlsx,.xls" />
              </div>
              <div class="modal-footer modal-action-footer justify-content-end pt-3 border-top">
                <button type="button" class="btn btn-light" @click="showImportModal = false">Cancel</button>
                <button type="button" class="btn btn-warning text-white" @click="showImportModal = false">Import</button>
              </div>
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
  title: 'District List - Kacetak System'
})

const searchQuery = ref('')
const selectedProvince = ref('')
const showModal = ref(false)
const showImportModal = ref(false)
const isEditing = ref(false)

interface DistrictItem {
  id?: number
  province: string
  regency: string
  name: string
  added: string
  createdBy: string
  avatar: string
}

const districts = ref<DistrictItem[]>([
  { id: 1, province: 'DKI Jakarta', regency: 'Jakarta Selatan', name: 'Kebayoran Baru', added: '2025-08-28', createdBy: 'Arroon', avatar: '/assets/img/users/user-30.jpg' },
  { id: 2, province: 'Jawa Barat', regency: 'Bandung', name: 'Lengkong', added: '2025-08-27', createdBy: 'Kenneth', avatar: '/assets/img/users/user-13.jpg' },
  { id: 3, province: 'Jawa Tengah', regency: 'Semarang', name: 'Candisari', added: '2025-08-26', createdBy: 'Gart', avatar: '/assets/img/users/user-11.jpg' },
  { id: 4, province: 'DKI Jakarta', regency: 'Jakarta Timur', name: 'Kramat Jati', added: '2025-08-25', createdBy: 'Steven', avatar: '/assets/img/users/user-01.jpg' },
  { id: 5, province: 'Jawa Barat', regency: 'Bogor', name: 'Bogor Tengah', added: '2025-08-24', createdBy: 'Susan', avatar: '/assets/img/users/user-02.jpg' }
])

const currentDistrict = ref<DistrictItem>({
  province: 'DKI Jakarta',
  regency: '',
  name: '',
  added: '',
  createdBy: 'Admin',
  avatar: '/assets/img/users/user-01.jpg'
})

const filteredDistricts = computed(() => {
  return districts.value.filter(d => {
    const q = searchQuery.value.toLowerCase()
    const matchQ = d.name.toLowerCase().includes(q) || d.regency.toLowerCase().includes(q) || d.province.toLowerCase().includes(q)
    const matchProv = !selectedProvince.value || d.province === selectedProvince.value
    return matchQ && matchProv
  })
})

const openAddModal = () => {
  isEditing.value = false
  currentDistrict.value = {
    province: selectedProvince.value || 'DKI Jakarta',
    regency: '',
    name: '',
    added: new Date().toISOString().split('T')[0],
    createdBy: 'Admin',
    avatar: '/assets/img/users/user-01.jpg'
  }
  showModal.value = true
}

const openEditModal = (d: DistrictItem) => {
  isEditing.value = true
  currentDistrict.value = { ...d }
  showModal.value = true
}

const viewDistrict = (d: DistrictItem) => {
  alert(`District: ${d.name}\nRegency: ${d.regency}\nProvince: ${d.province}\nAdded: ${d.added}`)
}

const saveDistrict = () => {
  if (isEditing.value) {
    const idx = districts.value.findIndex(d => d.id === currentDistrict.value.id)
    if (idx !== -1) {
      districts.value[idx] = { ...currentDistrict.value }
    }
  } else {
    districts.value.unshift({
      id: Date.now(),
      province: currentDistrict.value.province,
      regency: currentDistrict.value.regency,
      name: currentDistrict.value.name,
      added: currentDistrict.value.added,
      createdBy: currentDistrict.value.createdBy,
      avatar: currentDistrict.value.avatar
    })
  }
  showModal.value = false
}

const deleteDistrict = (idx: number) => {
  if (confirm('Are you sure you want to delete this district?')) {
    districts.value.splice(idx, 1)
  }
}

const exportPdf = () => {
  window.print()
}

const printTable = () => {
  window.print()
}

const refresh = () => {
  // refresh
}

const toggleCollapse = () => {
  // collapse
}
</script>
