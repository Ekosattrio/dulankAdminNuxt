<script setup lang="ts">
import type { TaxRateItem, TaxRateInput } from '#server/types/tax-rates'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import TaxRatesTable from './Tax/TaxRatesTable.vue'
import TaxRatesModal from './Tax/TaxRatesModal.vue'

const { taxes, pending, error, refresh, addTax, updateTax, deleteTax } = useTaxRates()

const isModalOpen = ref(false)
const selectedTax = ref<TaxRateItem | null>(null)
const isSaving = ref(false)

const isDeleteModalOpen = ref(false)
const deletingTax = ref<TaxRateItem | null>(null)
const isDeleting = ref(false)

function openAddModal() {
  selectedTax.value = null
  isModalOpen.value = true
}

function handleEdit(item: TaxRateItem) {
  selectedTax.value = item
  isModalOpen.value = true
}

function handleDelete(item: TaxRateItem) {
  deletingTax.value = item
  isDeleteModalOpen.value = true
}

async function handleSave(payload: TaxRateInput) {
  isSaving.value = true
  try {
    if (selectedTax.value) {
      await updateTax(selectedTax.value.id, payload)
    } else {
      await addTax(payload)
    }
    isModalOpen.value = false
    selectedTax.value = null
  } catch (err) {
    console.error('Failed to save tax rate:', err)
  } finally {
    isSaving.value = false
  }
}

async function confirmDelete() {
  if (!deletingTax.value) return
  isDeleting.value = true
  try {
    await deleteTax(deletingTax.value.id)
    isDeleteModalOpen.value = false
    deletingTax.value = null
  } catch (err) {
    console.error('Failed to delete tax rate:', err)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Tax Rates"
      subtitle="Kelola master tarif pajak penjualan, PPN faktur, dan pajak masukan"
      :refreshing="pending"
      @refresh="refresh"
      @add="openAddModal"
    />

    <SalesFeedback
      v-if="pending && !taxes.length"
      loading
    />
    <SalesFeedback
      v-else-if="error"
      :error="error.message || 'Gagal memuat data tarif pajak'"
      @retry="refresh"
    />

    <TaxRatesTable
      v-else
      :taxes="taxes"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <TaxRatesModal
      :open="isModalOpen"
      :tax="selectedTax"
      :busy="isSaving"
      @close="isModalOpen = false"
      @submit="handleSave"
    />

    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Tarif Pajak"
      message="Apakah Anda yakin ingin menghapus data tarif pajak ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
