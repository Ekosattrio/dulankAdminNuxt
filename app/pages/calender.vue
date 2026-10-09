<script setup lang="ts">
<<<<<<< HEAD
import { useProfitCalculation, type ProfitTier } from '~/composables/useProfitCalculation'

useHead({
  title: 'Calendar Calculator & Settings - Kacetak System'
})

const { formatRupiah } = useFormatters()
const { defaultProfitTiers } = useProfitCalculation()

const activeTab = ref('product')

const tabs = [
  { id: 'product', label: 'Calendar Products', icon: 'calendar' },
  { id: 'size', label: 'Calendar Sizes', icon: 'maximize' },
  { id: 'paper', label: 'Paper Stock', icon: 'file-text' },
  { id: 'machine', label: 'Printing Machine', icon: 'printer' },
  { id: 'finishing', label: 'Finishing & Binding', icon: 'layers' },
  { id: 'components', label: 'Components & Board', icon: 'grid' },
  { id: 'workflow', label: 'Work Flow', icon: 'git-branch' },
  { id: 'profit-setting', label: 'Profit Setting', icon: 'percent' },
  { id: 'log-transaction', label: 'Calculation Logs', icon: 'clipboard' }
]

// Tab 1: Products
const { data: calenderData } = await useFetch<Record<string, any[]>>('/api/calender')
const calendarProducts = ref(calenderData.value?.calendarProducts ?? [])

// Tab 2: Sizes
const calendarSizes = ref(calenderData.value?.calendarSizes ?? [])

// Tab 5: Finishing & Binding
const finishings = ref(calenderData.value?.finishings ?? [])

// Tab 6: Components & Board
const boards = ref(calenderData.value?.boards ?? [])

// Tab 8: Profit tiers
const profitTiers = ref<ProfitTier[]>([...defaultProfitTiers.value])

const addProfitRange = () => {
  const last = profitTiers.value[profitTiers.value.length - 1]
  const newMin = last ? last.maxQty + 1 : 1
  profitTiers.value.push({
    id: String(Date.now()),
    minQty: newMin,
    maxQty: newMin + 500,
    profitPosPercent: 30,
    profitWebstorePercent: 25
  })
}

const deleteProfitRange = (idx: number) => {
  profitTiers.value.splice(idx, 1)
}

// Tab 9: Calculation Logs
const calendarLogs = ref(calenderData.value?.calendarLogs ?? [])
</script>

