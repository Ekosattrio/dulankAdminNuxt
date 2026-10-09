<script setup lang="ts">
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { formatIDR } from '~/utils/currency'

export interface CalculationDetailData {
  id: string
  productName: string
  size: string
  paperType: string
  laminate: string
  printSide: string
  foldOrBinding: string
  qtyOrder: number
  channel: string
  // System Suggestion
  parentSheet?: string
  parentSheetQty?: number
  cutDownSize?: string
  cutDownQty?: number
  machineName?: string
  // Costs
  paperCost?: number
  plateCost?: number
  printCost?: number
  laminateCost?: number
  finishingCost?: number
  totalCost: number
  sellingPrice: number
}

const props = defineProps<{
  open: boolean
  data?: CalculationDetailData | null
}>()

defineEmits<{
  close: []
}>()

const activeTab = ref<'spec' | 'cost'>('spec')
const openPaperCost = ref(true)
const openPlateCost = ref(true)
const openPrintCost = ref(true)
const openFinishingCost = ref(true)

watch(() => props.open, (val) => {
  if (val) activeTab.value = 'spec'
})

const profitAmount = computed(() => {
  if (!props.data) return 0
  return Math.max(0, props.data.sellingPrice - props.data.totalCost)
})

const profitPercent = computed(() => {
  if (!props.data || props.data.sellingPrice <= 0) return 0
  return Math.round((profitAmount.value / props.data.sellingPrice) * 100)
})
</script>

