<script setup lang="ts">
import type { CalculationDetailData } from './CalculationDetailModal.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import CalculationDetailModal from './CalculationDetailModal.vue'

export interface LogTransactionRecord {
  id: string
  date: string
  client?: string
  customer?: string
  desc?: string
  product?: string
  qty: number
  productionCost?: number
  totalCost?: number
  sellingPrice: number
  status: string
  // Additional specs
  size?: string
  paperType?: string
  laminate?: string
  printSide?: string
  foldOrBinding?: string
  channel?: string
  parentSheet?: string
  parentSheetQty?: number
  cutDownSize?: string
  cutDownQty?: number
  machineName?: string
  paperCost?: number
  plateCost?: number
  printCost?: number
  laminateCost?: number
  finishingCost?: number
}

const props = defineProps<{
  logs: LogTransactionRecord[]
  title?: string
}>()

const activeDetail = ref<CalculationDetailData | null>(null)

const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'clientName', label: 'Client / Customer', sortable: true },
  { key: 'orderDetail', label: 'Order Detail' },
  { key: 'qty', label: 'Qty', align: 'end' as const, sortable: true },
  { key: 'cost', label: 'Detail Cost', align: 'end' as const, sortable: true },
  { key: 'sellingPrice', label: 'Selling Price', align: 'end' as const, sortable: true },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]

const rows = computed(() => props.logs.map(log => ({
  ...log,
  clientName: log.client || log.customer || 'Pelanggan Umum',
  orderDetail: log.desc || log.product || 'Custom Order',
  cost: log.productionCost ?? log.totalCost ?? 0,
  _record: log,
})))

function openDetail(record: LogTransactionRecord) {
  activeDetail.value = {
    id: record.id,
    productName: record.desc || record.product || 'Custom Product',
    size: record.size || 'A4 (297x210mm)',
    paperType: record.paperType || 'Art Paper 150gr',
    laminate: record.laminate || 'Glossy',
    printSide: record.printSide || 'Cetak 1 Sisi',
    foldOrBinding: record.foldOrBinding || '2 Lipatan / Spiral',
    qtyOrder: record.qty || 1000,
    channel: record.channel || 'Webstore',
    parentSheet: record.parentSheet || '65 x 100 cm',
    parentSheetQty: record.parentSheetQty || 480,
    cutDownSize: record.cutDownSize || '32.5 x 50 cm',
    cutDownQty: record.cutDownQty || 1920,
    machineName: record.machineName || 'Heidelberg SM52',
    paperCost: record.paperCost,
    plateCost: record.plateCost,
    printCost: record.printCost,
    laminateCost: record.laminateCost,
    finishingCost: record.finishingCost,
    totalCost: record.productionCost ?? record.totalCost ?? 0,
    sellingPrice: record.sellingPrice || 0,
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h4 class="text-base font-bold text-gray-900 dark:text-white">
        {{ title || 'Log Transaction' }}
      </h4>
      <p class="text-xs text-gray-500">{{ logs.length }} calculation logs recorded</p>
    </div>

    <SalesDataTable
      :columns="columns"
      :items="rows"
      search-placeholder="Search client, product, or status..."
    >
      <template #cell(date)="{ item }">
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ item.date }}</span>
      </template>
      <template #cell(clientName)="{ item }">
        <span class="font-semibold text-gray-900 dark:text-white">{{ item.clientName }}</span>
      </template>
      <template #cell(orderDetail)="{ item }">
        <span class="text-xs text-gray-700 dark:text-gray-300">{{ item.orderDetail }}</span>
      </template>
      <template #cell(qty)="{ item }">
        <span class="font-medium text-gray-800 dark:text-gray-200">{{ item.qty.toLocaleString('id-ID') }}</span>
      </template>
      <template #cell(cost)="{ item }">
        <CurrencyDisplay :value="item.cost" />
      </template>
      <template #cell(sellingPrice)="{ item }">
        <CurrencyDisplay :value="item.sellingPrice" class="font-bold text-primary" />
      </template>
      <template #cell(status)="{ item }">
        <span
          :class="[
            'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
            item.status === 'Completed' || item.status === 'Publish' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
          ]"
        >
          {{ item.status }}
        </span>
      </template>
      <template #cell(actions)="{ item }">
        <div class="flex justify-center">
          <SalesActionButton
            action="view"
            label="View Calculation Detail"
            @click="openDetail(item._record)"
          />
        </div>
      </template>
    </SalesDataTable>

    <CalculationDetailModal
      :open="!!activeDetail"
      :data="activeDetail"
      @close="activeDetail = null"
    />
  </div>
</template>

