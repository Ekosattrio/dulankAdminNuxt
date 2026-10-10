<script setup lang="ts">
import type { WorkFlow, WorkFlowFormData, WorkFlowStepItem } from '#server/types/work-flow'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import SalesDialog from '~/components/Sales/SalesDialog.vue'

const props = defineProps<{
  initialData?: WorkFlow | null
  isEdit?: boolean
  busy?: boolean
}>()

const emit = defineEmits<{
  submit: [data: WorkFlowFormData]
  cancel: []
}>()

interface FlowItemDefinition {
  id: string
  name: string
  category: string
  templates: string[]
}

const defaultFlows: FlowItemDefinition[] = [
  // Design
  { id: 'design-artwork', name: 'Artwork', category: 'Design', templates: ['Multilith A', 'Multilith B', 'Standard Ready Print'] },
  { id: 'design-editing', name: 'Editing', category: 'Design', templates: ['Color Proof', 'Layout Adjustment'] },
  // Cetak
  { id: 'cetak-sm52', name: 'Mesin Sm52', category: 'Cetak', templates: ['SM52 4 Warna', 'SM52 1 Warna', 'SM52 Bolak-Balik'] },
  { id: 'cetak-multilith', name: 'Mesin Multilith', category: 'Cetak', templates: ['Multilith A', 'Multilith B'] },
  { id: 'cetak-myjet', name: 'Myjet Outdoor Km512', category: 'Cetak', templates: ['Outdoor Hi-Res 720dpi', 'Outdoor Draft Mode'] },
  { id: 'cetak-xerox', name: 'Cetak Xerox C800', category: 'Cetak', templates: ['A3+ Art Paper 260', 'A3+ Stiker Kromo'] },
  // PraCetak
  { id: 'pracetak-klise', name: 'Klise', category: 'PraCetak', templates: ['Klise Sablon 1 Warna', 'Klise Sablon Full Color'] },
  { id: 'pracetak-pisopond', name: 'Piso Pond', category: 'PraCetak', templates: ['Pond Kotak Standar', 'Custom Die Cut'] },
  { id: 'pracetak-ctp', name: 'Plat CTP', category: 'PraCetak', templates: ['CTP SM52', 'CTP Oliver58'] },
  // Finishing
  { id: 'finishing-glossy', name: 'Glossy', category: 'Finishing', templates: ['Thermal Glossy 1 Sisi', 'Thermal Glossy 2 Sisi'] },
  { id: 'finishing-doff', name: 'Doff', category: 'Finishing', templates: ['Thermal Doff 1 Sisi', 'Thermal Doff 2 Sisi'] },
  { id: 'finishing-poliemas', name: 'Poli Emas', category: 'Finishing', templates: ['Hot Stamping Gold', 'Hot Stamping Silver'] },
  { id: 'finishing-potong', name: 'Potong', category: 'Finishing', templates: ['Potong Sisir', 'Potong Standar'] },
  { id: 'finishing-lipat', name: 'Lipat', category: 'Finishing', templates: ['Lipat 2 (Half Fold)', 'Lipat 3 (Z-Fold)'] },
  { id: 'finishing-sortir', name: 'Sortir', category: 'Finishing', templates: ['Quality Control Manual', 'Counting Inspection'] },
  { id: 'finishing-packing', name: 'Packing', category: 'Finishing', templates: ['Kardus Dulank', 'Wrapping Plastik'] },
]

const categories = ['Offset', 'Large Format', 'Digital A3+', 'Sablon']
const flowCategories = ['Design', 'Cetak', 'PraCetak', 'Finishing']

const form = ref<WorkFlowFormData>({
  no: '',
  product: '',
  category: 'Offset',
  workflowSteps: '',
  steps: [],
})

const flowsList = ref<FlowItemDefinition[]>([...defaultFlows])
const arrangedFlows = ref<WorkFlowStepItem[]>([])

// Template UI control states
const showTemplateSelect = ref<Record<string, boolean>>({})
const selectedTemplates = ref<Record<string, string>>({})

// Product live search
const productSearchOpen = ref(false)
const availableProducts = [
  { name: 'Brosur A5', code: '001004', category: 'Offset' },
  { name: 'Spanduk Banner', code: '001001', category: 'Large Format' },
  { name: 'Kartu Nama', code: '001002', category: 'Digital A3+' },
  { name: 'Kaos Distro', code: '001005', category: 'Sablon' },
  { name: 'Buku Yasin', code: '001006', category: 'Offset' },
  { name: 'Poster Display', code: '001007', category: 'Large Format' },
  { name: 'Undangan Pernikahan', code: '001008', category: 'Digital A3+' },
  { name: 'Kwitansi NCR 3 Ply', code: '001009', category: 'Offset' },
  { name: 'Goodie Bag', code: '001010', category: 'Sablon' },
  { name: 'Stiker Vinyl', code: '001011', category: 'Large Format' },
  { name: 'Kop Surat', code: '001012', category: 'Offset' },
  { name: 'Sertifikat A4', code: '001013', category: 'Digital A3+' },
]

