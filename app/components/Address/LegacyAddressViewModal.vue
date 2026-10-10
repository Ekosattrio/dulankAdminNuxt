<script setup lang="ts">
import type { CustomerAddress, SupplierAddress } from '#server/types/address'
import BaseModal from '~/components/Modal/BaseModal.vue'

const props = defineProps<{
  isOpen: boolean
  customerData?: CustomerAddress | null
  supplierData?: SupplierAddress | null
}>()
const emit = defineEmits<{ close: [] }>()
const address = computed(() => props.customerData ?? props.supplierData)
const labels: Record<string, string> = {
  id: 'ID Address', customerId: 'ID Customer', name: 'Name', contact: 'Contact',
  province: 'Province', city: 'City', district: 'District', detailAddress: 'Detail Address',
  otherDetail: 'Other Detail', status: 'Status', date: 'Date', userId: 'ID Pengguna',
  user: 'User', phone: 'Nomor Telepon', fullAddress: 'Alamat Lengkap',
  postalCode: 'Kode Pos', channel: 'Channel', dateAdded: 'Tanggal Ditambahkan',
}
</script>

<template>
  <BaseModal :model-value="isOpen" :title="customerData ? 'View Customer Address' : 'View Supplier Address'" max-width="2xl" @close="emit('close')">
    <dl v-if="address" class="grid gap-4 sm:grid-cols-2">
      <div v-for="(value, key) in address" :key="key">
        <dt class="text-sm text-gray-500">{{ labels[key] ?? key }}</dt>
        <dd class="mt-1 break-words font-medium">{{ value || '—' }}</dd>
      </div>
    </dl>
    <template #footer><button type="button" class="rounded-md bg-secondary px-4 py-2 text-white" @click="emit('close')">Close</button></template>
  </BaseModal>
</template>
