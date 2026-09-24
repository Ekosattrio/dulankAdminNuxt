<script setup lang="ts">
import type { PaperSize, PaperSizeFormData } from '~/types/paper-size'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Paper Sizes - Ukuran Standar Kertas',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { paperSizes, pending, refresh, savePaperSize, deletePaperSize } = usePaperSizes()

const searchQuery = ref('')

const isModalOpen = ref(false)
const editData = ref<PaperSize | null>(null)

const filteredList = computed(() => {
  return paperSizes.value.filter((s) => {
    return (
      !searchQuery.value ||
      s.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

const handleAdd = () => {
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (s: PaperSize) => {
  editData.value = s
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus data ukuran kertas ini?')) {
    try {
      await deletePaperSize(id)
    } catch (err) {
      console.error('Failed to delete paper size:', err)
    }
  }
}

const handleSave = async (formData: PaperSizeFormData) => {
  try {
    await savePaperSize(formData)
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save paper size:', err)
  }
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Paper Sizes / Ukuran Kertas</h4>
          <h6 class="text-muted mb-0">Master dimensi dan ukuran plano / potong standar (A3, A4, F4, Plano 65x100 dll)</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
            <FeatherIcon name="rotate-cw" size="16" />
          </button>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="handleAdd">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add Paper Size</span>
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
                  placeholder="Cari nama ukuran atau kategori..."
                />
              </div>
            </div>
          </div>

          <div v-if="pending" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <PagesPaperSizeTable
            v-else
            :sizes="filteredList"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <PagesPaperSizeModal
      :is-open="isModalOpen"
      :edit-data="editData"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>
