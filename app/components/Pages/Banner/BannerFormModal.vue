<script setup lang="ts">
import type { BannerItem, BannerFormData } from '#server/types/banner'
import SalesDialog from '~/components/Sales/SalesDialog.vue'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  bannerData: BannerItem | null
  bannerType?: 'main' | 'product'
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: BannerFormData]
}>()

const form = ref<{
  id: string
  type: 'main' | 'product'
  imageUrl: string
  title: string
  desc: string
  start: string
  end: string
  status: 'Active' | 'Inactive'
}>({
  id: '',
  type: 'main',
  imageUrl: '',
  title: '',
  desc: '',
  start: '',
  end: '',
  status: 'Active',
})

const errorMessage = ref('')
const previewUrl = computed(() => form.value.imageUrl)

function toInputISO(dt?: string) {
  if (!dt) return ''
  const d = new Date(dt)
  if (isNaN(d.getTime())) return ''
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60000)
  return local.toISOString().slice(0, 16)
}

const samplePresets = [
  { name: 'Brosur Promo', url: 'https://percetakan-dulank.netlify.app/images/brosur.jpg' },
  { name: 'Buku Yasin', url: 'https://percetakan-dulank.netlify.app/images/yasin.jpg' },
  { name: 'Kaos Custom', url: 'https://percetakan-dulank.netlify.app/images/kaos.jpg' },
]

watch(
  () => [props.open, props.bannerData, props.bannerType] as const,
  ([isOpen, val, defaultType]) => {
    if (!isOpen) return
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        type: val.type || (val.position?.toLowerCase().includes('product') ? 'product' : 'main'),
        imageUrl: val.imageUrl || val.src || '',
        title: val.title || '',
        desc: val.desc || val.description || '',
        start: toInputISO(val.start || val.startDate),
        end: toInputISO(val.end || val.endDate),
        status: val.status || 'Active',
      }
    } else {
      const now = new Date()
      const endMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      form.value = {
        id: '',
        type: defaultType || 'main',
        imageUrl: 'https://percetakan-dulank.netlify.app/images/brosur.jpg',
        title: '',
        desc: '',
        start: toInputISO(now.toISOString()),
        end: toInputISO(endMonth.toISOString()),
        status: 'Active',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.imageUrl = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function handleSubmit() {
  if (!form.value.imageUrl.trim()) {
    errorMessage.value = 'Please enter an image URL or upload an image file.'
    return
  }

  const payload: BannerFormData = {
    id: form.value.id || undefined,
    type: form.value.type,
    position: form.value.type === 'product' ? 'Product Promo' : 'Main Slider',
    title: form.value.title || (form.value.type === 'product' ? 'Product Banner' : 'Main Banner'),
    imageUrl: form.value.imageUrl,
    src: form.value.imageUrl,
    desc: form.value.desc,
    description: form.value.desc,
    start: form.value.start ? new Date(form.value.start).toISOString() : new Date().toISOString(),
    end: form.value.end ? new Date(form.value.end).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
    startDate: form.value.start ? form.value.start.slice(0, 10) : new Date().toISOString().slice(0, 10),
    endDate: form.value.end ? form.value.end.slice(0, 10) : new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    status: form.value.status,
  }

  emit('submit', payload)
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Banner' : (form.type === 'product' ? 'Add Product Banner' : 'Add Main Banner')"
    medium
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-md bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        <!-- Image URL -->
        <div class="md:col-span-8">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Image URL (or leave blank to upload)
          </label>
          <input
            v-model="form.imageUrl"
            type="text"
            placeholder="https://example.com/image.jpg"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <!-- Upload Image -->
        <div class="md:col-span-4">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-900 file:mr-2 file:rounded file:border-0 file:bg-gray-100 file:px-2 file:py-1 file:text-xs file:font-medium hover:file:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:file:bg-gray-700 dark:file:text-gray-200"
            @change="handleFileUpload"
          />
        </div>

        <!-- Preset Suggestions -->
        <div class="md:col-span-12 flex flex-wrap items-center gap-1.5 -mt-1">
          <span class="text-[11px] text-gray-400">Preset:</span>
          <button
            v-for="p in samplePresets"
            :key="p.name"
            type="button"
            class="rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px] text-gray-600 dark:text-gray-300 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            @click="form.imageUrl = p.url"
          >
            {{ p.name }}
          </button>
        </div>

        <!-- Title -->
        <div class="md:col-span-6">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Optional title"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <!-- Description -->
        <div class="md:col-span-6">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <input
            v-model="form.desc"
            type="text"
            placeholder="Optional description"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <!-- Start Date & Time -->
        <div class="md:col-span-6">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Start (when banner becomes visible)
          </label>
          <input
            v-model="form.start"
            type="datetime-local"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <!-- End Date & Time -->
        <div class="md:col-span-6">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            End (when banner stops being visible)
          </label>
          <input
            v-model="form.end"
            type="datetime-local"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <!-- Preview Box -->
        <div class="md:col-span-12">
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Preview
          </label>
          <div class="flex h-36 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40 p-2 overflow-hidden">
            <img
              v-if="previewUrl"
              :src="previewUrl"
              alt="Banner Preview"
              class="max-h-32 w-auto max-w-full rounded object-cover shadow-sm"
              @error="($event.target as HTMLImageElement).src = 'https://percetakan-dulank.netlify.app/images/brosur.jpg'"
            />
            <span v-else class="text-xs text-gray-400">
              No image selected
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="rounded-md bg-gray-800 px-4 py-2 text-xs font-medium text-white hover:bg-gray-700 transition-colors disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
          :disabled="busy"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-md bg-[#f97316] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#ea580c] transition-colors focus:outline-none disabled:opacity-50"
          :disabled="busy"
        >
          <span v-if="busy">Saving...</span>
          <span v-else>Submit</span>
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
