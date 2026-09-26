<script setup lang="ts">
import type { WorkFlow, WorkFlowFormData } from '~/types/work-flow'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  editData?: WorkFlow | null
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: WorkFlowFormData): void
}>()

const form = reactive<WorkFlowFormData>({
  id: '',
  no: '',
  category: '',
  product: '',
  workflowSteps: ''
})

watch(
  () => props.editData,
  (val) => {
    if (val && props.isEdit) {
      form.id = val.id
      form.no = val.no
      form.category = val.category
      form.product = val.product
      form.workflowSteps = val.workflowSteps
    } else {
      form.id = ''
      form.no = ''
      form.category = props.categories[0] || 'Offset'
      form.product = ''
      form.workflowSteps = 'Artwork, Plat CTP, Cetak, Potong, Packing'
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop-custom">
    <div class="modal-dialog-centered custom-modal-two" style="max-width: 550px; width: 100%; margin: auto;">
      <div class="modal-content bg-white rounded-3 shadow border-0 overflow-hidden">
        <div class="p-4">
          <!-- Header -->
          <div class="modal-header border-0 p-0 pb-3 mb-3 d-flex justify-content-between align-items-center">
            <h4 class="fw-bold mb-0 text-dark">
              {{ isEdit ? 'Edit Work Flow' : 'Add Work Flow' }}
            </h4>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div v-if="isEdit" class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Workflow No</label>
                <input :value="form.no" type="text" class="form-control bg-light" disabled />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Category <span class="text-danger">*</span></label>
                <select v-model="form.category" class="form-select" required>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Product Name <span class="text-danger">*</span></label>
                <input
                  v-model="form.product"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Brosur A5, Spanduk"
                  required
                />
              </div>

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Workflow Steps (Comma separated) <span class="text-danger">*</span></label>
                <textarea
                  v-model="form.workflowSteps"
                  rows="3"
                  class="form-control"
                  placeholder="e.g. Artwork, Plat CTP, Cetak SM52, Potong, Packing"
                  required
                ></textarea>
                <small class="text-muted">Separate sequential production stations with comma.</small>
              </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer justify-content-end p-0 pt-4 mt-3 border-top d-flex gap-2">
              <button type="button" class="btn btn-secondary" @click="emit('close')">
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary px-4 fw-semibold"
              >
                {{ isEdit ? 'Save Changes' : 'Create Template' }}
              </button>
            </div>
          </form>
        </div>
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
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 15px;
}
</style>

