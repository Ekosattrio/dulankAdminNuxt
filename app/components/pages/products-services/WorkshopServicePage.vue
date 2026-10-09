<script setup lang="ts">
import type { WorkshopService, WorkshopServiceCategory, WorkshopServiceFormData } from '#server/types/workshop-service'
import CalculatorDetailDialog from '~/components/pages/calculator/CalculatorDetailDialog.vue'
import { useTablePrint } from '~/composables/useTablePrint'
import { useWorkshopServices } from '~/composables/useWorkshopServices'
import { formatIDR } from '~/utils/currency'
import { formatWorkshopDate, workshopServiceConfig } from '~/utils/workshopServices'

const props = defineProps<{ category: WorkshopServiceCategory }>()
const config = computed(() => workshopServiceConfig[props.category])
useLegacyPage({ title: config.value.title, sweetAlert: false })

const { services, pending, error, refresh, saveService, deleteService } = useWorkshopServices(props.category)
const statusFilter = ref('')
const formTarget = ref<WorkshopService | null | undefined>(undefined)
const detailTarget = ref<WorkshopService | null>(null)
const deleteTarget = ref<WorkshopService | null>(null)
const currentPageItems = ref<Record<string, any>[]>([])
const busy = ref(false)
const actionError = ref('')
const message = ref('')
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const columns = computed(() => {
  const ending = [{ key: 'updatedLabel', label: props.category === 'hot_print' ? 'Updated' : 'Update', sortable: true }, { key: 'status', label: 'Status', align: 'center' as const }, { key: 'actions', label: 'Action', align: 'center' as const }]
  if (props.category === 'printing') return [{ key: 'printingType', label: 'Type' }, { key: 'name', label: 'Machine Name', sortable: true }, { key: 'priceSummary', label: 'Price', align: 'end' as const }, ...ending]
  if (props.category === 'laminate') return [{ key: 'name', label: 'Nama' }, { key: 'minSize', label: 'Ukuran Min' }, { key: 'maxSize', label: 'Ukuran Max' }, { key: 'pricePerCm', label: 'Harga (cm)', align: 'end' as const }, { key: 'minimumPrice', label: 'Harga Min', align: 'end' as const }, ...ending]
  if (props.category === 'die_cutting') return [{ key: 'name', label: 'Nama' }, { key: 'maxSize', label: 'Ukuran' }, { key: 'standardSummary', label: 'Standard', align: 'end' as const }, { key: 'halfCutSummary', label: 'Setengah Putus', align: 'end' as const }, ...ending]
  return [{ key: 'name', label: 'Nama' }, { key: 'maxSize', label: 'Ukuran Max' }, { key: 'pricePerCm', label: 'Harga (cm)', align: 'end' as const }, { key: 'minimumPrice', label: 'Harga Minim', align: 'end' as const }, ...ending]
})

const filtered = computed(() => services.value.filter(item => !statusFilter.value || item.status === statusFilter.value))
const rows = computed(() => filtered.value.map(item => ({
  ...item,
  updatedLabel: formatWorkshopDate(item.updatedAt),
  priceSummary: `${formatIDR(item.price || 0)}${item.quantityMinimum ? ` minimum ${item.quantityMinimum}; Druck ${formatIDR(item.druckPrice || 0)}` : ` / ${item.priceUnit || 'unit'}`}`,
  standardSummary: `${formatIDR(item.standardPrice || 0)} / min ${formatIDR(item.standardMinimum || 0)}`,
  halfCutSummary: `${formatIDR(item.halfCutPrice || 0)} / min ${formatIDR(item.halfCutMinimum || 0)}`,
  _record: item,
})))
const stats = computed(() => [
  { label: `Total ${config.value.title.replace(' List', '')}`, value: services.value.length, icon: props.category === 'printing' ? 'printer' : props.category === 'laminate' ? 'layers' : props.category === 'die_cutting' ? 'scissors' : 'zap' },
  { label: 'Total Active', value: services.value.filter(item => item.status === 'Active').length, icon: 'check-circle', tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'Total Deactive', value: services.value.filter(item => item.status === 'Deactive').length, icon: 'x-circle', tone: 'bg-red-50 text-red-700' },
])
const printColumns = computed(() => columns.value.filter(column => column.key !== 'actions'))
const detailRows = computed(() => {
  if (!detailTarget.value) return []
  const row = rows.value.find(item => item.id === detailTarget.value?.id)
  if (!row) return []
  return columns.value.filter(column => !['actions', 'name'].includes(column.key)).map(column => ({ label: column.label, value: row[column.key as keyof typeof row] as string | number }))
})

