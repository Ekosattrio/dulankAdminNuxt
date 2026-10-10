<script setup lang="ts">
import type { Product, ProductFormData } from '~/types/product'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  editData?: Product | null
  categories: string[]
  units: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: ProductFormData): void
}>()

const form = reactive<ProductFormData>({
  id: '',
  code: '',
  name: '',
  category: '',
  subCategory: '',
  unit: 'Piece',
  price: 0,
  priceType: 'Single Price',
  status: 'Active'
})

watch(
  () => props.editData,
  (val) => {
    if (val && props.isEdit) {
      form.id = val.id
      form.code = val.code
      form.name = val.name
      form.category = val.category
      form.subCategory = val.subCategory
      form.unit = val.unit
      form.price = val.price
      form.priceType = val.priceType
      form.status = val.status || 'Active'
    } else {
      form.id = ''
      form.code = ''
      form.name = ''
      form.category = props.categories[0] || ''
      form.subCategory = ''
      form.unit = props.units[0] || 'Piece'
      form.price = 0
      form.priceType = 'Single Price'
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
    <div class="modal-dialog-centered custom-modal-two" style="max-width: 600px; width: 100%; margin: auto;">
      <div class="modal-content bg-white rounded-3 shadow border-0 overflow-hidden">
        <div class="p-4">
          <!-- Header -->
          <div class="modal-header border-0 p-0 pb-3 mb-3 d-flex justify-content-between align-items-center">
            <h4 class="fw-bold mb-0 text-dark">
              {{ isEdit ? 'Edit Product' : 'Add New Product' }}
            </h4>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div v-if="isEdit" class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Item Code</label>
                <input :value="form.code" type="text" class="form-control bg-light" disabled />
              </div>

              <div :class="isEdit ? 'col-md-6' : 'col-12'">
                <label class="form-label text-xs fw-semibold text-muted">Product Name <span class="text-danger">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Flexy 280gr"
                  required
                />
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
                <label class="form-label text-xs fw-semibold text-muted">Sub Category</label>
                <input
                  v-model="form.subCategory"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Print Outdoor"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label text-xs fw-semibold text-muted">Unit</label>
                <select v-model="form.unit" class="form-select">
                  <option v-for="u in units" :key="u" :value="u">
                    {{ u }}
                  </option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label text-xs fw-semibold text-muted">Price (IDR) <span class="text-danger">*</span></label>
                <input
                  v-model.number="form.price"
                  type="number"
                  class="form-control"
                  placeholder="0"
                  required
                />
              </div>

              <div class="col-md-4">
                <label class="form-label text-xs fw-semibold text-muted">Price Type</label>
                <select v-model="form.priceType" class="form-select">
                  <option value="Single Price">Single Price</option>
                  <option value="Size Calculation">Size Calculation</option>
                  <option value="Quantity Tier">Quantity Tier</option>
                  <option value="Tier Price">Tier Price</option>
                </select>
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
                {{ isEdit ? 'Save Changes' : 'Create Product' }}
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

