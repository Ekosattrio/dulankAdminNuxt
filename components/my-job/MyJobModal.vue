<script setup lang="ts">
import type { MyJob, MyJobFormData } from '~/types/my-job'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  isOpen: boolean
  editData: MyJob | null
  viewOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: MyJobFormData): void
}>()

const form = ref<MyJobFormData>({
  flowName: '',
  priority: 'normal',
  product: '',
  title: '',
  description: '',
  status: 'Waiting',
  assignedTo: '',
  dueDate: ''
})

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        flowName: val.flowName,
        priority: val.priority,
        product: val.product,
        title: val.title,
        description: val.description,
        status: val.status,
        assignedTo: val.assignedTo || '',
        dueDate: val.dueDate || ''
      }
    } else {
      form.value = {
        flowName: '',
        priority: 'normal',
        product: '',
        title: '',
        description: '',
        status: 'Waiting',
        assignedTo: '',
        dueDate: new Date().toISOString().split('T')[0]
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
  if (!form.value.title || !form.value.flowName) {
    alert('Please fill in Job Title and Flow Station')
    return
  }
  emit('save', { ...form.value })
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop-custom">
    <div class="modal-dialog-custom modal-md">
      <div class="modal-content border-0 shadow-lg rounded-3">
        <div class="modal-header border-bottom px-4 py-3 bg-light">
          <h5 class="modal-title fs-5 fw-bold text-dark">
            <span v-if="viewOnly">Detail Tugas Job</span>
            <span v-else-if="editData">Edit Tugas Job</span>
            <span v-else>Tambah Job Task Baru</span>
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold">Flow Station / Operation <span class="text-danger">*</span></label>
              <input
                v-model="form.flowName"
                type="text"
                class="form-control"
                placeholder="e.g. Mesin SM52 4 Warna / Mesin Pond"
                :disabled="viewOnly"
                required
              />
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Produk / Item</label>
                <input
                  v-model="form.product"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Brosur A5, Box Packaging"
                  :disabled="viewOnly"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Priority</label>
                <select v-model="form.priority" class="form-select" :disabled="viewOnly">
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Job Title / Nama Pekerjaan <span class="text-danger">*</span></label>
              <input
                v-model="form.title"
                type="text"
                class="form-control"
                placeholder="e.g. Cetak Brosur Promo Merdeka"
                :disabled="viewOnly"
                required
              />
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Status Pekerjaan</label>
                <select v-model="form.status" class="form-select" :disabled="viewOnly">
                  <option value="Waiting">Waiting</option>
                  <option value="On Process">On Process</option>
                  <option value="Complete">Complete</option>
                  <option value="Hold">Hold</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Due Date</label>
                <input
                  v-model="form.dueDate"
                  type="date"
                  class="form-control"
                  :disabled="viewOnly"
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Operator / Petugas</label>
              <input
                v-model="form.assignedTo"
                type="text"
                class="form-control"
                placeholder="e.g. Satrio, Budi"
                :disabled="viewOnly"
              />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Spesifikasi / Instruksi Khusus</label>
              <textarea
                v-model="form.description"
                class="form-control"
                rows="3"
                placeholder="Detail spesifikasi bahan, finishing, ukuran potongan, dll."
                :disabled="viewOnly"
              ></textarea>
            </div>
          </div>

          <div class="modal-footer border-top px-4 py-3 bg-light">
            <button type="button" class="btn btn-secondary px-4" @click="emit('close')">
              {{ viewOnly ? 'Tutup' : 'Batal' }}
            </button>
            <button v-if="!viewOnly" type="submit" class="btn btn-primary px-4">
              Simpan
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
  max-width: 550px;
  margin: 1rem;
}
</style>

