<script setup lang="ts">
import type { ProductItem } from '~/components/forms/ProductLiveSearch.vue'

const router = useRouter()

useHead({
  title: 'Add Work Flow - Kacetak System'
})

const selectedProduct = ref('Brosur A5 Full Color')
const selectedCategory = ref('Offset')

interface FlowStepOption {
  id: string
  name: string
  category: 'Design' | 'Pracetak' | 'Cetak' | 'Finishing'
  selected: boolean
  template: string
}

const flowSteps = ref<FlowStepOption[]>([
  { id: '1', name: 'Artwork Checking', category: 'Design', selected: true, template: 'Standard Ready Print' },
  { id: '2', name: 'Layout & Imposition', category: 'Design', selected: true, template: 'Preps 8 Imposition' },
  { id: '3', name: 'Plate CTP (Thermal)', category: 'Pracetak', selected: true, template: 'SM52 4 Warna (4 Plat)' },
  { id: '4', name: 'Potong Kertas Plano (Sheeting)', category: 'Pracetak', selected: true, template: 'Potong Ukuran Mesin 37x52' },
  { id: '5', name: 'Cetak Mesin SM 52', category: 'Cetak', selected: true, template: 'SM52 4/0 Full Color' },
  { id: '6', name: 'Cetak Mesin Oliver 58', category: 'Cetak', selected: false, template: '1 Warna Spot' },
  { id: '7', name: 'Laminasi Doff 1 Sisi', category: 'Finishing', selected: false, template: 'Thermal Doff' },
  { id: '8', name: 'Potong Jadi (Final Trimming)', category: 'Finishing', selected: true, template: 'Potong Siku Presisi' },
  { id: '9', name: 'Lipatan Brosur (Folding)', category: 'Finishing', selected: true, template: 'Lipat 2 (Half Fold)' },
  { id: '10', name: 'Sortir & Quality Check', category: 'Finishing', selected: true, template: 'Inspeksi Standar' },
  { id: '11', name: 'Packing & Shrink Wrap', category: 'Finishing', selected: true, template: 'Kardus Dulank' }
])

const activeSequence = computed(() => {
  return flowSteps.value.filter(s => s.selected)
})

const toggleStep = (step: FlowStepOption) => {
  step.selected = !step.selected
}

const removeSequenceItem = (step: FlowStepOption) => {
  step.selected = false
}

const handleProductSelect = (p: ProductItem) => {
  selectedProduct.value = p.name
  selectedCategory.value = p.category
}

const isSaving = ref(false)
const handleSave = () => {
  isSaving.value = true
  setTimeout(() => {
    isSaving.value = false
    router.push('/work-flow')
  }, 500)
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="Add Work Flow" subtitle="Arrange and assign default workflow route to products">
      <template #actions>
        <NuxtLink
          to="/work-flow"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <FeatherIcon name="arrow-left" size="14" />
          <span>Back to Work Flow List</span>
        </NuxtLink>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left 2 Cols: Step Selection -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Choose Product Card -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 text-xs">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-3">1. Select Target Product</h4>
          <div class="max-w-md">
            <ProductLiveSearch @select="handleProductSelect" />
          </div>
          <div class="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
            <span class="font-semibold text-gray-700 dark:text-gray-300">Selected:</span>
            <span class="font-bold text-primary">{{ selectedProduct }}</span>
            <span class="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{{ selectedCategory }}</span>
          </div>
        </div>

        <!-- Flow Steps Selector Card -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 text-xs space-y-4">
          <h4 class="text-sm font-bold text-gray-900 dark:text-white">2. Check & Configure Department Steps</h4>

          <!-- Groups -->
          <div v-for="cat in (['Design', 'Pracetak', 'Cetak', 'Finishing'] as const)" :key="cat" class="border-t border-gray-100 pt-3 dark:border-gray-800">
            <h5 class="mb-2 font-bold uppercase text-[11px] text-gray-500">{{ cat }} Department</h5>
            <div class="space-y-2">
              <div
                v-for="step in flowSteps.filter(s => s.category === cat)"
                :key="step.id"
                class="flex items-center justify-between rounded-lg border border-gray-200 p-2.5 dark:border-gray-700"
              >
                <label class="flex cursor-pointer items-center gap-2.5 font-medium text-gray-800 dark:text-gray-200">
                  <input
                    type="checkbox"
                    :checked="step.selected"
                    class="h-4 w-4 rounded text-primary focus:ring-primary"
                    @change="toggleStep(step)"
                  />
                  <span>{{ step.name }}</span>
                </label>

                <div v-if="step.selected" class="flex items-center gap-2">
                  <span class="text-[11px] text-gray-400">Template:</span>
                  <input
                    v-model="step.template"
                    type="text"
                    class="rounded border border-gray-200 bg-gray-50 p-1 text-[11px] dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 1 Col: Sequence Summary & Submit -->
      <div class="lg:col-span-1">
        <div class="sticky top-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 text-xs space-y-4">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
            <h4 class="text-sm font-bold text-gray-900 dark:text-white">Live Workflow Sequence</h4>
            <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              {{ activeSequence.length }} Steps
            </span>
          </div>

          <div class="space-y-2">
            <div
              v-for="(item, idx) in activeSequence"
              :key="item.id"
              class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/70 p-2.5 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="flex items-center gap-2">
                <span class="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {{ idx + 1 }}
                </span>
                <div>
                  <p class="font-bold text-gray-900 dark:text-white">{{ item.name }}</p>
                  <p class="text-[10px] text-gray-500">{{ item.template }}</p>
                </div>
              </div>
              <button
                type="button"
                class="text-gray-400 hover:text-danger"
                title="Remove Step"
                @click="removeSequenceItem(item)"
              >
                <FeatherIcon name="x" size="13" />
              </button>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4 dark:border-gray-800">
            <button
              type="button"
              :disabled="activeSequence.length === 0 || isSaving"
              class="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
              @click="handleSave"
            >
              <FeatherIcon v-if="!isSaving" name="check" size="14" />
              <span>{{ isSaving ? 'Saving Workflow...' : 'Save & Activate Work Flow' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

