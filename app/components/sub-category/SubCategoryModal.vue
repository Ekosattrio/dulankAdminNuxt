<script setup lang="ts">
import type { SubCategory, SubCategoryFormData } from '~/types/sub-category'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  editData?: SubCategory | null
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: SubCategoryFormData): void
}>()

const form = reactive<SubCategoryFormData>({
  id: '',
  name: '',
  category: '',
  categoryCode: '',
  description: '',
  status: 'Active'
})

watch(
  () => props.editData,
  (val) => {
    if (val && props.isEdit) {
      form.id = val.id
      form.name = val.name
      form.category = val.category
      form.categoryCode = val.categoryCode
      form.description = val.description
      form.status = val.status || 'Active'
    } else {
      form.id = ''
      form.name = ''
      form.category = props.categories[0] || ''
      form.categoryCode = ''
      form.description = ''
      form.status = 'Active'
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
    <div class="modal-dialog-centered custom-modal-two" style="max-width: 520px; width: 100%; margin: auto;">
      <div class="modal-content bg-white rounded-3 shadow border-0 overflow-hidden">
        <div class="p-4">
          <!-- Header -->
          <div class="modal-header border-0 p-0 pb-3 mb-3 d-flex justify-content-between align-items-center">
            <h4 class="fw-bold mb-0 text-dark">
              {{ isEdit ? 'Edit Sub Category' : 'Add Sub Category' }}
            </h4>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Parent Category <span class="text-danger">*</span></label>
                <select v-model="form.category" class="form-select" required>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Sub Category Name <span class="text-danger">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Print Outdoor, Cetak A3+"
                  required
                />
              </div>

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Description</label>
                <textarea
                  v-model="form.description"
                  rows="2"
                  class="form-control"
                  placeholder="Brief description of sub category..."
                ></textarea>
              </div>

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Status</label>
                <select v-model="form.status" class="form-select">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                {{ isEdit ? 'Save Changes' : 'Create Sub Category' }}
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

