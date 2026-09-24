<script setup lang="ts">
import type { ExpenseCategory, ExpenseCategoryFormData } from '~/types/expense-category'

const props = defineProps<{
  isOpen: boolean
  editData: ExpenseCategory | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: ExpenseCategoryFormData): void
}>()

const form = ref<ExpenseCategoryFormData>({
  categoryName: '',
  description: '',
  status: 'Active'
})

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        categoryName: val.categoryName,
        description: val.description,
        date: val.date,
        status: val.status
      }
    } else {
      form.value = {
        categoryName: '',
        description: '',
        status: 'Active'
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (!form.value.categoryName) {
    alert('Nama kategori tidak boleh kosong')
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
            {{ editData ? 'Edit Expense Category' : 'Add Expense Category' }}
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold">Category Name <span class="text-danger">*</span></label>
              <input
                v-model="form.categoryName"
                type="text"
                class="form-control"
                placeholder="e.g. Biaya Gaji, Bahan Baku, dsb."
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Description</label>
              <textarea
                v-model="form.description"
                class="form-control"
                rows="3"
                placeholder="Keterangan kategori pengeluaran..."
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Status</label>
              <select v-model="form.status" class="form-select">
                <option value="Active">Active</option>
                <option value="Deactive">Deactive</option>
              </select>
            </div>
          </div>

          <div class="modal-footer border-top px-4 py-3 bg-light">
            <button type="button" class="btn btn-secondary px-4" @click="emit('close')">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary px-4">
              {{ editData ? 'Update Category' : 'Save Category' }}
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
  max-width: 500px;
  margin: 1rem;
}
</style>

