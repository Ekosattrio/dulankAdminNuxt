<script setup lang="ts">
import type { CalculatorModerationInput, CalculatorPartnerKind, CalculatorPartnerRow } from '#server/types/calculator-marketplace'
import { useCalculatorPartners } from '~/composables/useCalculatorMarketplace'
import { useTablePrint } from '~/composables/useTablePrint'

const props = defineProps<{ kind: Extract<CalculatorPartnerKind, 'printing_shop' | 'paper_shop'> }>()
const isPrinting = computed(() => props.kind === 'printing_shop')
const title = computed(() => isPrinting.value ? 'Percetakan List' : 'Toko Kertas List')
const subtitle = computed(() => isPrinting.value ? 'Manage your Percetakan' : 'Manage your Toko Kertas')

useLegacyPage({ title: title.value, sweetAlert: false })

const { partners, pending, error, refresh, moderatePartner, deletePartner } = useCalculatorPartners(props.kind)
const subscriptionFilter = ref('')
const currentPageItems = ref<Record<string, any>[]>([])
const selected = ref<CalculatorPartnerRow | null>(null)
const manageTarget = ref<CalculatorPartnerRow | null>(null)
const deleteTarget = ref<CalculatorPartnerRow | null>(null)
const busy = ref(false)
const actionError = ref('')
const message = ref('')
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const filteredPartners = computed(() => partners.value.filter(partner => {
  if (!subscriptionFilter.value) return true
  return subscriptionFilter.value === 'Yes' ? partner.subscribed : !partner.subscribed
}))

