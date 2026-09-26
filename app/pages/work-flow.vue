<script setup lang="ts">
import type { WorkFlow, WorkFlowFormData } from '~/types/work-flow'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Work Flows - Alur Kerja Produksi',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { workFlows, pending, refresh, saveWorkFlow, deleteWorkFlow } = useWorkFlows()
const { categories } = useCategories()

const searchQuery = ref('')
const selectedCategory = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<WorkFlow | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const categoryNames = computed(() => categories.value.map((c) => c.name))

const filteredList = computed(() => {
  return workFlows.value.filter((w) => {
    const matchesSearch =
      !searchQuery.value ||
      w.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      w.category?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCat = !selectedCategory.value || w.category === selectedCategory.value
    return matchesSearch && matchesCat
  })
})

const handleAdd = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (w: WorkFlow) => {
  isEdit.value = true
  editData.value = w
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus alur kerja produksi ini?')) {
    try {
      await deleteWorkFlow(id)
      showToast('Workflow deleted successfully')
    } catch (err) {
      console.error('Failed to delete workflow:', err)
      alert('Failed to delete workflow')
    }
  }
}

const handleSubmit = async (formData: WorkFlowFormData) => {
  try {
    const res = await saveWorkFlow(formData)
    showToast(res?.message || 'Workflow saved successfully')
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save workflow:', err)
    alert('Failed to save workflow')
  }
}

const printTable = () => {
  window.print()
}

const exportPdf = () => {
  showToast('Exporting Work Flows to PDF...')
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <div v-if="toastMessage" class="alert alert-success position-fixed top-0 end-0 m-4 shadow-lg z-3 d-flex align-items-center gap-2" role="alert">
        <FeatherIcon name="check-circle" size="18" />
        <div>{{ toastMessage }}</div>
      </div>

      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Work Flows / Alur Kerja Produksi</h4>
          <h6 class="text-muted mb-0">Kelola tahapan SOP proses cetak, laminasi, finishing hingga packing</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <ul class="table-top-head d-flex align-items-center list-unstyled gap-2 mb-0">
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Print" @click="printTable">
                <FeatherIcon name="printer" size="16" />
              </button>
            </li>
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
                <FeatherIcon name="rotate-cw" size="16" />
              </button>
            </li>
          </ul>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="handleAdd">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add Work Flow</span>
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <PagesWorkFlowTable
        v-else
        :workflows="filteredList"
        :categories="categoryNames"
        :search-query="searchQuery"
        :selected-category="selectedCategory"
        @update:search-query="searchQuery = $event"
        @update:selected-category="selectedCategory = $event"
        @add-workflow="handleAdd"
        @edit-workflow="handleEdit"
        @delete-workflow="handleDelete"
        @export-pdf="exportPdf"
        @print-table="printTable"
        @refresh="refresh"
      />
    </div>

    <PagesWorkFlowModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      :categories="categoryNames"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />
  </div>
</template>
