<script setup lang="ts">
import type { Designation, DesignationFormData } from '~/types/designation'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import PagesDesignationModal from '~/components/Designation/DesignationModal.vue'
import PagesDesignationTable from '~/components/Designation/DesignationTable.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Designation - Jabatan Karyawan',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { designations, pending, refresh, saveDesignation, deleteDesignation } = useDesignations()

const searchQuery = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const editData = ref<Designation | null>(null)

const filteredDesignations = computed(() => {
  return designations.value.filter((d) => {
    const matchQuery =
      !searchQuery.value ||
      d.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = !selectedStatus.value || d.status === selectedStatus.value
    return matchQuery && matchStatus
  })
})

const openAddModal = () => {
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (d: Designation) => {
  editData.value = d
  isModalOpen.value = true
}

const itemToDelete = ref<string | null>(null)
const isDeleting = ref(false)

const handleDelete = (id: string) => {
  itemToDelete.value = id
}

const handleConfirmDelete = async () => {
  if (!itemToDelete.value) return
  isDeleting.value = true
  try {
    await deleteDesignation(itemToDelete.value)
    itemToDelete.value = null
  } catch (error) {
    console.error('Failed to delete designation:', error)
  } finally {
    isDeleting.value = false
  }
}

const handleSave = async (payload: DesignationFormData) => {
  try {
    await saveDesignation(payload)
    isModalOpen.value = false
  } catch (error) {
    console.error('Failed to save designation:', error)
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Designation / Jabatan"
      subtitle="Kelola daftar posisi, jabatan, dan tanggung jawab kerja"
      add-label="Add Designation"
      :refreshing="pending"
      @add="openAddModal"
      @refresh="refresh()"
    />

    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="relative w-full max-w-xs">
          <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FeatherIcon name="search" size="14" />
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Cari nama jabatan..."
          />
        </div>
        <div>
          <select
            v-model="selectedStatus"
            class="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">Semua Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div v-if="pending" class="py-12 text-center text-sm text-gray-500">
        <div class="spinner-border text-primary inline-block h-8 w-8 animate-spin rounded-full border-4" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <PagesDesignationTable
        v-else
        :designations="filteredDesignations"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <PagesDesignationModal
      :is-open="isModalOpen"
      :edit-data="editData"
      @close="isModalOpen = false"
      @save="handleSave"
    />

    <SalesConfirmDelete
      :open="!!itemToDelete"
      title="Delete Designation"
      message="Apakah Anda yakin ingin menghapus jabatan ini? Tindakan ini tidak dapat dibatalkan."
      :is-loading="isDeleting"
      @confirm="handleConfirmDelete"
      @close="itemToDelete = null"
    />
  </div>
</template>
