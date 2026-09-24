<script setup lang="ts">
import { useProfitCalculation, type ProfitTier } from '~/composables/useProfitCalculation'
import type {
  ProductCustom,
  SizePreset,
  PaperTypePreset,
  MachineTypePreset,
  LaminatePreset,
  FoldPreset,
  PrintSidePreset,
  ComponentPreset,
  WorkflowStepPreset,
  CalculationLogTransaction
} from '~/types/cetak-full-color'

useLegacyPage({
  title: 'Cetak Full Color',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { formatRupiah } = useFormatters()
const { defaultProfitTiers } = useProfitCalculation()

// Active Tab
const activeTab = ref('product')

const tabs = [
  { id: 'product', label: 'Product Custom Default', icon: 'box' },
  { id: 'size', label: 'Product Size', icon: 'maximize' },
  { id: 'paper', label: 'Paper Type', icon: 'file-text' },
  { id: 'machine', label: 'Machine Type', icon: 'printer' },
  { id: 'laminate', label: 'Laminate', icon: 'layers' },
  { id: 'fold', label: 'Fold', icon: 'layers' },
  { id: 'print-side', label: 'Print Side', icon: 'copy' },
  { id: 'components', label: 'Components', icon: 'grid' },
  { id: 'workflow', label: 'Work Flow', icon: 'git-branch' },
  { id: 'profit-setting', label: 'Profit Setting', icon: 'percent' },
  { id: 'log-transaction', label: 'Log Transaction', icon: 'clipboard' }
]

const { config, pending, refresh, saveCetakFullColorConfig } = useCetakFullColor()

const products = ref<ProductCustom[]>([])
const sizes = ref<SizePreset[]>([])
const papers = ref<PaperTypePreset[]>([])
const machines = ref<MachineTypePreset[]>([])
const laminates = ref<LaminatePreset[]>([])
const folds = ref<FoldPreset[]>([])
const printSides = ref<PrintSidePreset[]>([])
const components = ref<ComponentPreset[]>([])
const workflowSteps = ref<WorkflowStepPreset[]>([])
const profitTiers = ref<ProfitTier[]>([...defaultProfitTiers.value])
const logTransactions = ref<CalculationLogTransaction[]>([])

watch(
  config,
  (cfg) => {
    if (cfg) {
      if (cfg.products?.length) products.value = cfg.products
      if (cfg.sizes?.length) sizes.value = cfg.sizes
      if (cfg.papers?.length) papers.value = cfg.papers
      if (cfg.machines?.length) machines.value = cfg.machines
      if (cfg.laminates?.length) laminates.value = cfg.laminates
      if (cfg.folds?.length) folds.value = cfg.folds
      if (cfg.printSides?.length) printSides.value = cfg.printSides
      if (cfg.components?.length) components.value = cfg.components
      if (cfg.workflowSteps?.length) workflowSteps.value = cfg.workflowSteps
      if (cfg.profitTiers?.length) profitTiers.value = cfg.profitTiers
      if (cfg.logTransactions?.length) logTransactions.value = cfg.logTransactions
    }
  },
  { immediate: true }
)

const persistCurrentState = async () => {
  try {
    await saveCetakFullColorConfig({
      products: products.value,
      sizes: sizes.value,
      papers: papers.value,
      machines: machines.value,
      laminates: laminates.value,
      folds: folds.value,
      printSides: printSides.value,
      components: components.value,
      workflowSteps: workflowSteps.value,
      profitTiers: profitTiers.value,
      logTransactions: logTransactions.value
    })
  } catch (err) {
    console.error('Failed to save config:', err)
  }
}

const addProfitRange = async () => {
  const last = profitTiers.value[profitTiers.value.length - 1]
  const newMin = last ? last.maxQty + 1 : 1
  profitTiers.value.push({
    id: String(Date.now()),
    minQty: newMin,
    maxQty: newMin + 1000,
    profitPosPercent: 20,
    profitWebstorePercent: 15
  })
  await persistCurrentState()
}

const deleteProfitRange = async (index: number) => {
  profitTiers.value.splice(index, 1)
  await persistCurrentState()
}

// Add Product Modal
const addProductModal = ref(false)
const newProductName = ref('')
const newProductSize = ref('A4')
const newProductPaper = ref('Art Paper 150gr')
const newProductMachine = ref('SM 52 4 Warna')

const handleCreateProduct = async () => {
  products.value.push({
    id: String(Date.now()),
    name: newProductName.value || 'Custom Product',
    defaultSize: newProductSize.value,
    paperTypes: newProductPaper.value,
    machine: newProductMachine.value,
    active: true,
    image: '/assets/img/products/brosur.png'
  })
  addProductModal.value = false
  newProductName.value = ''
  await persistCurrentState()
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="Cetak Full Color" subtitle="Manage your printing workflow, pricing formulas, and product defaults" />

    <!-- 11-Tab Engine Shell -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <!-- Left Panel: 11 Navigation Tabs -->
      <div class="lg:col-span-1">
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="mb-3 flex items-center justify-between">
            <h5 class="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Setting & Optional
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

      <!-- Right Panel: Active Tab Content -->
      <div class="lg:col-span-3">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 min-h-[550px]">
          <!-- TAB 1: Product Custom Default -->
          <div v-if="activeTab === 'product'" class="space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <div>
                <h4 class="text-base font-bold text-gray-900 dark:text-white">Product Custom Default</h4>
                <p class="text-xs text-gray-500">Configure master products and default printing configurations</p>
              </div>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90"
                @click="addProductModal = true"
              >
                <FeatherIcon name="plus" size="14" />
                <span>Add Product</span>
              </button>
            </div>

            <!-- Product Grid Cards -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
              <div
                v-for="p in products"
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
                      <!-- Switch toggle -->
                      <label class="relative inline-flex cursor-pointer items-center">
                        <input v-model="p.active" type="checkbox" class="peer sr-only" />
                        <div class="peer h-4 w-7 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full dark:bg-gray-700"></div>
                      </label>
                    </div>
                    <div class="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <p><span class="font-semibold text-gray-800 dark:text-gray-200">Size:</span> {{ p.defaultSize }}</p>
                      <p><span class="font-semibold text-gray-800 dark:text-gray-200">Paper:</span> {{ p.paperTypes }}</p>
                      <p><span class="font-semibold text-gray-800 dark:text-gray-200">Machine:</span> {{ p.machine }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: Product Size -->
          <div v-else-if="activeTab === 'size'" class="space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h4 class="text-base font-bold text-gray-900 dark:text-white">Product Sizes</h4>
            </div>
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <th class="p-2.5 text-start">Size Name</th>
                  <th class="p-2.5 text-end">Width (mm)</th>
                  <th class="p-2.5 text-end">Height (mm)</th>
                  <th class="p-2.5 text-center">Type</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="s in sizes" :key="s.id">
                  <td class="p-2.5 font-bold text-gray-900 dark:text-white">{{ s.name }}</td>
                  <td class="p-2.5 text-end font-mono">{{ s.widthMm }}</td>
                  <td class="p-2.5 text-end font-mono">{{ s.heightMm }}</td>
                  <td class="p-2.5 text-center">
                    <span class="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">Standard</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 3: Paper Type -->
          <div v-else-if="activeTab === 'paper'" class="space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h4 class="text-base font-bold text-gray-900 dark:text-white">Paper Stock & Prices</h4>
            </div>
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <th class="p-2.5 text-start">Paper Material</th>
                  <th class="p-2.5 text-center">Plano Size</th>
                  <th class="p-2.5 text-end">Price / Plano Sheet</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="p in papers" :key="p.id">
                  <td class="p-2.5 font-bold text-gray-900 dark:text-white">{{ p.name }}</td>
                  <td class="p-2.5 text-center font-mono">{{ p.plano }}</td>
                  <td class="p-2.5 text-end font-semibold text-primary">{{ formatRupiah(p.pricePlano) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 4: Machine Type -->
          <div v-else-if="activeTab === 'machine'" class="space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <h4 class="text-base font-bold text-gray-900 dark:text-white">Printing Press Machines</h4>
            </div>
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <th class="p-2.5 text-start">Machine Name</th>
                  <th class="p-2.5 text-center">Max Cut/Print Area</th>
                  <th class="p-2.5 text-end">Plate Cost / Color</th>
                  <th class="p-2.5 text-end">Min Run Charge</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="m in machines" :key="m.id">
                  <td class="p-2.5 font-bold text-gray-900 dark:text-white">{{ m.name }}</td>
                  <td class="p-2.5 text-center font-mono">{{ m.maxArea }}</td>
                  <td class="p-2.5 text-end font-medium">{{ formatRupiah(m.plateCost) }}</td>
                  <td class="p-2.5 text-end font-semibold text-primary">{{ formatRupiah(m.runChargeMin) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 5: Laminate -->
          <div v-else-if="activeTab === 'laminate'" class="space-y-4">
            <h4 class="text-base font-bold text-gray-900 dark:text-white">Lamination Options</h4>
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <th class="p-2.5 text-start">Lamination Finish</th>
                  <th class="p-2.5 text-end">Cost / Item (IDR)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="l in laminates" :key="l.id">
                  <td class="p-2.5 font-bold text-gray-900 dark:text-white">{{ l.name }}</td>
                  <td class="p-2.5 text-end font-semibold text-primary">{{ formatRupiah(l.costPerSide) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 6: Fold -->
          <div v-else-if="activeTab === 'fold'" class="space-y-4">
            <h4 class="text-base font-bold text-gray-900 dark:text-white">Folding Specifications</h4>
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <th class="p-2.5 text-start">Folding Type</th>
                  <th class="p-2.5 text-end">Cost / 1,000 pcs (IDR)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="f in folds" :key="f.id">
                  <td class="p-2.5 font-bold text-gray-900 dark:text-white">{{ f.name }}</td>
                  <td class="p-2.5 text-end font-semibold text-primary">{{ formatRupiah(f.costPer1000) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 7: Print Side -->
          <div v-else-if="activeTab === 'print-side'" class="space-y-4">
            <h4 class="text-base font-bold text-gray-900 dark:text-white">Print Side Configuration</h4>
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <th class="p-2.5 text-start">Print Side Scheme</th>
                  <th class="p-2.5 text-center">Plate Multiplier</th>
                  <th class="p-2.5 text-center">Run Multiplier</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="ps in printSides" :key="ps.id">
                  <td class="p-2.5 font-bold text-gray-900 dark:text-white">{{ ps.name }}</td>
                  <td class="p-2.5 text-center font-bold">{{ ps.plateMultiplier }}x</td>
                  <td class="p-2.5 text-center font-bold">{{ ps.runMultiplier }}x</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- TAB 8: Components -->
          <div v-else-if="activeTab === 'components'" class="space-y-4">
            <h4 class="text-base font-bold text-gray-900 dark:text-white">Product Components</h4>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div v-for="c in components" :key="c.id" class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800 text-xs">
                <p class="font-bold text-gray-900 dark:text-white">{{ c.name }}</p>
                <span class="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{{ c.type }}</span>
              </div>
            </div>
          </div>

          <!-- TAB 9: Work Flow -->
          <div v-else-if="activeTab === 'workflow'" class="space-y-4">
            <h4 class="text-base font-bold text-gray-900 dark:text-white">Production Workflow Route</h4>
            <div class="space-y-2">
              <div
                v-for="step in workflowSteps"
                :key="step.step"
                class="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs dark:border-gray-800 dark:bg-gray-800"
              >
                <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {{ step.step }}
                </div>
                <div class="flex-1">
                  <p class="font-bold text-gray-900 dark:text-white">{{ step.name }}</p>
                  <span class="text-gray-500">{{ step.department }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 10: Profit Setting (Tiered Matrix) -->
          <div v-else-if="activeTab === 'profit-setting'" class="space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
              <div>
                <h4 class="text-base font-bold text-gray-900 dark:text-white">Tiered Profit Margins</h4>
                <p class="text-xs text-gray-500">Configure margin % for POS and Webstore across order quantity brackets</p>
              </div>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90"
                @click="addProfitRange"
              >
                <FeatherIcon name="plus" size="13" />
                <span>Add Quantity Range</span>
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-xs">
                <thead>
                  <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <th class="p-2.5 text-start">Range Bracket</th>
                    <th class="p-2.5 text-end">Min Qty</th>
                    <th class="p-2.5 text-end">Max Qty</th>
                    <th class="p-2.5 text-end">POS Profit (%)</th>
                    <th class="p-2.5 text-end">Webstore Profit (%)</th>
                    <th class="p-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr v-for="(tier, idx) in profitTiers" :key="tier.id">
                    <td class="p-2.5 font-bold text-gray-900 dark:text-white">Tier {{ idx + 1 }}</td>
                    <td class="p-2.5 text-end">
                      <input
                        v-model.number="tier.minQty"
                        type="number"
                        class="w-20 rounded border border-gray-200 bg-gray-50 p-1 text-end text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </td>
                    <td class="p-2.5 text-end">
                      <input
                        v-model.number="tier.maxQty"
                        type="number"
                        class="w-24 rounded border border-gray-200 bg-gray-50 p-1 text-end text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </td>
                    <td class="p-2.5 text-end">
                      <div class="inline-flex items-center gap-1">
                        <input
                          v-model.number="tier.profitPosPercent"
                          type="number"
                          class="w-16 rounded border border-gray-200 bg-gray-50 p-1 text-end text-xs font-bold text-primary dark:border-gray-700 dark:bg-gray-800"
                        />
                        <span>%</span>
                      </div>
                    </td>
                    <td class="p-2.5 text-end">
                      <div class="inline-flex items-center gap-1">
                        <input
                          v-model.number="tier.profitWebstorePercent"
                          type="number"
                          class="w-16 rounded border border-gray-200 bg-gray-50 p-1 text-end text-xs font-bold text-secondary dark:border-gray-700 dark:bg-gray-800"
                        />
                        <span>%</span>
                      </div>
                    </td>
                    <td class="p-2.5 text-center">
                      <button
                        type="button"
                        class="text-gray-400 hover:text-danger"
                        title="Delete Range"
                        @click="deleteProfitRange(idx)"
                      >
                        <FeatherIcon name="trash-2" size="14" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 11: Log Transaction -->
          <div v-else-if="activeTab === 'log-transaction'" class="space-y-4">
            <h4 class="text-base font-bold text-gray-900 dark:text-white">Calculator Estimation Logs</h4>
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <th class="p-2.5 text-start">Timestamp</th>
                  <th class="p-2.5 text-start">Customer</th>
                  <th class="p-2.5 text-start">Product Config</th>
                  <th class="p-2.5 text-end">Qty</th>
                  <th class="p-2.5 text-end">Production Cost</th>
                  <th class="p-2.5 text-end">Selling Price</th>
                  <th class="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="log in logTransactions" :key="log.id">
                  <td class="p-2.5 text-gray-500 font-mono">{{ log.date }}</td>
                  <td class="p-2.5 font-bold text-gray-900 dark:text-white">{{ log.customer }}</td>
                  <td class="p-2.5">{{ log.product }}</td>
                  <td class="p-2.5 text-end font-semibold">{{ log.qty }}</td>
                  <td class="p-2.5 text-end text-gray-600 dark:text-gray-400">{{ formatRupiah(log.totalCost) }}</td>
                  <td class="p-2.5 text-end font-bold text-primary">{{ formatRupiah(log.sellingPrice) }}</td>
                  <td class="p-2.5 text-center">
                    <span class="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      {{ log.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <BaseModal v-model="addProductModal" title="Add Product Custom Default" size="md">
      <form class="p-5 text-xs space-y-4" @submit.prevent="handleCreateProduct">
        <div>
          <label class="font-semibold text-gray-700 dark:text-gray-300">Product Name</label>
          <input v-model="newProductName" type="text" class="mt-1 w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white" required />
        </div>
        <div>
          <label class="font-semibold text-gray-700 dark:text-gray-300">Default Size</label>
          <input v-model="newProductSize" type="text" class="mt-1 w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white" required />
        </div>
        <div>
          <label class="font-semibold text-gray-700 dark:text-gray-300">Paper Type</label>
          <input v-model="newProductPaper" type="text" class="mt-1 w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white" required />
        </div>
        <div>
          <label class="font-semibold text-gray-700 dark:text-gray-300">Machine</label>
          <input v-model="newProductMachine" type="text" class="mt-1 w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white" required />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="rounded border px-3 py-1.5" @click="addProductModal = false">Cancel</button>
          <button type="submit" class="rounded bg-primary px-4 py-1.5 font-semibold text-white">Save Product</button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

