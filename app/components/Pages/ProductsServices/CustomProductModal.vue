<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { formControlClass } from '~/utils/salesUi'

export interface CustomProductOption {
  label: string
  enabled: boolean
  isDefault: boolean
}

export interface CustomProductFormModel {
  id?: string
  name: string
  sizes: CustomProductOption[]
  papers: CustomProductOption[]
  laminates: CustomProductOption[]
  printSides: CustomProductOption[]
  folds: CustomProductOption[]
  description: string
  images: string[]
  displayPos: boolean
  displayWebsite: boolean
}

const props = defineProps<{
  open: boolean
  title?: string
  initialData?: CustomProductFormModel | null
  busy?: boolean
  error?: string
  isCalender?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: CustomProductFormModel]
}>()

const defaultSizes = () => [
  { label: 'A4 (297x210mm)', enabled: true, isDefault: true },
  { label: 'A5 (210x149mm)', enabled: true, isDefault: false },
  { label: 'A3 (297x420mm)', enabled: false, isDefault: false },
]

const defaultPapers = () => [
  { label: 'Art Paper', enabled: true, isDefault: true },
  { label: 'Art Carton', enabled: true, isDefault: false },
  { label: 'HVS', enabled: true, isDefault: false },
  { label: 'Carton BC', enabled: false, isDefault: false },
]

const defaultLaminates = () => [
  { label: 'Glossy', enabled: true, isDefault: true },
  { label: 'Doff', enabled: true, isDefault: false },
  { label: 'UV Vernish', enabled: false, isDefault: false },
  { label: 'Spot UV', enabled: false, isDefault: false },
]

const defaultPrintSides = () => [
  { label: 'Cetak 1 Sisi', enabled: true, isDefault: true },
  { label: 'Cetak Bolak Balik', enabled: true, isDefault: false },
]

const defaultFolds = (isCalender = false) => isCalender
  ? [
      { label: 'Spiral Kawat Hitam', enabled: true, isDefault: true },
      { label: 'Spiral Kawat Putih', enabled: true, isDefault: false },
      { label: 'Jepit Kaleng (Klemseng)', enabled: true, isDefault: false },
      { label: 'Mata Ikan', enabled: false, isDefault: false },
    ]
  : [
      { label: 'Tanpa Lipatan', enabled: true, isDefault: true },
      { label: '1 Lipatan', enabled: true, isDefault: false },
      { label: '2 Lipatan', enabled: true, isDefault: false },
      { label: '3 Lipatan', enabled: false, isDefault: false },
    ]

const form = reactive<CustomProductFormModel>({
  name: '',
  sizes: defaultSizes(),
  papers: defaultPapers(),
  laminates: defaultLaminates(),
  printSides: defaultPrintSides(),
  folds: defaultFolds(),
  description: '',
  images: [],
  displayPos: false,
  displayWebsite: true,
})

const sizeEnabled = ref(true)
const paperEnabled = ref(true)
const laminateEnabled = ref(true)
const printSideEnabled = ref(true)
const foldEnabled = ref(true)

watch(() => [props.open, props.initialData] as const, () => {
  if (!props.open) return
  if (props.initialData) {
    form.id = props.initialData.id
    form.name = props.initialData.name
    form.sizes = props.initialData.sizes?.length ? structuredClone(props.initialData.sizes) : defaultSizes()
    form.papers = props.initialData.papers?.length ? structuredClone(props.initialData.papers) : defaultPapers()
    form.laminates = props.initialData.laminates?.length ? structuredClone(props.initialData.laminates) : defaultLaminates()
    form.printSides = props.initialData.printSides?.length ? structuredClone(props.initialData.printSides) : defaultPrintSides()
    form.folds = props.initialData.folds?.length ? structuredClone(props.initialData.folds) : defaultFolds(props.isCalender)
    form.description = props.initialData.description || ''
    form.images = props.initialData.images?.length ? [...props.initialData.images] : ['/assets/img/products/brosur.png']
    form.displayPos = props.initialData.displayPos ?? false
    form.displayWebsite = props.initialData.displayWebsite ?? true
  } else {
    form.id = undefined
    form.name = ''
    form.sizes = defaultSizes()
    form.papers = defaultPapers()
    form.laminates = defaultLaminates()
    form.printSides = defaultPrintSides()
    form.folds = defaultFolds(props.isCalender)
    form.description = ''
    form.images = ['/assets/img/products/brosur.png']
    form.displayPos = false
    form.displayWebsite = true
  }
}, { immediate: true })

function setDefault(group: CustomProductOption[], target: CustomProductOption) {
  if (!target.enabled) return
  for (const opt of group) {
    opt.isDefault = (opt.label === target.label)
  }
}

function removeImage(index: number) {
  form.images.splice(index, 1)
}

