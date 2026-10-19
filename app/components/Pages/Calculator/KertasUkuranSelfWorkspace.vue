<script setup lang="ts">
import type { PaperSize, PaperSizeFormData } from '~/types/paper-size'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import PagesPaperSizeModal from '~/components/KertasUkuran/PaperSizeModal.vue'
import PagesPaperSizeTable from '~/components/KertasUkuran/PaperSizeTable.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'

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
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

const filteredList = computed(() => {
  return paperSizes.value.filter((s) => {
    return (
      !searchQuery.value ||
      s.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.dimension?.toLowerCase().includes(searchQuery.value.toLowerCase())
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

const handleDelete = (id: string) => {
  deleteTargetId.value = id
}

const confirmDelete = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deletePaperSize(deleteTargetId.value)
    deleteTargetId.value = null
  } catch (err) {
    console.error('Failed to delete paper size:', err)
  } finally {
    isDeleting.value = false
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
  <div class="space-y-6">
    <SalesListHeader
      title="Paper Sizes / Ukuran Kertas"
      subtitle="Master dimensi dan ukuran plano / potong standar (A3, A4, F4, Plano 65x100 dll)"
      add-label="Add Paper Size"
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
            placeholder="Cari nama ukuran atau kategori..."
          />
        </div>
      </div>

      <div v-if="pending" class="py-12 text-center text-sm text-gray-500">
        <div class="spinner-border text-primary inline-block h-8 w-8 animate-spin rounded-full border-4" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>

      <PagesPaperSizeTable
        v-else
        :sizes="filteredList"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <PagesPaperSizeModal
      :is-open="isModalOpen"
      :edit-data="editData"
      @close="isModalOpen = false"
      @save="handleSave"
    />
    <SalesConfirmDelete
      :open="!!deleteTargetId"
      title="Hapus Ukuran Kertas"
      message="Apakah Anda yakin ingin menghapus data ukuran kertas ini?"
      :busy="isDeleting"
      @close="deleteTargetId = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
