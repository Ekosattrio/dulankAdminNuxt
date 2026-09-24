<script setup lang="ts">
import type { PrintingMachine, PrintingMachineFormData } from '~/types/printing-machine'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Printing Machines - Mesin Cetak',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { printingMachines, pending, refresh, savePrintingMachine, deletePrintingMachine } = usePrintingMachines()

const searchQuery = ref('')

const isModalOpen = ref(false)
const editData = ref<PrintingMachine | null>(null)

const filteredList = computed(() => {
  return printingMachines.value.filter((m) => {
    return (
      !searchQuery.value ||
      m.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      m.type?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

const handleAdd = () => {
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (m: PrintingMachine) => {
  editData.value = m
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus data mesin cetak ini?')) {
    try {
      await deletePrintingMachine(id)
    } catch (err) {
      console.error('Failed to delete machine:', err)
    }
  }
}

const handleSave = async (formData: PrintingMachineFormData) => {
  try {
    await savePrintingMachine(formData)
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save machine:', err)
  }
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Printing Machines / Mesin Cetak</h4>
          <h6 class="text-muted mb-0">Master mesin offset, digital press, dan kapasitas area cetak</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
            <FeatherIcon name="rotate-cw" size="16" />
          </button>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="handleAdd">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add Machine</span>
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
                  placeholder="Cari mesin cetak atau tipe..."
                />
              </div>
            </div>
          </div>

          <div v-if="pending" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <PagesPrintingMachineTable
            v-else
            :machines="filteredList"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <PagesPrintingMachineModal
      :is-open="isModalOpen"
      :edit-data="editData"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>
