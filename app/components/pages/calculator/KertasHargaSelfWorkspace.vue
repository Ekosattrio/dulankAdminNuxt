<script setup lang="ts">
import type { PaperPrice, PaperPriceFormData } from '~/types/paper-price'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import PagesPaperPriceModal from '~/components/kertas-harga/PaperPriceModal.vue'
import PagesPaperPriceTable from '~/components/kertas-harga/PaperPriceTable.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Paper Prices - Master Harga Kertas',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { paperPrices, pending, refresh, savePaperPrice, deletePaperPrice } = usePaperPrices()

const searchQuery = ref('')
const filterType = ref('')

const isModalOpen = ref(false)
const editData = ref<PaperPrice | null>(null)

const paperTypes = computed(() => {
  const set = new Set<string>()
  paperPrices.value.forEach((p) => {
    if (p.paperType) set.add(p.paperType)
  })
  return Array.from(set)
})

const filteredList = computed(() => {
  return paperPrices.value.filter((p) => {
    const matchesSearch =
      !searchQuery.value ||
      p.paperType?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.supplier?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !filterType.value || p.paperType === filterType.value
    return matchesSearch && matchesType
  })
})

const handleAdd = () => {
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (p: PaperPrice) => {
  editData.value = p
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus data harga kertas ini?')) {
    try {
      await deletePaperPrice(id)
    } catch (err) {
      console.error('Failed to delete paper price:', err)
    }
  }
}

const handleSave = async (formData: PaperPriceFormData) => {
  try {
    await savePaperPrice(formData)
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save paper price:', err)
  }
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Paper Prices / Harga Kertas</h4>
          <h6 class="text-muted mb-0">Master daftar harga beli kertas plano dan supplier per rim / kg</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
            <FeatherIcon name="rotate-cw" size="16" />
          </button>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="handleAdd">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add Paper Price</span>
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
                  placeholder="Cari jenis kertas atau supplier..."
                />
              </div>
            </div>
            <div class="col-md-4 d-flex justify-content-md-end">
              <select v-model="filterType" class="form-select form-select-sm" style="width: auto">
                <option value="">Semua Jenis Kertas</option>
                <option v-for="t in paperTypes" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>

          <div v-if="pending" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <PagesPaperPriceTable
            v-else
            :prices="filteredList"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <PagesPaperPriceModal
      :is-open="isModalOpen"
      :edit-data="editData"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>