<template>
  <div>
    <!-- Page Header -->
    <CommonPageHeader title="Calendar Products & Calculator" subtitle="Configure desk and wall calendar parameters, binding, and pricing" />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <!-- Left Panel: Tabs -->
      <div class="lg:col-span-1">
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="mb-3 flex items-center justify-between">
            <h5 class="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Calendar Options
            </h5>
            <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              {{ tabs.length }}
            </span>
          </div>

          <div class="space-y-1">
            <button
              v-for="t in tabs"
              :key="t.id"
              type="button"
              :class="[
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition text-start',
                activeTab === t.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
              ]"
              @click="activeTab = t.id"
            >
              <CommonFeatherIcon :name="t.icon" size="14" />
              <span class="flex-1 truncate">{{ t.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Panel: Content -->
      <div class="lg:col-span-3">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 min-h-[550px]">
          <!-- TAB 1: Calendar Products -->
          <div v-if="activeTab === 'product'" class="space-y-4">
            <div class="border-b border-gray-100 pb-3 dark:border-gray-800">
              <h4 class="text-base font-bold text-gray-900 dark:text-white">Calendar Product Types</h4>
              <p class="text-xs text-gray-500">Configured models for desk and wall calendar manufacturing</p>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                v-for="p in calendarProducts"
                :key="p.id"
                class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div class="flex items-start gap-3">
                  <div class="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-800">
                    <img :src="p.image" :alt="p.name" class="h-full w-full object-contain" />
                  </div>
                  <div class="flex-1 text-xs">
                    <div class="flex items-center justify-between">
                      <h5 class="text-sm font-bold text-gray-900 dark:text-white">{{ p.name }}</h5>
                      <label class="relative inline-flex cursor-pointer items-center">
                        <input v-model="p.active" type="checkbox" class="peer sr-only" />
                        <div class="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:bg-white peer-checked:bg-primary peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                      </label>
                    </div>
                    <div class="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <p><span class="font-semibold text-gray-800 dark:text-gray-200">Size:</span> {{ p.defaultSize }}</p>
                      <p><span class="font-semibold text-gray-800 dark:text-gray-200">Sheets:</span> {{ p.sheets }}</p>
                      <p><span class="font-semibold text-gray-800 dark:text-gray-200">Binding:</span> {{ p.binding }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: Calendar Sizes -->
          <div v-else-if="activeTab === 'size'" class="space-y-4">
            <h4 class="text-base font-bold text-gray-900 dark:text-white">Calendar Standard Sizes</h4>
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <th class="p-2.5 text-start">Size Name</th>
                  <th class="p-2.5 text-end">Width (mm)</th>
                  <th class="p-2.5 text-end">Height (mm)</th>
                  <th class="p-2.5 text-center">Category</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="s in calendarSizes" :key="s.id">
                  <td class="p-2.5 font-bold text-gray-900 dark:text-white">{{ s.name }}</td>
                  <td class="p-2.5 text-end font-mono">{{ s.widthMm }}</td>
                  <td class="p-2.5 text-end font-mono">{{ s.heightMm }}</td>
                  <td class="p-2.5 text-center">
                    <span class="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{{ s.type }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 5: Finishing & Binding -->
          <div v-else-if="activeTab === 'finishing'" class="space-y-4">
            <h4 class="text-base font-bold text-gray-900 dark:text-white">Calendar Binding Costs</h4>
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <th class="p-2.5 text-start">Binding Method</th>
                  <th class="p-2.5 text-end">Cost / Piece (IDR)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="f in finishings" :key="f.id">
                  <td class="p-2.5 font-bold text-gray-900 dark:text-white">{{ f.name }}</td>
                  <td class="p-2.5 text-end font-semibold text-primary">{{ formatRupiah(f.costPerUnit) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 6: Components & Board -->
          <div v-else-if="activeTab === 'components'" class="space-y-4">
            <h4 class="text-base font-bold text-gray-900 dark:text-white">Hardboard & Stand Materials</h4>
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <th class="p-2.5 text-start">Material / Component</th>
                  <th class="p-2.5 text-end">Cost / Stand (IDR)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="b in boards" :key="b.id">
                  <td class="p-2.5 font-bold text-gray-900 dark:text-white">{{ b.name }}</td>
                  <td class="p-2.5 text-end font-semibold text-primary">{{ formatRupiah(b.price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 8: Profit Setting -->
          <div v-else-if="activeTab === 'profit-setting'" class="space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h4 class="text-base font-bold text-gray-900 dark:text-white">Calendar Profit Margins</h4>
              <button type="button" class="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white" @click="addProfitRange">+ Add Range</button>
            </div>
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <th class="p-2.5 text-start">Tier</th>
                  <th class="p-2.5 text-end">Min Qty</th>
                  <th class="p-2.5 text-end">Max Qty</th>
                  <th class="p-2.5 text-end">POS Profit (%)</th>
                  <th class="p-2.5 text-end">Webstore Profit (%)</th>
                  <th class="p-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="(tier, idx) in profitTiers" :key="tier.id">
                  <td class="p-2.5 font-bold">Tier {{ idx + 1 }}</td>
                  <td class="p-2.5 text-end"><input v-model.number="tier.minQty" type="number" class="w-20 rounded border p-1 text-end" /></td>
                  <td class="p-2.5 text-end"><input v-model.number="tier.maxQty" type="number" class="w-24 rounded border p-1 text-end" /></td>
                  <td class="p-2.5 text-end font-bold text-primary">{{ tier.profitPosPercent }}%</td>
                  <td class="p-2.5 text-end font-bold text-secondary">{{ tier.profitWebstorePercent }}%</td>
                  <td class="p-2.5 text-center">
                    <button type="button" class="text-gray-400 hover:text-danger" @click="deleteProfitRange(idx)">
                      <CommonFeatherIcon name="trash-2" size="14" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 9: Calculation Logs -->
          <div v-else-if="activeTab === 'log-transaction'" class="space-y-4">
            <h4 class="text-base font-bold text-gray-900 dark:text-white">Calendar Calculation Logs</h4>
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <th class="p-2.5 text-start">Date</th>
                  <th class="p-2.5 text-start">Customer</th>
                  <th class="p-2.5 text-start">Description</th>
                  <th class="p-2.5 text-end">Qty</th>
                  <th class="p-2.5 text-end">Total Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="l in calendarLogs" :key="l.id">
                  <td class="p-2.5 font-mono text-gray-500">{{ l.date }}</td>
                  <td class="p-2.5 font-bold">{{ l.client }}</td>
                  <td class="p-2.5">{{ l.desc }}</td>
                  <td class="p-2.5 text-end font-semibold">{{ l.qty }} pcs</td>
                  <td class="p-2.5 text-end font-bold text-primary">{{ formatRupiah(l.price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Fallback general specs -->
          <div v-else class="py-12 text-center text-xs text-gray-400">
            <CommonFeatherIcon name="settings" size="32" class="mx-auto mb-2 opacity-30" />
            <p>Parameters for this tab are inherited from global production specifications.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


useMockSync('calender', calendarProducts);

useMockSync('calender', calendarSizes);

useMockSync('calender', finishings);

useMockSync('calender', boards);

useMockSync('calender', calendarLogs);
=======
import type { CalendarConfig } from '#server/types/calendar-setting'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import CalendarWorkspace from '~/components/pages/products-services/CalendarWorkspace.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Calender', sweetAlert: false })

const { config, pending, error, refresh, saveCalendarConfig } = useCalendarSettings()
const draft = ref<CalendarConfig | null>(null)
const busy = ref(false)
const message = ref('')
const saveError = ref('')

watch(config, (value) => {
  if (value) draft.value = structuredClone(toRaw(value))
}, { immediate: true })

async function handleSave() {
  if (!draft.value) return
  busy.value = true
  saveError.value = ''
  message.value = ''
  try {
    const response = await saveCalendarConfig(draft.value)
    message.value = response.message || 'Calender settings saved successfully'
  } catch (cause: any) {
    saveError.value = cause?.data?.statusMessage || cause?.message || 'Calender settings gagal disimpan'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-calender space-y-6">
    <!-- Page Header -->
    <SalesListHeader
      title="Calender"
      subtitle="Manage your Calender"
      :refreshing="pending"
      @refresh="refresh()"
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow hover:bg-primary/90 disabled:opacity-50"
          :disabled="busy || !draft"
          @click="handleSave"
        >
          <FeatherIcon name="save" :size="15" />
          {{ busy ? 'Saving...' : 'Save All Settings' }}
        </button>
      </template>
    </SalesListHeader>

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :error="saveError || (error ? 'Unable to load calender configuration.' : '')"
      :message="message"
      @retry="refresh()"
      @dismiss="message = ''"
    />

    <!-- Main Workspace -->
    <CalendarWorkspace
      v-if="draft && !pending && !error"
      v-model:draft="draft"
      :busy="busy"
      @save="handleSave"
    />
  </div>
</template>
>>>>>>> origin/eko
