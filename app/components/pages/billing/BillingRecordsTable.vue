<script setup lang="ts">
import type { BillingItem } from '#server/types/billing'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formatIDR } from '~/utils/currency'
import { tableFilterControlClass } from '~/utils/salesUi'

const props = defineProps<{
  billings: BillingItem[]
  searchQuery: string
  filterMethod: string
  filterStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:filterMethod', value: string): void
  (e: 'update:filterStatus', value: string): void
  (e: 'view', item: BillingItem): void
}>()

const filteredBillings = computed(() => {
  return props.billings.filter((item) => {
    const q = props.searchQuery.toLowerCase()
    const matchSearch =
      !q ||
      item.billingId.toLowerCase().includes(q) ||
      item.txId.toLowerCase().includes(q) ||
      item.userEmail.toLowerCase().includes(q)
    const matchMethod = !props.filterMethod || item.method === props.filterMethod
    const matchStatus = !props.filterStatus || item.status === props.filterStatus
    return matchSearch && matchMethod && matchStatus
  })
})
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <!-- Filter Toolbar -->
    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative w-full max-w-sm">
        <FeatherIcon name="search" size="14" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          :value="searchQuery"
          type="text"
          placeholder="Cari billing ID, transaksi, email..."
          class="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <select
          :value="filterMethod"
          :class="tableFilterControlClass"
          @change="emit('update:filterMethod', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Semua Metode</option>
          <option value="Kartu Kredit">Kartu Kredit</option>
          <option value="Transfer Bank">Transfer Bank</option>
          <option value="E-Wallet">E-Wallet</option>
          <option value="Virtual Account">Virtual Account</option>
        </select>
        <select
          :value="filterStatus"
          :class="tableFilterControlClass"
          @change="emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Semua Status</option>
          <option value="Berhasil">Berhasil</option>
          <option value="Gagal">Gagal</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-start text-sm">
        <thead class="bg-gray-50 text-xs font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
          <tr>
            <th class="px-3 py-2.5 text-start">ID Billing</th>
            <th class="px-3 py-2.5 text-start">ID Transaksi</th>
            <th class="px-3 py-2.5 text-start">ID Pengguna</th>
            <th class="px-3 py-2.5 text-start">Tanggal</th>
            <th class="px-3 py-2.5 text-end">Jumlah Tagihan</th>
            <th class="px-3 py-2.5 text-end">Diskon</th>
            <th class="px-3 py-2.5 text-end">Pajak</th>
            <th class="px-3 py-2.5 text-end">Biaya Kirim</th>
            <th class="px-3 py-2.5 text-end">Total Pembayaran</th>
            <th class="px-3 py-2.5 text-center">Status</th>
            <th class="px-3 py-2.5 text-center">Metode</th>
            <th class="px-3 py-2.5 text-end">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="item in filteredBillings" :key="item.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
            <td class="px-3 py-3 font-semibold text-primary-600 dark:text-primary-400">{{ item.billingId }}</td>
            <td class="px-3 py-3 font-medium text-gray-900 dark:text-white">{{ item.txId }}</td>
            <td class="px-3 py-3 text-xs text-gray-500">{{ item.userEmail }}</td>
            <td class="px-3 py-3 text-gray-500">{{ item.date }}</td>
            <td class="px-3 py-3 text-end tabular-nums text-gray-800 dark:text-gray-200">{{ formatIDR(item.subtotal) }}</td>
            <td class="px-3 py-3 text-end tabular-nums text-rose-600">{{ item.discount > 0 ? `-${formatIDR(item.discount)}` : '0' }}</td>
            <td class="px-3 py-3 text-end tabular-nums text-gray-800 dark:text-gray-200">{{ formatIDR(item.tax) }}</td>
            <td class="px-3 py-3 text-end tabular-nums text-gray-800 dark:text-gray-200">{{ formatIDR(item.shipping) }}</td>
            <td class="px-3 py-3 text-end tabular-nums font-bold text-emerald-600 dark:text-emerald-400">{{ formatIDR(item.total) }}</td>
            <td class="px-3 py-3 text-center">
              <span
                :class="[
                  'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold',
                  item.status === 'Berhasil'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                ]"
              >
                {{ item.status }}
              </span>
            </td>
            <td class="px-3 py-3 text-center">
              <span class="inline-block rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {{ item.method }}
              </span>
            </td>
            <td class="px-3 py-3 text-end">
              <button
                type="button"
                class="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-gray-800"
                title="Lihat Rincian"
                @click="emit('view', item)"
              >
                <FeatherIcon name="eye" size="15" />
              </button>
            </td>
          </tr>
          <tr v-if="filteredBillings.length === 0">
            <td colspan="12" class="py-8 text-center text-sm text-gray-400">Tidak ada catatan tagihan ditemukan.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

