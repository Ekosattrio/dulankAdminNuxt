<script setup lang="ts">
import type { EmployeeItem, EmployeeFormData } from '~/types/employee'

const props = defineProps<{
  isOpen: boolean
  editData: EmployeeItem | null
  viewOnly?: boolean
  departments: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: EmployeeFormData): void
}>()

const form = ref<EmployeeFormData>({
  name: '',
  department: 'Produksi',
  address: '',
  detailAddress: '',
  phone: '',
  status: 'Active',
  gender: 'Male',
  dob: '',
  joinChannel: 'Offline',
  email: ''
})

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        department: val.department,
        address: val.address,
        detailAddress: val.detailAddress || '',
        phone: val.phone,
        joinDate: val.joinDate,
        status: val.status,
        gender: val.gender || 'Male',
        dob: val.dob || '',
        joinChannel: val.joinChannel || 'Offline',
        email: val.email || ''
      }
    } else {
      form.value = {
        name: '',
        department: props.departments[0] || 'Produksi',
        address: '',
        detailAddress: '',
        phone: '',
        status: 'Active',
        gender: 'Male',
        dob: '',
        joinChannel: 'Offline',
        email: ''
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (props.viewOnly) {
    emit('close')
    return
  }
  if (!form.value.name || !form.value.phone) {
    alert('Nama karyawan dan nomor telepon harus diisi')
    return
  }
  emit('save', { ...form.value })
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop-custom">
    <div class="modal-dialog-custom modal-lg">
      <div class="modal-content border-0 shadow-lg rounded-3">
        <div class="modal-header border-bottom px-4 py-3 bg-light">
          <h5 class="modal-title fs-5 fw-bold text-dark">
            <span v-if="viewOnly">Detail Karyawan</span>
            <span v-else-if="editData">Edit Data Karyawan</span>
            <span v-else>Tambah Karyawan Baru</span>
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <!-- View Only Mode -->
            <div v-if="viewOnly && editData" class="row g-3">
              <div class="col-md-6">
                <span class="text-muted d-block small">ID Karyawan</span>
                <span class="fw-bold text-primary">{{ editData.id }}</span>
              </div>
              <div class="col-md-6">
                <span class="text-muted d-block small">Nama Lengkap</span>
                <span class="fw-bold">{{ editData.name }}</span>
              </div>
              <div class="col-md-6">
                <span class="text-muted d-block small">Departemen</span>
                <span class="badge bg-light text-dark border">{{ editData.department }}</span>
              </div>
              <div class="col-md-6">
                <span class="text-muted d-block small">Status</span>
                <span class="badge bg-primary">{{ editData.status }}</span>
              </div>
              <div class="col-md-6">
                <span class="text-muted d-block small">Nomor Telepon</span>
                <span>{{ editData.phone }}</span>
              </div>
              <div class="col-md-6">
                <span class="text-muted d-block small">Email</span>
                <span>{{ editData.email || '-' }}</span>
              </div>
              <div class="col-12">
                <span class="text-muted d-block small">Alamat</span>
                <p class="mb-0">{{ editData.address }}</p>
                <small class="text-muted" v-if="editData.detailAddress">{{ editData.detailAddress }}</small>
              </div>
            </div>

            <!-- Form Mode -->
            <div v-else class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Nama Lengkap <span class="text-danger">*</span></label>
                <input v-model="form.name" type="text" class="form-control" required placeholder="e.g. Budi Setiadi" />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Departemen <span class="text-danger">*</span></label>
                <select v-model="form.department" class="form-select" required>
                  <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
                  <option v-if="departments.length === 0" value="Produksi">Produksi</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">No. Telepon / WhatsApp <span class="text-danger">*</span></label>
                <input v-model="form.phone" type="text" class="form-control" required placeholder="+62..." />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Email</label>
                <input v-model="form.email" type="email" class="form-control" placeholder="budi@example.com" />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Gender</label>
                <select v-model="form.gender" class="form-select">
                  <option value="Male">Laki-laki (Male)</option>
                  <option value="Female">Perempuan (Female)</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Status Karyawan</label>
                <select v-model="form.status" class="form-select">
                  <option value="Active">Active</option>
                  <option value="Resign">Resign</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold">Alamat Wilayah</label>
                <input v-model="form.address" type="text" class="form-control" placeholder="Provinsi, Kota, Kecamatan" />
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold">Detail Alamat</label>
                <textarea v-model="form.detailAddress" class="form-control" rows="2" placeholder="Nama jalan, RT/RW, nomor rumah..."></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer border-top px-4 py-3 bg-light">
            <button type="button" class="btn btn-secondary px-4" @click="emit('close')">
              {{ viewOnly ? 'Tutup' : 'Batal' }}
            </button>
            <button v-if="!viewOnly" type="submit" class="btn btn-primary px-4">
              {{ editData ? 'Update Karyawan' : 'Simpan Karyawan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-dialog-custom {
  width: 100%;
  max-width: 650px;
  margin: 1rem;
}
</style>