const filteredProducts = computed(() => {
  const q = form.value.product?.trim().toLowerCase() || ''
  if (!q) return availableProducts.slice(0, 5)
  return availableProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
  )
})

function selectProduct(p: { name: string; category?: string }) {
  form.value.product = p.name
  if (p.category && categories.includes(p.category)) {
    form.value.category = p.category
  }
  productSearchOpen.value = false
}

// Modals
const showAddFlowNameModal = ref(false)
const showAddFlowCategoryModal = ref(false)

const newFlowNameForm = ref({
  name: '',
  category: 'Design',
  incentive: '',
  unitIncentive: 'Per Job',
  assigneeType: 'employee',
  assigneeName: '',
  flowType: 'In-House',
})

const newFlowCategoryForm = ref({
  category: '',
})

// Initialize from props
watch(
  () => props.initialData,
  (data) => {
    if (data) {
      form.value = {
        id: data.id,
        no: data.no,
        date: data.date,
        product: data.product,
        category: data.category || 'Offset',
        workflowSteps: data.workflowSteps || '',
        steps: data.steps || [],
      }

      if (data.steps && data.steps.length > 0) {
        arrangedFlows.value = [...data.steps]
        data.steps.forEach((s) => {
          if (s.template) {
            selectedTemplates.value[s.name] = s.template
            showTemplateSelect.value[s.name] = true
          }
        })
      } else if (data.workflowSteps) {
        const names = data.workflowSteps.split(',').map((s) => s.trim()).filter(Boolean)
        arrangedFlows.value = names.map((name) => {
          const match = flowsList.value.find((f) => f.name.toLowerCase() === name.toLowerCase())
          return {
            id: match?.id || name.toLowerCase().replace(/\s+/g, '-'),
            name: match?.name || name,
            category: match?.category || 'Cetak',
            template: '',
            selected: true,
          }
        })
      }
    } else {
      form.value = {
        product: '',
        category: 'Offset',
        workflowSteps: '',
        steps: [],
      }
      arrangedFlows.value = []
    }
  },
  { immediate: true },
)

function isFlowChecked(flow: FlowItemDefinition): boolean {
  return arrangedFlows.value.some((item) => item.name.toLowerCase() === flow.name.toLowerCase())
}

function handleFlowCheckboxToggle(flow: FlowItemDefinition) {
  const index = arrangedFlows.value.findIndex(
    (item) => item.name.toLowerCase() === flow.name.toLowerCase(),
  )

  if (index !== -1) {
    // Uncheck & remove
    arrangedFlows.value.splice(index, 1)
    showTemplateSelect.value[flow.name] = false
    selectedTemplates.value[flow.name] = ''
  } else {
    // Check & add to arranged
    arrangedFlows.value.push({
      id: flow.id,
      name: flow.name,
      category: flow.category,
      template: selectedTemplates.value[flow.name] || '',
      selected: true,
    })
  }
}

function toggleFlowTemplate(flow: FlowItemDefinition) {
  showTemplateSelect.value[flow.name] = !showTemplateSelect.value[flow.name]
}

function resetFlowTemplate(flow: FlowItemDefinition) {
  showTemplateSelect.value[flow.name] = false
  selectedTemplates.value[flow.name] = ''
  const item = arrangedFlows.value.find(
    (s) => s.name.toLowerCase() === flow.name.toLowerCase(),
  )
  if (item) item.template = ''
}

function handleTemplateChange(flow: FlowItemDefinition) {
  const templateVal = selectedTemplates.value[flow.name] || ''
  const item = arrangedFlows.value.find(
    (s) => s.name.toLowerCase() === flow.name.toLowerCase(),
  )
  if (item) {
    item.template = templateVal
  }
}

function moveUp(index: number) {
  if (index <= 0) return
  const temp = arrangedFlows.value[index]
  const prev = arrangedFlows.value[index - 1]
  if (!temp || !prev) return
  arrangedFlows.value[index] = prev
  arrangedFlows.value[index - 1] = temp
}

