<script setup lang="ts">
import type { PaperPrice, PaperPriceFormData } from '~/types/paper-price'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import PagesPaperPriceModal from '~/components/KertasHarga/PaperPriceModal.vue'
import PagesPaperPriceTable from '~/components/KertasHarga/PaperPriceTable.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'

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
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

const paperTypes = computed(() => {
  const set = new Set<string>()
  paperPrices.value.forEach((p) => {
    if (p.group) set.add(p.group)
  })
  return Array.from(set)
})

const filteredList = computed(() => {
  return paperPrices.value.filter((p) => {
    const matchesSearch =
      !searchQuery.value ||
      p.group?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.merk?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !filterType.value || p.group === filterType.value
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

const handleDelete = (id: string) => {
  deleteTargetId.value = id
}

const confirmDelete = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deletePaperPrice(deleteTargetId.value)
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete paper price:', err)
  } finally {
    isDeleting.value = false
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
  <div class="space-y-6">
    <SalesListHeader
      title="Paper Prices / Harga Kertas"
      subtitle="Master daftar harga beli kertas plano dan supplier per rim / kg"
      add-label="Add Paper Price"
      :refreshing="pending"
      @add="handleAdd"
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
            placeholder="Cari jenis kertas atau supplier..."
          />
        </div>
        <div>
          <select
            v-model="filterType"
            class="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">Semua Jenis Kertas</option>
            <option v-for="t in paperTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>

      <div v-if="pending" class="py-12 text-center text-sm text-gray-500">
        <div class="spinner-border text-primary inline-block h-8 w-8 animate-spin rounded-full border-4" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <PagesPaperPriceTable
        v-else
        :prices="filteredList"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <PagesPaperPriceModal
      :is-open="isModalOpen"
      :edit-data="editData"
      @close="isModalOpen = false"
      @save="handleSave"
    />
    <SalesConfirmDelete
      :open="!!deleteTargetId"
      title="Hapus Harga Kertas"
      message="Apakah Anda yakin ingin menghapus data harga kertas ini?"
      :busy="isDeleting"
      @close="deleteTargetId = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