function handleImageUpload(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        form.images.push(event.target.result)
      }
    }
    const file = files[i]
    if (file) reader.readAsDataURL(file)
  }
}

function submit() {
  emit('submit', structuredClone(toRaw(form)))
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="title || (initialData?.id ? 'Edit Product' : 'Add New Product')"
    large
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-6" @submit.prevent="submit">
      <p v-if="error" role="alert" class="rounded-md bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
        {{ error }}
      </p>

      <!-- Product Name -->
      <div class="grid grid-cols-12 items-center gap-3">
        <label class="col-span-12 sm:col-span-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Product Name</label>
        <div class="col-span-12 sm:col-span-9">
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Masukkan nama produk custom..."
            :class="formControlClass"
          />
        </div>
      </div>

      <div class="border-t border-gray-100 pt-4 dark:border-gray-800">
        <h4 class="text-sm font-bold italic text-gray-800 dark:text-gray-200 mb-4">Option Spesification</h4>

        <!-- Ukuran -->
        <div class="mb-5 rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Ukuran</span>
            <button
              type="button"
              :class="['relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none', sizeEnabled ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700']"
              @click="sizeEnabled = !sizeEnabled"
            >
              <span :class="['pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', sizeEnabled ? 'translate-x-4' : 'translate-x-0']" />
            </button>
            <span class="text-xs text-gray-500">{{ sizeEnabled ? 'Enable' : 'Disabled' }}</span>
          </div>

          <div v-if="sizeEnabled" class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            <div
              v-for="opt in form.sizes"
              :key="opt.label"
              class="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900"
            >
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="opt.enabled" type="checkbox" class="size-4 rounded border-gray-300 text-primary" />
                <span :class="opt.enabled ? 'text-primary font-medium' : 'text-gray-400'">{{ opt.label }}</span>
              </label>
              <button
                type="button"
                :disabled="!opt.enabled"
                class="flex items-center gap-1 text-[11px] disabled:opacity-40"
                @click="setDefault(form.sizes, opt)"
              >
                <FeatherIcon name="star" :size="13" :class="opt.isDefault ? 'fill-amber-400 text-amber-500' : 'text-gray-400'" />
                <span :class="opt.isDefault ? 'font-semibold text-amber-600' : 'text-gray-400'">Default</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Jenis Kertas -->
        <div class="mb-5 rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Jenis Kertas</span>
            <button
              type="button"
              :class="['relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out', paperEnabled ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700']"
              @click="paperEnabled = !paperEnabled"
            >
              <span :class="['pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200', paperEnabled ? 'translate-x-4' : 'translate-x-0']" />
            </button>
            <span class="text-xs text-gray-500">{{ paperEnabled ? 'Enable' : 'Disabled' }}</span>
          </div>

          <div v-if="paperEnabled" class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            <div
              v-for="opt in form.papers"
              :key="opt.label"
              class="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900"
            >
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="opt.enabled" type="checkbox" class="size-4 rounded border-gray-300 text-primary" />
                <span :class="opt.enabled ? 'text-primary font-medium' : 'text-gray-400'">{{ opt.label }}</span>
              </label>
              <button
                type="button"
                :disabled="!opt.enabled"
                class="flex items-center gap-1 text-[11px] disabled:opacity-40"
                @click="setDefault(form.papers, opt)"
              >
                <FeatherIcon name="star" :size="13" :class="opt.isDefault ? 'fill-amber-400 text-amber-500' : 'text-gray-400'" />
                <span :class="opt.isDefault ? 'font-semibold text-amber-600' : 'text-gray-400'">Default</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Laminasi -->
        <div class="mb-5 rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Laminasi</span>
            <button
              type="button"
              :class="['relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200', laminateEnabled ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700']"
              @click="laminateEnabled = !laminateEnabled"
            >
              <span :class="['pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200', laminateEnabled ? 'translate-x-4' : 'translate-x-0']" />
            </button>
            <span class="text-xs text-gray-500">{{ laminateEnabled ? 'Enable' : 'Disabled' }}</span>
          </div>

          <div v-if="laminateEnabled" class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            <div
              v-for="opt in form.laminates"
              :key="opt.label"
              class="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900"
            >
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="opt.enabled" type="checkbox" class="size-4 rounded border-gray-300 text-primary" />
                <span :class="opt.enabled ? 'text-primary font-medium' : 'text-gray-400'">{{ opt.label }}</span>
              </label>
              <button
                type="button"
                :disabled="!opt.enabled"
                class="flex items-center gap-1 text-[11px] disabled:opacity-40"
                @click="setDefault(form.laminates, opt)"
              >
                <FeatherIcon name="star" :size="13" :class="opt.isDefault ? 'fill-amber-400 text-amber-500' : 'text-gray-400'" />
                <span :class="opt.isDefault ? 'font-semibold text-amber-600' : 'text-gray-400'">Default</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sisi Cetak -->
        <div class="mb-5 rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Sisi Cetak</span>
            <button
              type="button"
              :class="['relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200', printSideEnabled ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700']"
              @click="printSideEnabled = !printSideEnabled"
            >
              <span :class="['pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200', printSideEnabled ? 'translate-x-4' : 'translate-x-0']" />
            </button>
            <span class="text-xs text-gray-500">{{ printSideEnabled ? 'Enable' : 'Disabled' }}</span>
          </div>

          <div v-if="printSideEnabled" class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            <div
              v-for="opt in form.printSides"
              :key="opt.label"
              class="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900"
            >
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="opt.enabled" type="checkbox" class="size-4 rounded border-gray-300 text-primary" />
                <span :class="opt.enabled ? 'text-primary font-medium' : 'text-gray-400'">{{ opt.label }}</span>
              </label>
              <button
                type="button"
                :disabled="!opt.enabled"
                class="flex items-center gap-1 text-[11px] disabled:opacity-40"
                @click="setDefault(form.printSides, opt)"
              >
                <FeatherIcon name="star" :size="13" :class="opt.isDefault ? 'fill-amber-400 text-amber-500' : 'text-gray-400'" />
                <span :class="opt.isDefault ? 'font-semibold text-amber-600' : 'text-gray-400'">Default</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Lipatan / Binding -->
        <div class="mb-5 rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ isCalender ? 'Binding / Hanger' : 'Lipatan' }}</span>
            <button
              type="button"
              :class="['relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200', foldEnabled ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700']"
              @click="foldEnabled = !foldEnabled"
            >
              <span :class="['pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200', foldEnabled ? 'translate-x-4' : 'translate-x-0']" />
            </button>
            <span class="text-xs text-gray-500">{{ foldEnabled ? 'Enable' : 'Disabled' }}</span>
          </div>

          <div v-if="foldEnabled" class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            <div
              v-for="opt in form.folds"
              :key="opt.label"
              class="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900"
            >
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="opt.enabled" type="checkbox" class="size-4 rounded border-gray-300 text-primary" />
                <span :class="opt.enabled ? 'text-primary font-medium' : 'text-gray-400'">{{ opt.label }}</span>
              </label>
              <button
                type="button"
                :disabled="!opt.enabled"
                class="flex items-center gap-1 text-[11px] disabled:opacity-40"
                @click="setDefault(form.folds, opt)"
              >
                <FeatherIcon name="star" :size="13" :class="opt.isDefault ? 'fill-amber-400 text-amber-500' : 'text-gray-400'" />
                <span :class="opt.isDefault ? 'font-semibold text-amber-600' : 'text-gray-400'">Default</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Article -->
      <div class="grid grid-cols-12 items-start gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <label class="col-span-12 sm:col-span-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Content Article</label>
        <div class="col-span-12 sm:col-span-9">
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full rounded-md border border-gray-300 bg-white p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900"
            placeholder="Tulis deskripsi atau artikel ringkas produk..."
          />
        </div>
      </div>

      <!-- Images Preview & Upload -->
      <div class="grid grid-cols-12 items-start gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <label class="col-span-12 sm:col-span-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Product Images</label>
        <div class="col-span-12 sm:col-span-9 space-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <div
              v-for="(img, idx) in form.images"
              :key="idx"
              class="relative size-20 rounded border border-gray-200 overflow-hidden bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
            >
              <img :src="img" alt="Product preview" class="size-full object-cover" />
              <button
                type="button"
                class="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-red-600 text-white text-[11px] shadow hover:bg-red-700"
                @click="removeImage(idx)"
              >
                ✕
              </button>
            </div>

            <label class="flex size-20 cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 bg-white text-gray-500 hover:border-amber-500 hover:text-amber-600 dark:border-gray-700 dark:bg-gray-900">
              <FeatherIcon name="plus" :size="18" />
              <span class="mt-1 text-[10px] font-semibold">Add Image</span>
              <input type="file" accept="image/*" multiple class="hidden" @change="handleImageUpload" />
            </label>
          </div>
        </div>
      </div>

      <!-- Display Options -->
      <div class="grid grid-cols-12 items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <label class="col-span-12 sm:col-span-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Display</label>
        <div class="col-span-12 sm:col-span-9 flex items-center gap-6">
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input v-model="form.displayPos" type="checkbox" class="size-4 rounded border-gray-300 text-primary" />
            POS
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input v-model="form.displayWebsite" type="checkbox" class="size-4 rounded border-gray-300 text-primary" />
            Website
          </label>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button
          type="button"
          class="h-9 rounded-md bg-gray-800 px-4 text-sm font-semibold text-white hover:bg-gray-700"
          :disabled="busy"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="h-9 rounded-md bg-amber-500 px-5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          :disabled="busy"
        >
          {{ busy ? 'Saving...' : 'Submit' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