<template>
  <SalesDialog
    :open="open"
    title="Calculation Detail"
    large
    @close="$emit('close')"
  >
    <div v-if="data" class="space-y-6">
      <!-- Top Sub Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          :class="['flex-1 py-2.5 text-center text-sm font-bold border-b-2 transition', activeTab === 'spec' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400']"
          @click="activeTab = 'spec'"
        >
          Order Spesification
        </button>
        <button
          type="button"
          :class="['flex-1 py-2.5 text-center text-sm font-bold border-b-2 transition', activeTab === 'cost' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400']"
          @click="activeTab = 'cost'"
        >
          Detail Cost
        </button>
      </div>

      <!-- Tab 1: Order Spesification -->
      <div v-if="activeTab === 'spec'" class="space-y-6">
        <div>
          <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-3">Order Spesification</h4>
          <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table class="w-full text-xs text-left">
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr class="bg-gray-50/50 dark:bg-gray-800/40">
                  <td class="w-1/2 px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Product Name</td>
                  <td class="w-1/2 px-4 py-2.5 font-bold text-gray-900 dark:text-white">{{ data.productName }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Size</td>
                  <td class="px-4 py-2.5 text-gray-800 dark:text-gray-200">{{ data.size }}</td>
                </tr>
                <tr class="bg-gray-50/50 dark:bg-gray-800/40">
                  <td class="px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Paper Type</td>
                  <td class="px-4 py-2.5 text-gray-800 dark:text-gray-200">{{ data.paperType }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Laminate</td>
                  <td class="px-4 py-2.5 text-gray-800 dark:text-gray-200">{{ data.laminate }}</td>
                </tr>
                <tr class="bg-gray-50/50 dark:bg-gray-800/40">
                  <td class="px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Print Side</td>
                  <td class="px-4 py-2.5 text-gray-800 dark:text-gray-200">{{ data.printSide }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Fold / Binding</td>
                  <td class="px-4 py-2.5 text-gray-800 dark:text-gray-200">{{ data.foldOrBinding }}</td>
                </tr>
                <tr class="bg-gray-50/50 dark:bg-gray-800/40">
                  <td class="px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Qty Order</td>
                  <td class="px-4 py-2.5 font-bold text-primary">{{ data.qtyOrder.toLocaleString('id-ID') }} Pcs</td>
                </tr>
                <tr>
                  <td class="px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Channel</td>
                  <td class="px-4 py-2.5 text-gray-800 dark:text-gray-200">{{ data.channel }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-3">Calculation System Suggestion</h4>
          <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table class="w-full text-xs text-left">
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr class="bg-gray-50/50 dark:bg-gray-800/40">
                  <td class="w-1/2 px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Parent Sheet</td>
                  <td class="w-1/2 px-4 py-2.5 text-gray-800 dark:text-gray-200">{{ data.parentSheet || '65 x 100 cm' }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Parent Sheet Qty</td>
                  <td class="px-4 py-2.5 text-gray-800 dark:text-gray-200">{{ (data.parentSheetQty || 480).toLocaleString('id-ID') }} Plano</td>
                </tr>
                <tr class="bg-gray-50/50 dark:bg-gray-800/40">
                  <td class="px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Cut Down Size</td>
                  <td class="px-4 py-2.5 text-gray-800 dark:text-gray-200">{{ data.cutDownSize || '32.5 x 50 cm' }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Cut Down Qty</td>
                  <td class="px-4 py-2.5 text-gray-800 dark:text-gray-200">{{ (data.cutDownQty || 1920).toLocaleString('id-ID') }} Lembar</td>
                </tr>
                <tr class="bg-gray-50/50 dark:bg-gray-800/40">
                  <td class="px-4 py-2.5 font-semibold text-gray-600 dark:text-gray-400">Printing Machine</td>
                  <td class="px-4 py-2.5 font-bold text-gray-900 dark:text-white">{{ data.machineName || 'Heidelberg SM52' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab 2: Detail Cost -->
      <div v-if="activeTab === 'cost'" class="space-y-4">
        <!-- Paper Cost -->
        <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <button
            type="button"
            class="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-gray-900 dark:text-white"
            @click="openPaperCost = !openPaperCost"
          >
            <span>Paper Cost</span>
            <div class="flex items-center gap-2">
              <span class="font-bold text-emerald-600">{{ formatIDR(data.paperCost || Math.round(data.totalCost * 0.45)) }}</span>
              <span class="text-gray-400">{{ openPaperCost ? '▲' : '▼' }}</span>
            </div>
          </button>
          <div v-if="openPaperCost" class="border-t border-gray-100 p-3.5 text-xs dark:border-gray-800">
            <div class="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
              <div>Bahan: {{ data.paperType }}</div>
              <div>Ukuran Plano: {{ data.parentSheet || '65 x 100 cm' }}</div>
              <div>Kebutuhan: {{ (data.parentSheetQty || 480).toLocaleString('id-ID') }} Plano</div>
              <div class="font-semibold text-gray-900 dark:text-white">Subtotal: {{ formatIDR(data.paperCost || Math.round(data.totalCost * 0.45)) }}</div>
            </div>
          </div>
        </div>

        <!-- Plate Cost -->
        <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <button
            type="button"
            class="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-gray-900 dark:text-white"
            @click="openPlateCost = !openPlateCost"
          >
            <span>Plate Cost</span>
            <div class="flex items-center gap-2">
              <span class="font-bold text-emerald-600">{{ formatIDR(data.plateCost || Math.round(data.totalCost * 0.12)) }}</span>
              <span class="text-gray-400">{{ openPlateCost ? '▲' : '▼' }}</span>
            </div>
          </button>
          <div v-if="openPlateCost" class="border-t border-gray-100 p-3.5 text-xs dark:border-gray-800">
            <div class="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
              <div>Mesin: {{ data.machineName || 'Heidelberg SM52' }}</div>
              <div>Jumlah Plat: 4 Plat CTP</div>
              <div class="font-semibold text-gray-900 dark:text-white">Subtotal: {{ formatIDR(data.plateCost || Math.round(data.totalCost * 0.12)) }}</div>
            </div>
          </div>
        </div>

        <!-- Printing Cost -->
        <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <button
            type="button"
            class="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-gray-900 dark:text-white"
            @click="openPrintCost = !openPrintCost"
          >
            <span>Printing Machine Cost</span>
            <div class="flex items-center gap-2">
              <span class="font-bold text-emerald-600">{{ formatIDR(data.printCost || Math.round(data.totalCost * 0.25)) }}</span>
              <span class="text-gray-400">{{ openPrintCost ? '▲' : '▼' }}</span>
            </div>
          </button>
          <div v-if="openPrintCost" class="border-t border-gray-100 p-3.5 text-xs dark:border-gray-800">
            <div class="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
              <div>Min Charge + Extra Druck</div>
              <div>Jumlah Impress: {{ (data.cutDownQty || 1920).toLocaleString('id-ID') }}</div>
              <div class="font-semibold text-gray-900 dark:text-white">Subtotal: {{ formatIDR(data.printCost || Math.round(data.totalCost * 0.25)) }}</div>
            </div>
          </div>
        </div>

        <!-- Finishing Cost -->
        <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <button
            type="button"
            class="flex w-full items-center justify-between p-3.5 text-left text-xs font-bold text-gray-900 dark:text-white"
            @click="openFinishingCost = !openFinishingCost"
          >
            <span>Finishing & Laminating Cost</span>
            <div class="flex items-center gap-2">
              <span class="font-bold text-emerald-600">{{ formatIDR(data.finishingCost || Math.round(data.totalCost * 0.18)) }}</span>
              <span class="text-gray-400">{{ openFinishingCost ? '▲' : '▼' }}</span>
            </div>
          </button>
          <div v-if="openFinishingCost" class="border-t border-gray-100 p-3.5 text-xs dark:border-gray-800">
            <div class="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
              <div>Laminasi: {{ data.laminate }}</div>
              <div>Finishing: {{ data.foldOrBinding }}</div>
              <div class="font-semibold text-gray-900 dark:text-white">Subtotal: {{ formatIDR(data.finishingCost || Math.round(data.totalCost * 0.18)) }}</div>
            </div>
          </div>
        </div>

        <!-- Total & Selling Price Summary -->
        <div class="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 dark:border-primary/40 dark:bg-primary/10">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-[11px] font-semibold text-gray-500">Total Biaya Produksi</div>
              <div class="mt-1 text-base font-bold text-gray-900 dark:text-white">{{ formatIDR(data.totalCost) }}</div>
            </div>
            <div>
              <div class="text-[11px] font-semibold text-gray-500">Harga Jual Customer</div>
              <div class="mt-1 text-base font-bold text-primary">{{ formatIDR(data.sellingPrice) }}</div>
            </div>
            <div>
              <div class="text-[11px] font-semibold text-gray-500">Estimasi Margin / Profit</div>
              <div class="mt-1 text-base font-bold text-emerald-600">{{ formatIDR(profitAmount) }} ({{ profitPercent }}%)</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
        <button
          type="button"
          class="h-9 rounded-md bg-gray-800 px-5 text-xs font-semibold text-white shadow hover:bg-gray-700"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </SalesDialog>
</template>

