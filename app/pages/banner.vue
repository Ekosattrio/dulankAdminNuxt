<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Banners Management" subtitle="Manage store main hero sliders and product promo banners" />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Main Banner Section -->
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <h5 class="font-bold text-gray-900 dark:text-gray-100">Main Banner</h5>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-600"
            @click="openAddModal('main')"
          >
            <CommonFeatherIcon name="plus" size="14" />
            Add Main Banner
          </button>
        </div>
        <div class="space-y-4 p-4">
          <div v-for="b in mainBanners" :key="b.id" class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <div class="relative">
              <img :src="b.src" :alt="b.title" class="h-[180px] w-full object-cover" />
              <span class="absolute left-2 top-2 rounded-md bg-black/75 px-2 py-0.5 text-[11px] text-white">{{ b.id }}</span>
              <div class="absolute right-2 top-2 flex gap-2">
                <button
                  type="button"
                  class="rounded-md bg-white px-2 py-1 text-xs text-gray-700 shadow-sm transition hover:bg-gray-50"
                  title="Edit"
                  @click="openEditModal(b, 'main')"
                >
                  <CommonFeatherIcon name="edit" size="13" />
                </button>
                <button
                  type="button"
                  class="rounded-md bg-rose-600 px-2 py-1 text-xs text-white shadow-sm transition hover:bg-rose-700"
                  title="Delete"
                  @click="deleteBanner(b.id, 'main')"
                >
                  <CommonFeatherIcon name="trash-2" size="13" />
                </button>
              </div>
            </div>
            <div class="p-3">
              <h6 class="mb-1 text-sm font-bold text-gray-900 dark:text-gray-100">{{ b.title || 'Untitled Banner' }}</h6>
              <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">{{ b.desc || 'No description provided' }}</p>
              <div class="flex flex-wrap gap-2 border-t border-gray-100 pt-2 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <span class="inline-flex items-center gap-1">
                  <CommonFeatherIcon name="calendar" size="12" />
                  Start: {{ formatDate(b.start) }}
                </span>
                <span class="inline-flex items-center gap-1">
                  <CommonFeatherIcon name="calendar-x" size="12" />
                  End: {{ formatDate(b.end) }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="mainBanners.length === 0" class="py-8 text-center text-gray-400">
            <p>No main banners added yet.</p>
          </div>
        </div>
      </div>

      <!-- Product Banner Section -->
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <h5 class="font-bold text-gray-900 dark:text-gray-100">Product Banner</h5>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-600"
            @click="openAddModal('product')"
          >
            <CommonFeatherIcon name="plus" size="14" />
            Add Product Banner
          </button>
        </div>
        <div class="space-y-4 p-4">
          <div v-for="b in productBanners" :key="b.id" class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <div class="relative">
              <img :src="b.src" :alt="b.title" class="h-[180px] w-full object-cover" />
              <span class="absolute left-2 top-2 rounded-md bg-black/75 px-2 py-0.5 text-[11px] text-white">{{ b.id }}</span>
              <div class="absolute right-2 top-2 flex gap-2">
                <button
                  type="button"
                  class="rounded-md bg-white px-2 py-1 text-xs text-gray-700 shadow-sm transition hover:bg-gray-50"
                  title="Edit"
                  @click="openEditModal(b, 'product')"
                >
                  <CommonFeatherIcon name="edit" size="13" />
                </button>
                <button
                  type="button"
                  class="rounded-md bg-rose-600 px-2 py-1 text-xs text-white shadow-sm transition hover:bg-rose-700"
                  title="Delete"
                  @click="deleteBanner(b.id, 'product')"
                >
                  <CommonFeatherIcon name="trash-2" size="13" />
                </button>
              </div>
            </div>
            <div class="p-3">
              <h6 class="mb-1 text-sm font-bold text-gray-900 dark:text-gray-100">{{ b.title || 'Untitled Banner' }}</h6>
              <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">{{ b.desc || 'No description provided' }}</p>
              <div class="flex flex-wrap gap-2 border-t border-gray-100 pt-2 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <span class="inline-flex items-center gap-1">
                  <CommonFeatherIcon name="calendar" size="12" />
                  Start: {{ formatDate(b.start) }}
                </span>
                <span class="inline-flex items-center gap-1">
                  <CommonFeatherIcon name="calendar-x" size="12" />
                  End: {{ formatDate(b.end) }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="productBanners.length === 0" class="py-8 text-center text-gray-400">
            <p>No product banners added yet.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Banner Modal -->
    <CommonBaseModal
      v-model="modalVisible"
      :title="`${isEdit ? 'Edit Banner' : 'Add Banner'} (${targetType === 'main' ? 'Main' : 'Product'})`"
      maxWidth="lg"
    >
      <form @submit.prevent="saveBanner" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Image URL">
            <input
              v-model="form.src"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="https://example.com/image.jpg"
              required
            />
          </CommonFormField>
          <CommonFormField label="Upload Preset">
            <select class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" @change="applySampleImage($event)">
              <option value="">Select Sample...</option>
              <option value="https://percetakan-dulank.netlify.app/images/brosur.jpg">Brosur Promo</option>
              <option value="https://percetakan-dulank.netlify.app/images/yasin.jpg">Buku Yasin</option>
              <option value="https://percetakan-dulank.netlify.app/images/kaos.jpg">Kaos Custom</option>
            </select>
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Title">
            <input
              v-model="form.title"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Optional promo title"
            />
          </CommonFormField>
          <CommonFormField label="Description">
            <input
              v-model="form.desc"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Optional description / tagline"
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Start Date & Time">
            <input v-model="form.start" type="datetime-local" class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
          </CommonFormField>
          <CommonFormField label="End Date & Time">
            <input v-model="form.end" type="datetime-local" class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" />
          </CommonFormField>
        </div>
        <CommonFormField label="Banner Preview">
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-2 text-center dark:border-gray-700 dark:bg-gray-800/40">
            <img
              v-if="form.src"
              :src="form.src"
              alt="Banner Preview"
              class="mx-auto max-h-[200px] rounded object-contain"
            />
            <span v-else class="text-xs text-gray-400">No image URL specified</span>
          </div>
        </CommonFormField>
        <CommonModalFooter :submit-label="isEdit ? 'Update Banner' : 'Submit Banner'" @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref } from 'vue'

const { data: bannerData } = await useFetch<{ mainBanners: BannerItem[]; productBanners: BannerItem[] }>('/api/banner')
const mainBanners = ref<BannerItem[]>(bannerData.value?.mainBanners ?? [])

const productBanners = ref<BannerItem[]>(bannerData.value?.productBanners ?? [])

const modalVisible = ref(false)
const isEdit = ref(false)
const targetType = ref<'main' | 'product'>('main')
const currentId = ref<string | null>(null)

const form = ref({
  src: '',
  title: '',
  desc: '',
  start: '',
  end: ''
})

function formatDate(val: string) {
  if (!val) return '-'
  try {
    const d = new Date(val)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return val
  }
}

function openAddModal(type: 'main' | 'product') {
  isEdit.value = false
  targetType.value = type
  currentId.value = null
  form.value = {
    src: 'https://percetakan-dulank.netlify.app/images/brosur.jpg',
    title: '',
    desc: '',
    start: new Date().toISOString().slice(0, 16),
    end: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16)
  }
  modalVisible.value = true
}

