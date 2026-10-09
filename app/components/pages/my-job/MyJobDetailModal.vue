<script setup lang="ts">
import type { MyJob } from '#server/types/my-job'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

interface Props {
  isOpen: boolean
  job: MyJob | null
}

const props = defineProps<Props>()

import { printJobDetailTicket } from '~/utils/salesDocuments'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'print', job: MyJob): void
}>()

const handleClose = () => {
  emit('close')
}

const handlePrint = () => {
  if (props.job) {
    printJobDetailTicket(props.job)
    emit('print', props.job)
  }
}
</script>

<template>
  <SalesDialog
    :open="isOpen"
    title="View Job Detail"
    size="md"
    @close="handleClose"
  >
    <div v-if="job" class="space-y-4 text-xs text-gray-700 dark:text-gray-300">
      <!-- Section: Order Information -->
      <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-750">
        <h6 class="font-bold text-sm text-gray-900 dark:text-white">Order Information</h6>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="w-8 h-8 rounded border border-red-200 dark:border-red-900/40 text-red-600 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Download PDF"
            @click="handlePrint"
          >
            <FeatherIcon name="file-text" size="14" />
          </button>
          <button
            type="button"
            class="w-8 h-8 rounded border border-blue-200 dark:border-blue-900/40 text-blue-600 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
            title="Print"
            @click="handlePrint"
          >
            <FeatherIcon name="printer" size="14" />
          </button>
        </div>
      </div>

      <!-- Key-Value Info Grid -->
      <div class="space-y-2 bg-gray-50/70 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-750">
        <div class="grid grid-cols-12 gap-2">
          <span class="col-span-4 text-gray-500 dark:text-gray-400">Sales Date</span>
          <span class="col-span-8 font-medium text-gray-900 dark:text-white">{{ job.salesDate || job.dueDate || '-' }}</span>
        </div>
        <div class="grid grid-cols-12 gap-2">
          <span class="col-span-4 text-gray-500 dark:text-gray-400">No Sales</span>
          <span class="col-span-8 font-medium text-gray-900 dark:text-white">{{ job.noSales || `SO-${job.id}` }}</span>
        </div>
        <div class="grid grid-cols-12 gap-2">
          <span class="col-span-4 text-gray-500 dark:text-gray-400">Customer</span>
          <span class="col-span-8 font-medium text-gray-900 dark:text-white">{{ job.customer || 'Customer Umum' }}</span>
        </div>
        <div class="grid grid-cols-12 gap-2">
          <span class="col-span-4 text-gray-500 dark:text-gray-400">Order Summary</span>
          <span class="col-span-8 font-medium text-gray-900 dark:text-white">{{ job.orderSummary || '1 of 1 Products' }}</span>
        </div>
        <div class="grid grid-cols-12 gap-2">
          <span class="col-span-4 text-gray-500 dark:text-gray-400">Product</span>
          <span class="col-span-8 font-semibold text-gray-900 dark:text-white">{{ job.product }}</span>
        </div>
        <div class="grid grid-cols-12 gap-2">
          <span class="col-span-4 text-gray-500 dark:text-gray-400">Job Title</span>
          <span class="col-span-8 font-medium text-gray-900 dark:text-white">{{ job.title }}</span>
        </div>
        <div class="grid grid-cols-12 gap-2">
          <span class="col-span-4 text-gray-500 dark:text-gray-400">Description</span>
          <span class="col-span-8 font-normal text-gray-800 dark:text-gray-200 leading-relaxed">{{ job.description }}</span>
        </div>
      </div>

      <!-- Section: Job Detail -->
      <div class="pt-2">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Job Detail</p>
        <h6 class="font-bold text-sm text-gray-900 dark:text-white">{{ job.flowName }}</h6>
      </div>

      <!-- Table: Technical Specifications -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table class="w-full text-xs divide-y divide-gray-200 dark:divide-gray-700">
          <tbody class="divide-y divide-gray-100 dark:divide-gray-750">
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="w-1/2 px-3 py-1.5 text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">Kertas</td>
              <td class="w-1/2 px-3 py-1.5 font-medium text-gray-800 dark:text-gray-200">{{ job.kertas || 'Ap150 Gr' }}</td>
            </tr>
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="px-3 py-1.5 text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">Sisi Cetak</td>
              <td class="px-3 py-1.5 font-medium text-gray-800 dark:text-gray-200">{{ job.sisiCetak || '2 Sisi' }}</td>
            </tr>
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="px-3 py-1.5 text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">Panjang Kertas</td>
              <td class="px-3 py-1.5 font-medium text-gray-800 dark:text-gray-200">{{ job.panjangKertas || '32.5 cm' }}</td>
            </tr>
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="px-3 py-1.5 text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">Lebar Kertas</td>
              <td class="px-3 py-1.5 font-medium text-gray-800 dark:text-gray-200">{{ job.lebarKertas || '45 cm' }}</td>
            </tr>
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="px-3 py-1.5 text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">Kater/Model</td>
              <td class="px-3 py-1.5 font-medium text-gray-800 dark:text-gray-200">{{ job.katerModel || '1 kater' }}</td>
            </tr>
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="px-3 py-1.5 text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">Jumlah Plat</td>
              <td class="px-3 py-1.5 font-medium text-gray-800 dark:text-gray-200">{{ job.jumlahPlat || '4 pcs' }}</td>
            </tr>
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="px-3 py-1.5 text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">Jumlah Bahan</td>
              <td class="px-3 py-1.5 font-medium text-gray-800 dark:text-gray-200">{{ job.jumlahBahan || '5100' }}</td>
            </tr>
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="px-3 py-1.5 text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">Jumlah Insit</td>
              <td class="px-3 py-1.5 font-medium text-gray-800 dark:text-gray-200">{{ job.jumlahInsit || '100' }}</td>
            </tr>
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="px-3 py-1.5 text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">Jumlah Butuh</td>
              <td class="px-3 py-1.5 font-medium text-gray-800 dark:text-gray-200">{{ job.jumlahButuh || '5000' }}</td>
            </tr>
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="px-3 py-1.5 text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">Ada Contoh</td>
              <td class="px-3 py-1.5 font-medium text-gray-800 dark:text-gray-200">{{ job.adaContoh || 'Tidak' }}</td>
            </tr>
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="px-3 py-1.5 text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">Acc Warna</td>
              <td class="px-3 py-1.5 font-medium text-gray-800 dark:text-gray-200">{{ job.accWarna || 'Tidak' }}</td>
            </tr>
            <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="px-3 py-1.5 text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">Keterangan</td>
              <td class="px-3 py-1.5 font-medium text-gray-800 dark:text-gray-200">{{ job.keterangan || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          class="h-9 px-4 rounded-lg bg-[#212b36] hover:bg-gray-800 text-white text-xs font-medium transition-colors"
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          type="button"
          class="h-9 px-4 rounded-lg bg-[#ff9f43] hover:bg-[#e08933] text-white text-xs font-medium transition-colors"
          @click="handleClose"
        >
          Submit
        </button>
      </div>
    </template>
  </SalesDialog>
</template>