function moveDown(index: number) {
  if (index >= arrangedFlows.value.length - 1) return
  const temp = arrangedFlows.value[index]
  const next = arrangedFlows.value[index + 1]
  if (!temp || !next) return
  arrangedFlows.value[index] = next
  arrangedFlows.value[index + 1] = temp
}

function getFlowsByCategory(category: string): FlowItemDefinition[] {
  return flowsList.value.filter((f) => f.category === category)
}

function handleSaveNewFlowName() {
  if (!newFlowNameForm.value.name.trim()) return
  const newId = `custom-flow-${Date.now()}`
  const newItem: FlowItemDefinition = {
    id: newId,
    name: newFlowNameForm.value.name.trim(),
    category: newFlowNameForm.value.category,
    templates: ['Standard Template A', 'Standard Template B'],
  }
  flowsList.value.push(newItem)
  showAddFlowNameModal.value = false
  newFlowNameForm.value.name = ''
}

function handleSaveNewFlowCategory() {
  if (!newFlowCategoryForm.value.category.trim()) return
  const cat = newFlowCategoryForm.value.category.trim()
  if (!flowCategories.includes(cat)) {
    flowCategories.push(cat)
  }
  showAddFlowCategoryModal.value = false
  newFlowCategoryForm.value.category = ''
}

