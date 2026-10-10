<script setup lang="ts">
import type { IncentiveItem, IncentiveFormData } from '#server/types/incentive'
import PagesIncentiveModal from '~/components/Incentive/IncentiveModal.vue'
import PagesIncentiveTable from '~/components/Incentive/IncentiveTable.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import { tableFilterControlClass } from '~/utils/salesUi'

definePageMeta({ layout: 'default' })

useLegacyPage({
  title: 'Incentive Management - Insentif Karyawan',
  sweetAlert: false
})

const { incentives, pending, error, refresh, saveIncentive, deleteIncentive } = useIncentives()

const searchQuery = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const editData = ref<IncentiveItem | null>(null)

const deleteModalOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const deleteBusy = ref(false)

const filteredIncentives = computed(() => {
  return incentives.value.filter((item) => {
    const matchSearch =
      !searchQuery.value ||
      item.employee?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = !selectedStatus.value || item.status === selectedStatus.value
    return matchSearch && matchStatus
  })
})

const openAddModal = () => {
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (item: IncentiveItem) => {
  editData.value = item
  isModalOpen.value = true
}

const handleDelete = (id: string) => {
  deleteTargetId.value = id
  deleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!deleteTargetId.value) return
  deleteBusy.value = true
  try {
    await deleteIncentive(deleteTargetId.value)
    deleteModalOpen.value = false
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete incentive:', err)
  } finally {
    deleteBusy.value = false
  }
}

const handleSave = async (formData: IncentiveFormData) => {
  try {
    await saveIncentive(formData)
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save incentive:', err)
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-incentive space-y-6">
    <SalesListHeader
      title="Incentive Management"
      subtitle="Kelola perhitungan insentif performa produksi dan staf"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <!-- Filter and Search Toolbar -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
      <div class="relative flex-1 max-w-sm">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <FeatherIcon name="search" :size="16" />
        </span>
        <input
          v-model="searchQuery"
          type="text"
          :class="[tableFilterControlClass, 'pl-9 w-full']"
          placeholder="Cari karyawan atau kode insentif..."
        />
      </div>

      <div class="flex items-center gap-3">
        <TableFilterSelect
          v-model="selectedStatus"
          :options="[
            { label: 'Semua Status', value: '' },
            { label: 'Paid', value: 'Paid' },
            { label: 'Pending', value: 'Pending' }
          ]"
          placeholder="Status"
        />
      </div>
    </div>

    <!-- Feedback State -->
    <SalesFeedback
      v-if="pending || error"
      :loading="pending"
      :error="error ? (error.message || 'Gagal memuat data insentif') : undefined"
      @retry="refresh"
    />

    <!-- Table -->
    <PagesIncentiveTable
      v-else
      :incentives="filteredIncentives"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Modal Form -->
    <PagesIncentiveModal
      :is-open="isModalOpen"
      :edit-data="editData"
      @close="isModalOpen = false"
      @save="handleSave"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="deleteModalOpen"
      title="Hapus Insentif"
      message="Apakah Anda yakin ingin menghapus data insentif ini? Tindakan ini tidak dapat dibatalkan."
      :busy="deleteBusy"
      @confirm="confirmDelete"
      @close="deleteModalOpen = false"
    />
  </div>
</template>
