<script setup lang="ts">
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
const calendarProducts = ref([
  {
    id: '1',
    name: 'Kalender Meja Dudukan Linen',
    defaultSize: '210x150 mm (Landscape)',
    sheets: '13 Lembar (1 Cover + 12 Bulan)',
    paper: 'Art Carton 230gr',
    binding: 'Spiral Kawat Hitam',
    active: true,
    image: '/assets/img/products/pos-product-10.png'
  },
  {
    id: '2',
    name: 'Kalender Dinding Spiral',
    defaultSize: '380x530 mm',
    sheets: '7 Lembar (1 Cover + 6 Dwi-Wulan)',
    paper: 'Art Paper 150gr',
    binding: 'Spiral Kawat + Hanger',
    active: true,
    image: '/assets/img/products/pos-product-01.png'
  },
  {
    id: '3',
    name: 'Kalender Dinding Klemseng',
    defaultSize: '380x530 mm',
    sheets: '4 Lembar (Triwulan)',
    paper: 'HVS 80gr',
    binding: 'Jepit Kaleng (Klemseng)',
    active: true,
    image: '/assets/img/products/pos-product-03.png'
  },
  {
    id: '4',
    name: 'Kalender Poster 1 Lembar',
    defaultSize: '460x640 mm',
    sheets: '1 Lembar Plano',
    paper: 'Art Carton 260gr',
    binding: 'Mata Ikan / Bolong Atas',
    active: true,
    image: '/assets/img/products/brosur.png'
  }
])

// Tab 2: Sizes
const calendarSizes = ref([
  { id: '1', name: 'Desk Landscape 21x15', widthMm: 210, heightMm: 150, type: 'Meja' },
  { id: '2', name: 'Desk Portrait 15x21', widthMm: 150, heightMm: 210, type: 'Meja' },
  { id: '3', name: 'Wall Standard 38x53', widthMm: 380, heightMm: 530, type: 'Dinding' },
  { id: '4', name: 'Wall Jumbo 46x64', widthMm: 460, heightMm: 640, type: 'Dinding' },
  { id: '5', name: 'Wall Super Jumbo 50x70', widthMm: 500, heightMm: 700, type: 'Dinding' }
])

// Tab 5: Finishing & Binding
const finishings = ref([
  { id: '1', name: 'Spiral Kawat Ring Hitam / Putih', costPerUnit: 2500 },
  { id: '2', name: 'Jepit Kaleng Seng (Klemseng) 38cm', costPerUnit: 1200 },
  { id: '3', name: 'Jepit Kaleng Seng (Klemseng) 46cm', costPerUnit: 1600 },
  { id: '4', name: 'Mata Ikan (Eyelet) + Tali Gantungan', costPerUnit: 500 },
  { id: '5', name: 'Laminasi Doff Cover Kalender', costPerUnit: 1500 }
])

// Tab 6: Components & Board
const boards = ref([
  { id: '1', name: 'Hardboard No. 30 Tebal (Dudukan)', price: 3500 },
  { id: '2', name: 'Hardboard No. 40 Standar (Dudukan)', price: 2800 },
  { id: '3', name: 'Linen Wrapping Sheet (Cover Dudukan)', price: 1500 },
  { id: '4', name: 'Kawat Hanger 38cm', price: 800 }
])

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
const calendarLogs = ref([
  { id: '1', date: '04/12/2025', client: 'Bank Mandiri Karawang', desc: 'Kalender Meja 13 Lbr 210x150', qty: 1000, price: 18500000 },
  { id: '2', date: '02/12/2025', client: 'RSUD Karawang', desc: 'Kalender Dinding Spiral 38x53 7 Lbr', qty: 2000, price: 32000000 },
  { id: '3', date: '28/11/2025', client: 'PT Toyota Motor', desc: 'Kalender Meja Hardcover Exclusive', qty: 500, price: 12500000 }
])
</script>

<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="Calendar Products & Calculator" subtitle="Configure desk and wall calendar parameters, binding, and pricing" />

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
              <FeatherIcon :name="t.icon" size="14" />
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
                      <FeatherIcon name="trash-2" size="14" />
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
            <FeatherIcon name="settings" size="32" class="mx-auto mb-2 opacity-30" />
            <p>Parameters for this tab are inherited from global production specifications.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

