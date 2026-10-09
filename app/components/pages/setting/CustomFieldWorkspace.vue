<script setup lang="ts">
import type { CustomField, CustomFieldInput } from '#server/types/custom-fields'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import CustomFieldTable from './custom-field/CustomFieldTable.vue'
import CustomFieldModal from './custom-field/CustomFieldModal.vue'

const { fields, pending, error, refresh, addField, updateField, deleteField } = useCustomFields()

const isModalOpen = ref(false)
const selectedField = ref<CustomField | null>(null)
const isSaving = ref(false)

const isDeleteModalOpen = ref(false)
const deletingField = ref<CustomField | null>(null)
const isDeleting = ref(false)

function openAddModal() {
  selectedField.value = null
  isModalOpen.value = true
}

function handleEdit(item: CustomField) {
  selectedField.value = item
  isModalOpen.value = true
}

function handleDelete(item: CustomField) {
  deletingField.value = item
  isDeleteModalOpen.value = true
}

async function handleSave(payload: CustomFieldInput) {
  isSaving.value = true
  try {
    if (selectedField.value) {
      await updateField(selectedField.value.id, payload)
    } else {
      await addField(payload)
    }
    isModalOpen.value = false
    selectedField.value = null
  } catch (err) {
    console.error('Failed to save custom field:', err)
  } finally {
    isSaving.value = false
  }
}

async function confirmDelete() {
  if (!deletingField.value) return
  isDeleting.value = true
  try {
    await deleteField(deletingField.value.id)
    isDeleteModalOpen.value = false
    deletingField.value = null
  } catch (err) {
    console.error('Failed to delete custom field:', err)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Custom Fields"
      subtitle="Kelola bidang data kustom tambahan untuk modul sistem"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <SalesFeedback
      v-if="pending && !fields.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat data custom fields'"
      @retry="refresh"
    />

    <CustomFieldTable
      v-else
      :fields="fields"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <CustomFieldModal
      :open="isModalOpen"
      :field="selectedField"
      :busy="isSaving"
      @close="isModalOpen = false"
      @submit="handleSave"
    />

    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Custom Field"
      message="Apakah Anda yakin ingin menghapus bidang kustom ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