function onSubmit() {
  const workflowString = arrangedFlows.value.map((s) => s.name).join(', ')
  emit('submit', {
    ...form.value,
    workflowSteps: workflowString,
    steps: arrangedFlows.value,
  })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <!-- Left Column: Choose Product & Setting Flow (col-xl-7) -->
      <div class="space-y-6 xl:col-span-7">
        <div class="card rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div class="mb-4 flex items-start justify-between">
            <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100">
              Choose the Product want to arrange work flow
            </h5>
          </div>

          <!-- Product Row -->
          <div class="mb-6 space-y-4">
            <div class="grid grid-cols-1 items-start gap-2 md:grid-cols-12 md:items-center">
              <label class="text-xs font-semibold text-gray-700 md:col-span-3 dark:text-gray-300">
                Product <span class="text-red-500">*</span>
              </label>
              <div class="relative md:col-span-9 lg:col-span-8">
                <div class="mb-1 flex justify-end">
                  <NuxtLink to="/create-product" class="text-xs font-semibold text-amber-500 hover:underline">
                    Add New Product
                  </NuxtLink>
                </div>
                <div class="relative">
                  <input
                    v-model="form.product"
                    type="text"
                    required
                    placeholder="Search Product"
                    class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    @focus="productSearchOpen = true"
                  />
                  <!-- Search results dropdown -->
                  <div
                    v-if="productSearchOpen && filteredProducts.length > 0"
                    class="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div
                      v-for="p in filteredProducts"
                      :key="p.code"
                      class="cursor-pointer px-3 py-2 text-xs transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                      @click="selectProduct(p)"
                    >
                      <div class="font-semibold text-gray-800 dark:text-gray-200">{{ p.name }}</div>
                      <div class="text-[11px] text-gray-500">{{ p.code }} - {{ p.category }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product Category Row -->
            <div class="grid grid-cols-1 items-center gap-2 md:grid-cols-12">
              <label class="text-xs font-semibold text-gray-700 md:col-span-3 dark:text-gray-300">
                Product Category <span class="text-red-500">*</span>
              </label>
              <div class="md:col-span-9 lg:col-span-8">
                <select
                  v-model="form.category"
                  required
                  class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
            </div>

            <!-- Workflow No (Readonly if edit) -->
            <div v-if="form.no" class="grid grid-cols-1 items-center gap-2 md:grid-cols-12">
              <label class="text-xs font-semibold text-gray-700 md:col-span-3 dark:text-gray-300">
                Workflow No
              </label>
              <div class="md:col-span-9 lg:col-span-8">
                <input
                  :value="form.no"
                  disabled
                  class="h-9 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800/50"
                />
              </div>
            </div>
          </div>

          <!-- Section: Setting all flow -->
          <div class="border-t border-gray-200 pt-4 dark:border-gray-700">
            <h5 class="mb-4 text-sm font-bold text-gray-900 dark:text-gray-100">
              Setting all flow to show in default job order
            </h5>

            <!-- Categories Loop -->
            <div class="space-y-6">
              <div
                v-for="cat in flowCategories"
                :key="cat"
                class="border-t border-gray-100 pt-4 first:border-none first:pt-0 dark:border-gray-800"
              >
                <!-- Add New links -->
                <div class="mb-3 flex items-center gap-4 text-xs font-semibold">
                  <button
                    type="button"
                    class="text-amber-500 transition-colors hover:underline focus:outline-none"
                    @click="showAddFlowCategoryModal = true"
                  >
                    Add New Flow Category
                  </button>
                  <button
                    type="button"
                    class="text-amber-500 transition-colors hover:underline focus:outline-none"
                    @click="() => {
                      newFlowNameForm.category = cat
                      showAddFlowNameModal = true
                    }"
                  >
                    Add New Flow Name
                  </button>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-12">
                  <!-- Flow Category info (col-md-4) -->
                  <div class="md:col-span-4">
                    <div class="text-xs text-gray-500 dark:text-gray-400">Flow Category :</div>
                    <div class="mt-0.5 text-sm font-bold text-gray-900 dark:text-gray-100">{{ cat }}</div>
                  </div>

                  <!-- Flow Name list (col-md-8) -->
                  <div class="space-y-3 md:col-span-8">
                    <div class="text-xs text-gray-500 dark:text-gray-400">Flow Name :</div>

                    <div
                      v-for="flow in getFlowsByCategory(cat)"
                      :key="flow.id"
                      class="space-y-2 rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 transition-colors dark:border-gray-800 dark:bg-gray-800/30"
                    >
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <label class="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-800 dark:text-gray-200">
                          <input
                            type="checkbox"
                            :checked="isFlowChecked(flow)"
                            class="h-4 w-4 rounded border-gray-300 text-primary accent-primary focus:ring-primary"
                            @change="handleFlowCheckboxToggle(flow)"
                          />
                          <span>{{ flow.name }}</span>
                        </label>

                        <!-- Action links (show if checked) -->
                        <div v-if="isFlowChecked(flow)" class="flex items-center gap-2 text-xs">
                          <button
                            type="button"
                            class="font-bold text-primary hover:underline focus:outline-none"
                            @click="toggleFlowTemplate(flow)"
                          >
                            {{ showTemplateSelect[flow.name] ? 'Hide Template' : 'Add Flow Template' }}
                          </button>
                          <span class="text-gray-400">|</span>
                          <button
                            type="button"
                            class="font-bold text-red-500 hover:underline focus:outline-none"
                            @click="resetFlowTemplate(flow)"
                          >
                            Reset Template
                          </button>
                        </div>
                      </div>

                      <!-- Template row dropdown -->
                      <div v-if="showTemplateSelect[flow.name]" class="ms-6 space-y-1 pt-1">
                        <label class="block text-[11px] font-semibold text-gray-500">Flow Template</label>
                        <select
                          v-model="selectedTemplates[flow.name]"
                          class="h-8 w-full rounded border border-gray-200 bg-white px-2.5 text-xs text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                          @change="handleTemplateChange(flow)"
                        >
                          <option value="">Choose Flow Template</option>
                          <option v-for="tpl in flow.templates" :key="tpl" :value="tpl">{{ tpl }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Work Flow Arrange (col-xl-5) -->
      <div class="space-y-6 xl:col-span-5">
        <div class="card sticky top-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div class="mb-4 flex items-center justify-between">
            <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100">Work Flow Arrange</h5>
            <span class="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {{ arrangedFlows.length }} Step{{ arrangedFlows.length !== 1 ? 's' : '' }}
            </span>
          </div>

          <!-- Grid Header -->
          <div class="mb-2 grid grid-cols-[70px_1fr_90px] items-center gap-4 border-b border-gray-200 pb-2 text-xs font-bold text-gray-700 dark:border-gray-700 dark:text-gray-300">
            <div>Flow</div>
            <div>Flow Name</div>
            <div class="text-center">Up/Down</div>
          </div>

          <!-- Empty state -->
          <div
            v-if="arrangedFlows.length === 0"
            class="rounded-lg border border-dashed border-gray-200 p-8 text-center text-xs text-gray-400 dark:border-gray-800"
          >
            <p>No workflow steps selected yet.</p>
            <p class="mt-1 text-[11px] text-gray-400">Select checkboxes on the left to add steps into sequence.</p>
          </div>

          <!-- Arrange Rows -->
          <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
            <div
              v-for="(item, index) in arrangedFlows"
              :key="item.id || item.name"
              class="grid grid-cols-[70px_1fr_90px] items-center gap-4 py-2.5 text-xs transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
            >
              <!-- Col 1: Flow No -->
              <div class="font-medium text-gray-500 dark:text-gray-400">
                No. {{ index + 1 }}
              </div>

              <!-- Col 2: Flow Name & Template -->
              <div class="min-w-0">
                <div class="font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</div>
                <div v-if="item.template" class="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  {{ item.template }}
                </div>
              </div>

              <!-- Col 3: Up/Down Buttons -->
              <div class="flex items-center justify-center gap-2">
                <button
                  type="button"
                  :disabled="index === arrangedFlows.length - 1"
                  aria-label="Move down"
                  class="flex h-[34px] w-[34px] items-center justify-center rounded border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  @click="moveDown(index)"
                >
                  <FeatherIcon name="arrow-down" size="14" />
                </button>
                <button
                  type="button"
                  :disabled="index === 0"
                  aria-label="Move up"
                  class="flex h-[34px] w-[34px] items-center justify-center rounded border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  @click="moveUp(index)"
                >
                  <FeatherIcon name="arrow-up" size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Footer -->
    <div class="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
      <NuxtLink
        to="/work-flow"
        class="min-w-24 rounded-md border border-gray-200 bg-white px-5 py-2.5 text-center text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      >
        Cancel
      </NuxtLink>
      <button
        type="submit"
        :disabled="busy || arrangedFlows.length === 0"
        class="min-w-24 rounded-md bg-[#ff9f43] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ busy ? 'Saving...' : 'Save' }}
      </button>
    </div>

    <!-- Modal: Add New Flow Name -->
    <SalesDialog
      :open="showAddFlowNameModal"
      title="Add New Flow Name"
      medium
      @close="showAddFlowNameModal = false"
    >
      <form class="space-y-4" @submit.prevent="handleSaveNewFlowName">
        <!-- Flow Name -->
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <label class="text-xs font-semibold text-gray-700 sm:w-1/3 dark:text-gray-300">
            Flow Name <span class="text-red-500">*</span>
          </label>
          <div class="sm:w-2/3">
            <input
              v-model="newFlowNameForm.name"
              type="text"
              required
              class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        </div>

        <!-- Incentive Amount -->
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <label class="text-xs font-semibold text-gray-700 sm:w-1/3 dark:text-gray-300">
            Incentive Amount
          </label>
          <div class="sm:w-2/3">
            <input
              v-model="newFlowNameForm.incentive"
              type="number"
              placeholder="0"
              class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        </div>

        <!-- Unit Incentive -->
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <label class="text-xs font-semibold text-gray-700 sm:w-1/3 dark:text-gray-300">
            Unit Incentive
          </label>
          <div class="sm:w-2/3">
            <select
              v-model="newFlowNameForm.unitIncentive"
              class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option>Per Job</option>
              <option>Per Meter</option>
              <option>Per Pieces</option>
              <option>Per Ream</option>
            </select>
          </div>
        </div>

        <!-- Flow Category -->
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <label class="text-xs font-semibold text-gray-700 sm:w-1/3 dark:text-gray-300">
            Flow Category
          </label>
          <div class="sm:w-2/3">
            <select
              v-model="newFlowNameForm.category"
              class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option v-for="cat in flowCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </div>

        <!-- Flow Type -->
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <label class="text-xs font-semibold text-gray-700 sm:w-1/3 dark:text-gray-300">
            Flow Type
          </label>
          <div class="flex items-center gap-4 sm:w-2/3">
            <label class="inline-flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
              <input
                v-model="newFlowNameForm.flowType"
                type="radio"
                value="In-House"
                class="text-primary accent-primary"
              />
              <span>In-House</span>
            </label>
            <label class="inline-flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
              <input
                v-model="newFlowNameForm.flowType"
                type="radio"
                value="OutSource"
                class="text-primary accent-primary"
              />
              <span>OutSource</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button
            type="button"
            class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c]"
            @click="showAddFlowNameModal = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334]"
          >
            Submit
          </button>
        </div>
      </form>
    </SalesDialog>

    <!-- Modal: Add New Flow Category -->
    <SalesDialog
      :open="showAddFlowCategoryModal"
      title="Add New Flow Category"
      medium
      @close="showAddFlowCategoryModal = false"
    >
      <form class="space-y-4" @submit.prevent="handleSaveNewFlowCategory">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <label class="text-xs font-semibold text-gray-700 sm:w-1/3 dark:text-gray-300">
            Flow Category <span class="text-red-500">*</span>
          </label>
          <div class="sm:w-2/3">
            <input
              v-model="newFlowCategoryForm.category"
              type="text"
              required
              placeholder="e.g. Sablon Digital"
              class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button
            type="button"
            class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c]"
            @click="showAddFlowCategoryModal = false"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334]"
          >
            Submit
          </button>
        </div>
      </form>
    </SalesDialog>
  </form>
</template>