function openEditModal(b: BannerItem, type: 'main' | 'product') {
  isEdit.value = true
  targetType.value = type
  currentId.value = b.id
  form.value = {
    src: b.src,
    title: b.title,
    desc: b.desc,
    start: b.start ? b.start.slice(0, 16) : '',
    end: b.end ? b.end.slice(0, 16) : ''
  }
  modalVisible.value = true
}

function applySampleImage(e: Event) {
  const select = e.target as HTMLSelectElement
  if (select.value) {
    form.value.src = select.value
  }
}

function closeModal() {
  modalVisible.value = false
}

function saveBanner() {
  const targetList = targetType.value === 'main' ? mainBanners : productBanners
  if (isEdit.value && currentId.value !== null) {
    const idx = targetList.value.findIndex(b => b.id === currentId.value)
    if (idx !== -1) {
      targetList.value[idx] = {
        ...targetList.value[idx],
        src: form.value.src,
        title: form.value.title,
        desc: form.value.desc,
        start: form.value.start,
        end: form.value.end
      }
    }
  } else {
    const prefix = targetType.value === 'main' ? 'm' : 'p'
    const newId = `${prefix}${Date.now()}`
    targetList.value.push({
      id: newId,
      src: form.value.src,
      title: form.value.title,
      desc: form.value.desc,
      start: form.value.start,
      end: form.value.end,
      created: new Date().toISOString()
    })
  }
  closeModal()
}

function deleteBanner(id: string, type: 'main' | 'product') {
  if (confirm('Are you sure you want to delete this banner?')) {
    if (type === 'main') {
      mainBanners.value = mainBanners.value.filter(b => b.id !== id)
    } else {
      productBanners.value = productBanners.value.filter(b => b.id !== id)
    }
  }
}
</script>
=======
<script setup lang="ts">
import BannerWorkspace from '~/components/pages/banner/BannerWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Banner - Percetakan Dulank',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-banner p-4 md:p-6">
    <BannerWorkspace />
  </div>
</template>
>>>>>>> origin/eko