function notify(value: string) {
  message.value = value
  window.setTimeout(() => { if (message.value === value) message.value = '' }, 3500)
}
async function submit(payload: WorkshopServiceFormData) {
  busy.value = true
  actionError.value = ''
  try {
    const response = await saveService(payload)
    notify(response.message || 'Service saved successfully')
    formTarget.value = undefined
  } catch (cause: any) { actionError.value = cause?.data?.statusMessage || cause?.message || 'Service gagal disimpan' }
  finally { busy.value = false }
}
async function confirmDelete() {
  if (!deleteTarget.value) return
  busy.value = true
  actionError.value = ''
  try {
    const response = await deleteService(deleteTarget.value.id)
    notify(response.message || 'Service deleted successfully')
    deleteTarget.value = null
  } catch (cause: any) { actionError.value = cause?.data?.statusMessage || cause?.message || 'Service gagal dihapus' }
  finally { busy.value = false }
}
</script>

<template>
  <div :class="['dulank-page space-y-6', `dulank-page-workshop-${category.replaceAll('_', '-')}`]">
    <SalesListHeader :title="config.title" :subtitle="config.subtitle" :add-label="config.addLabel" :refreshing="pending" @add="formTarget = null" @refresh="refresh()" @print="openPrintModal('print')" @pdf="openPrintModal('pdf')" />
    <SalesFeedback :pending="pending" skeleton="table" :error="error ? 'Unable to load workshop services.' : ''" :message="message" @retry="refresh()" @dismiss="message = ''" />
    <template v-if="!pending && !error">
      <CalculatorStatsGrid :items="stats" />
      <SalesDataTable :columns="columns" :items="rows" search-placeholder="Search machine or service..." @update:current-page-items="currentPageItems = $event">
        <template #filters><TableFilterSelect v-model="statusFilter" :options="['Active', 'Deactive']" placeholder="All Status" /></template>
        <template #cell(name)="{ item }"><span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span></template>
        <template #cell(priceSummary)="{ item }"><div class="text-right"><CurrencyDisplay :value="item.price" /><p v-if="item.quantityMinimum" class="text-xs text-gray-500">Min {{ item.quantityMinimum }}; Druck {{ formatIDR(item.druckPrice) }}</p><p v-else class="text-xs text-gray-500">per {{ item.priceUnit }}</p></div></template>
        <template #cell(pricePerCm)="{ item }"><CurrencyDisplay :value="item.pricePerCm" /></template>
        <template #cell(minimumPrice)="{ item }"><div class="text-right"><CurrencyDisplay :value="item.minimumPrice" /><p v-if="item.minimumCalculation" class="text-xs text-gray-500">Hitungan {{ formatIDR(item.minimumCalculation) }}</p></div></template>
        <template #cell(standardSummary)="{ item }"><div class="text-right"><CurrencyDisplay :value="item.standardPrice" /><p class="text-xs text-gray-500">Min {{ formatIDR(item.standardMinimum) }}</p></div></template>
        <template #cell(halfCutSummary)="{ item }"><div class="text-right"><CurrencyDisplay :value="item.halfCutPrice" /><p class="text-xs text-gray-500">Min {{ formatIDR(item.halfCutMinimum) }}</p></div></template>
        <template #cell(status)="{ item }"><span :class="['rounded px-2 py-1 text-xs font-semibold', item.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600']">{{ item.status }}</span></template>
        <template #cell(actions)="{ item }"><div class="flex justify-center gap-1"><SalesActionButton action="view" label="View detail" @click="detailTarget = item._record" /><SalesActionButton action="edit" label="Edit service" @click="formTarget = item._record" /><SalesActionButton action="delete" label="Delete service" @click="deleteTarget = item._record" /></div></template>
      </SalesDataTable>
    </template>

    <WorkshopServiceModal :open="formTarget !== undefined" :category="category" :service="formTarget || null" :busy="busy" :error="actionError" @close="formTarget = undefined" @submit="submit" />
    <CalculatorDetailDialog :open="!!detailTarget" :title="detailTarget?.name || 'Service Detail'" :details="detailRows" @close="detailTarget = null" />
    <SalesConfirmDelete :open="!!deleteTarget" :busy="busy" :error="actionError" @close="deleteTarget = null" @confirm="confirmDelete" />
    <DocumentPrintModal :open="isPrintModalOpen" :title="config.reportTitle" :subtitle="config.subtitle" :columns="printColumns" :items="rows" :current-page-items="currentPageItems" date-field="updatedAt" :default-action="defaultPrintAction" @close="closePrintModal" />
  </div>
</template>
