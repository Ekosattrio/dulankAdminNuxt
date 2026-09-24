<script setup lang="ts">
import type { MyIncentive, MyIncentiveFormData } from '~/types/my-incentive'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'My Incentives - Insentif Saya',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { myIncentives, pending, refresh, saveMyIncentive, deleteMyIncentive } = useMyIncentives()

const searchQuery = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const editData = ref<MyIncentive | null>(null)

const filteredList = computed(() => {
  return myIncentives.value.filter((item) => {
    const matchSearch =
      !searchQuery.value ||
      item.code?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.employee?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = !selectedStatus.value || item.status === selectedStatus.value
    return matchSearch && matchStatus
  })
})

const handleAdd = () => {
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (item: MyIncentive) => {
  editData.value = item
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus data insentif ini?')) {
    try {
      await deleteMyIncentive(id)
    } catch (err) {
      console.error('Failed to delete incentive:', err)
    }
  }
}

const handleSave = async (formData: MyIncentiveFormData) => {
  try {
    await saveMyIncentive(formData)
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save incentive:', err)
  }
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">My Incentives / Insentif Pribadi</h4>
          <h6 class="text-muted mb-0">Rincian perolehan insentif penyelesaian order kerja karyawan</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
            <FeatherIcon name="rotate-cw" size="16" />
          </button>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="handleAdd">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add Incentive Record</span>
          </button>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-3 mb-4">
        <div class="card-body p-4">
          <div class="row g-3 justify-content-between align-items-center mb-4">
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <FeatherIcon name="search" size="14" />
                </span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control border-start-0 ps-0"
                  placeholder="Cari kode insentif atau nama..."
                />
              </div>
            </div>
            <div class="col-md-4 d-flex justify-content-md-end">
              <select v-model="selectedStatus" class="form-select form-select-sm" style="width: auto">
                <option value="">Semua Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div v-if="pending" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <PagesMyIncentiveTable
            v-else
            :items="filteredList"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <PagesMyIncentiveModal
      :is-open="isModalOpen"
      :edit-data="editData"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>
