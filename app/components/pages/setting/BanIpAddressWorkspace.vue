<script setup lang="ts">
import type { BanIpItem, BanIpInput } from '#server/types/ban-ip'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import BanIpTable from './ban-ip/BanIpTable.vue'
import BanIpModal from './ban-ip/BanIpModal.vue'

const { banList, pending, error, refresh, addIp, updateIp, deleteIp } = useBanIp()

const isModalOpen = ref(false)
const selectedItem = ref<BanIpItem | null>(null)
const isSaving = ref(false)

const isDeleteModalOpen = ref(false)
const deletingItem = ref<BanIpItem | null>(null)
const isDeleting = ref(false)

function openAddModal() {
  selectedItem.value = null
  isModalOpen.value = true
}

function handleEdit(item: BanIpItem) {
  selectedItem.value = item
  isModalOpen.value = true
}

function handleDelete(item: BanIpItem) {
  deletingItem.value = item
  isDeleteModalOpen.value = true
}

async function handleSave(payload: BanIpInput) {
  isSaving.value = true
  try {
    if (selectedItem.value) {
      await updateIp(selectedItem.value.id, payload)
    } else {
      await addIp(payload)
    }
    isModalOpen.value = false
    selectedItem.value = null
  } catch (err) {
    console.error('Failed to save banned IP:', err)
  } finally {
    isSaving.value = false
  }
}

async function confirmDelete() {
  if (!deletingItem.value) return
  isDeleting.value = true
  try {
    await deleteIp(deletingItem.value.id)
    isDeleteModalOpen.value = false
    deletingItem.value = null
  } catch (err) {
    console.error('Failed to remove banned IP:', err)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Ban IP Address"
      subtitle="Kelola daftar alamat IP yang diblokir untuk mencegah penyalahgunaan sistem"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <SalesFeedback
      v-if="pending && !banList.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat data banned IP'"
      @retry="refresh"
    />

    <BanIpTable
      v-else
      :items="banList"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <BanIpModal
      :open="isModalOpen"
      :item="selectedItem"
      :busy="isSaving"
      @close="isModalOpen = false"
      @submit="handleSave"
    />

    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Pemblokiran IP"
      message="Apakah Anda yakin ingin menghapus alamat IP ini dari daftar blokir? Akses akan kembali diizinkan."
      :busy="isDeleting"
      @cancel="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