const stats = computed(() => {
  const rows = partners.value
  const sum = (key: keyof CalculatorPartnerRow['metrics']) => rows.reduce((total, row) => total + Number(row.metrics[key] || 0), 0)
  const base = [
    { label: isPrinting.value ? 'Percetakan' : 'Toko Kertas', value: rows.length, icon: isPrinting.value ? 'printer' : 'shopping-bag' },
    { label: 'Subscribed', value: rows.filter(row => row.subscribed).length, icon: 'check-circle', tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Unsubscribed', value: rows.filter(row => !row.subscribed).length, icon: 'x-circle', tone: 'bg-red-50 text-red-600' },
    { label: 'Expired', value: rows.filter(row => row.moderationStatus === 'frozen').length, icon: 'clock', tone: 'bg-amber-50 text-amber-600' },
  ]
  return isPrinting.value
    ? [...base, { label: 'Cetak', value: sum('offset'), icon: 'printer' }, { label: 'Laminasi', value: sum('laminate'), icon: 'layers' }, { label: 'Pond', value: sum('dieCutting'), icon: 'scissors' }, { label: 'Poli', value: sum('hotPrint'), icon: 'zap' }]
    : [...base, { label: 'Kertas', value: sum('paper'), icon: 'file' }, { label: 'Group', value: sum('group'), icon: 'folder' }, { label: 'Ukuran', value: sum('size'), icon: 'maximize' }, { label: 'Jenis', value: sum('type'), icon: 'grid' }]
})

const columns = computed(() => isPrinting.value
  ? [
      { key: 'name', label: 'Percetakan', sortable: true }, { key: 'address', label: 'Alamat' }, { key: 'joinDate', label: 'Join', sortable: true },
      { key: 'subscription', label: 'Subscription', align: 'center' as const }, { key: 'whatsapp', label: 'Whatsapp' },
      { key: 'paper', label: 'Kertas', align: 'center' as const }, { key: 'offset', label: 'Cetak', align: 'center' as const },
      { key: 'laminate', label: 'Laminasi', align: 'center' as const }, { key: 'dieCutting', label: 'Pond', align: 'center' as const },
      { key: 'hotPrint', label: 'Poli', align: 'center' as const }, { key: 'capabilitiesLabel', label: 'Header' }, { key: 'actions', label: 'Action', align: 'center' as const },
    ]
  : [
      { key: 'name', label: 'Toko Kertas', sortable: true }, { key: 'address', label: 'Alamat' }, { key: 'joinDate', label: 'Join', sortable: true },
      { key: 'subscription', label: 'Subscription', align: 'center' as const }, { key: 'paper', label: 'Kertas', align: 'center' as const },
      { key: 'group', label: 'Group', align: 'center' as const }, { key: 'size', label: 'Ukuran', align: 'center' as const },
      { key: 'type', label: 'Jenis', align: 'center' as const }, { key: 'actions', label: 'Action', align: 'center' as const },
    ])

const rows = computed(() => filteredPartners.value.map(partner => ({
  ...partner,
  subscription: partner.subscribed ? 'Yes' : 'No',
  capabilitiesLabel: partner.capabilities?.join(', ') || '-',
  ...partner.metrics,
  _record: partner,
})))
const printColumns = computed(() => columns.value.filter(column => column.key !== 'actions'))

function notify(value: string) {
  message.value = value
  window.setTimeout(() => { if (message.value === value) message.value = '' }, 3500)
}

async function submitModeration(input: CalculatorModerationInput) {
  if (!manageTarget.value) return
  busy.value = true
  actionError.value = ''
  try {
    const response = await moderatePartner(manageTarget.value.id, input)
    notify(response.message || 'Tindakan berhasil disimpan')
    manageTarget.value = null
  } catch (cause: any) {
    actionError.value = cause?.data?.statusMessage || cause?.message || 'Tindakan gagal disimpan'
  } finally { busy.value = false }
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  busy.value = true
  try {
    const response = await deletePartner(deleteTarget.value.id)
    notify(response.message || 'Partner berhasil dihapus')
    deleteTarget.value = null
  } catch (cause: any) {
    actionError.value = cause?.data?.statusMessage || cause?.message || 'Partner gagal dihapus'
  } finally { busy.value = false }
}
</script>

<template>
  <div :class="['dulank-page space-y-6', isPrinting ? 'dulank-page-semua-percetakan' : 'dulank-page-semua-toko-kertas']">
    <SalesListHeader :title="title" :subtitle="subtitle" :refreshing="pending" @refresh="refresh()" @print="openPrintModal('print')" @pdf="openPrintModal('pdf')" />
    <SalesFeedback :pending="pending" :error="error ? 'Unable to load marketplace partners.' : ''" :message="message" skeleton="table" @retry="refresh()" @dismiss="message = ''" />
    <template v-if="!pending && !error">
      <CalculatorStatsGrid :items="stats" />
      <SalesDataTable :columns="columns" :items="rows" :search-placeholder="`Search ${isPrinting ? 'percetakan' : 'toko kertas'} or location...`" @update:current-page-items="currentPageItems = $event">
        <template #filters><TableFilterSelect v-model="subscriptionFilter" :options="[{ label: 'Subscription: Yes', value: 'Yes' }, { label: 'Subscription: No', value: 'No' }]" placeholder="All Subscriptions" /></template>
        <template #cell(name)="{ item }"><span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span></template>
        <template #cell(subscription)="{ item }"><span :class="['inline-flex rounded px-2 py-1 text-xs font-semibold', item.subscribed ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600']">{{ item.subscription }}</span></template>
        <template #cell(whatsapp)="{ item }"><a class="text-emerald-600 hover:underline" :href="`https://wa.me/${item.whatsapp}`" target="_blank" rel="noopener">{{ item.whatsapp }}</a></template>
        <template #cell(capabilitiesLabel)="{ item }"><div class="flex max-w-52 flex-wrap gap-1"><span v-for="capability in item.capabilities" :key="capability" class="rounded bg-cyan-50 px-1.5 py-0.5 text-xs text-cyan-700">{{ capability }}</span></div></template>
        <template #cell(actions)="{ item }"><div class="flex justify-center gap-1"><SalesActionButton icon="eye" label="View detail" @click="selected = item._record" /><SalesActionButton icon="settings" label="Manage partner" @click="manageTarget = item._record" /><SalesActionButton icon="trash-2" label="Delete partner" @click="deleteTarget = item._record" /></div></template>
      </SalesDataTable>
    </template>

    <CalculatorDetailDialog :open="!!selected" :title="isPrinting ? 'Informasi Percetakan' : 'Informasi Toko Kertas'" :source-name="selected?.name" :source-address="selected?.address" :details="selected ? [{ label: 'Status Langganan', value: selected.subscribed ? 'Active Subscription' : 'Inactive' }, { label: 'Tanggal Bergabung', value: selected.joinDate }, { label: 'WhatsApp PIC', value: selected.whatsapp || '-' }, { label: 'Status Moderasi', value: selected.moderationStatus }] : []" @close="selected = null" />
    <CalculatorManageDialog :open="!!manageTarget" :partner="manageTarget" :busy="busy" :error="actionError" @close="manageTarget = null" @submit="submitModeration" />
    <SalesConfirmDelete :open="!!deleteTarget" :busy="busy" :error="actionError" @close="deleteTarget = null" @confirm="confirmDelete" />
    <DocumentPrintModal :open="isPrintModalOpen" :title="`${title} Report`" :subtitle="subtitle" :columns="printColumns" :items="rows" :current-page-items="currentPageItems" date-field="joinDate" :default-action="defaultPrintAction" @close="closePrintModal" />
  </div>
</template>
