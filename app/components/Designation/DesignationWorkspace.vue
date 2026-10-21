<script setup lang="ts">
import type { Designation, DesignationFormData } from '#server/types/designation'
import PagesDesignationModal from '~/components/Designation/DesignationModal.vue'
import PagesDesignationTable from '~/components/Designation/DesignationTable.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'

const { designations, pending, error, refresh, saveDesignation, deleteDesignation } = useDesignations()

const { employees } = useMasterOptions()
const searchQuery = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const editData = ref<Designation | null>(null)
const isBusy = ref(false)

const toastMessage = ref('')
let toastTimer: any = null

function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

const filteredDesignations = computed(() => {
  return designations.value.filter((d) => {
    const matchQuery =
      !searchQuery.value.trim() ||
      d.name?.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
    const matchStatus = !selectedStatus.value || d.status === selectedStatus.value
    return matchQuery && matchStatus
  })
})

const { isPrintModalOpen, defaultPrintAction, printTitle, printColumns, printRows, openPrintModal } = useTablePrint()
function handlePrint(action: 'print' | 'pdf') {
  openPrintModal({ title: 'Designation / Jabatan', action, columns: [
    { key: 'name', label: 'Designation' }, { key: 'members', label: 'Members' },
    { key: 'totalMembers', label: 'Total Members' }, { key: 'createdOn', label: 'Created On' }, { key: 'status', label: 'Status' },
  ], rows: filteredDesignations.value.map(item => ({ ...item, members: item.members.join(', ') })) })
}

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
    const res = await deleteDesignation(itemToDelete.value)
    showToast(res?.message || 'Jabatan berhasil dihapus')
    itemToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Gagal menghapus jabatan')
  } finally {
    isDeleting.value = false
  }
}

const handleSave = async (payload: DesignationFormData) => {
  isBusy.value = true
  try {
    const res = await saveDesignation(payload)
    showToast(res?.message || (editData.value ? 'Jabatan berhasil diperbarui' : 'Jabatan berhasil dibuat'))
    isModalOpen.value = false
    editData.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Gagal menyimpan jabatan')
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Designation / Jabatan"
      subtitle="Kelola daftar posisi, jabatan, dan tanggung jawab kerja karyawan"
      add-label="Add Designation"
      :refreshing="pending"
      @add="openAddModal"
      @refresh="refresh()"
    />

    <SalesFeedback
      v-if="toastMessage"
      :message="toastMessage"
      @dismiss="toastMessage = ''"
    />

    <SalesFeedback
      v-if="pending && !designations.length"
      loading
    />

    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat data jabatan'"
      @retry="refresh"
    />

    <PagesDesignationTable
      v-else
      :designations="filteredDesignations"
      :search-query="searchQuery"
      :filter-status="selectedStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="selectedStatus = $event"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <DocumentPrintModal :open="isPrintModalOpen" :title="printTitle" :columns="printColumns" :rows="printRows" :default-action="defaultPrintAction" :show-date-range="false" @close="isPrintModalOpen = false" />

    <PagesDesignationModal
      :is-open="isModalOpen"
      :edit-data="editData"
      :employees="employees"
      :busy="isBusy"
      @close="isModalOpen = false"
      @save="handleSave"
    />

    <SalesConfirmDelete
      :open="!!itemToDelete"
      title="Hapus Jabatan"
      message="Apakah Anda yakin ingin menghapus jabatan ini? Karyawan yang terkait dengan jabatan ini mungkin perlu dialihkan."
      :busy="isDeleting"
      @close="itemToDelete = null"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<style scoped>
/* Scoped styles for DesignationWorkspace */
</style>
