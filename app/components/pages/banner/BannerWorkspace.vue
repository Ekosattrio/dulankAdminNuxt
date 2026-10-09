<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BannerItem, BannerFormData } from '#server/types/banner'
import { useBanners } from '~/composables/useBanners'
import { useTablePrint } from '~/composables/useTablePrint'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import BannerFormModal from '~/components/pages/banner/BannerFormModal.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const { banners, pending, error, refresh, saveBanner, deleteBanner } = useBanners()

// Separate main banners and product banners
const mainBanners = computed(() => {
  return banners.value.filter(
    (b) => b.type === 'main' || (!b.type && !b.position?.toLowerCase().includes('product')),
  )
})

const productBanners = computed(() => {
  return banners.value.filter(
    (b) => b.type === 'product' || (b.position && b.position.toLowerCase().includes('product')),
  )
})

function isVisibleNow(b: BannerItem): boolean {
  if (b.status === 'Inactive') return false
  const now = new Date()
  if (b.start) {
    const s = new Date(b.start)
    if (!isNaN(s.getTime()) && now < s) return false
  }
  if (b.end) {
    const e = new Date(b.end)
    if (!isNaN(e.getTime()) && now > e) return false
  }
  return true
}

function formatScheduleDate(dateStr?: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

// Modal management
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const targetType = ref<'main' | 'product'>('main')
const activeBannerForEdit = ref<BannerItem | null>(null)
const bannerToDelete = ref<BannerItem | null>(null)
const isBusy = ref(false)
const toastMessage = ref('')

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [
  { key: 'title', label: 'Banner Title' },
  { key: 'bannerType', label: 'Type' },
  { key: 'position', label: 'Position' },
  { key: 'startAt', label: 'Start', align: 'center' as const },
  { key: 'endAt', label: 'End', align: 'center' as const },
  { key: 'visibility', label: 'Status', align: 'center' as const },
  { key: 'order', label: 'Order', align: 'center' as const },
]

const printItems = computed(() => banners.value.map((item) => ({
  ...item,
  bannerType: item.type === 'product' || item.position?.toLowerCase().includes('product') ? 'Product' : 'Main',
  startAt: item.start || item.startDate || '-',
  endAt: item.end || item.endDate || '-',
  visibility: isVisibleNow(item) ? 'Active' : 'Inactive',
})))

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

function handleAddMain() {
  targetType.value = 'main'
  isEditMode.value = false
  activeBannerForEdit.value = null
  isFormModalOpen.value = true
}

function handleAddProduct() {
  targetType.value = 'product'
  isEditMode.value = false
  activeBannerForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: BannerItem) {
  targetType.value = item.type || (item.position?.toLowerCase().includes('product') ? 'product' : 'main')
  isEditMode.value = true
  activeBannerForEdit.value = item
  isFormModalOpen.value = true
}

async function handleFormSubmit(formData: BannerFormData) {
  isBusy.value = true
  try {
    const res = await saveBanner(formData)
    isFormModalOpen.value = false
    showToast(res?.message || (isEditMode.value ? 'Banner updated successfully' : 'Banner created successfully'))
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save banner')
  } finally {
    isBusy.value = false
  }
}

async function handleConfirmDelete() {
  if (!bannerToDelete.value) return
  isBusy.value = true
  try {
    await deleteBanner(bannerToDelete.value.id)
    showToast(`Banner '${bannerToDelete.value.title}' deleted successfully`)
    bannerToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete banner')
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="space-y-5">
    <SalesListHeader
      title="Banner"
      subtitle="Manage Main & Product Promotional Banners"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- Toast Notification -->
    <SalesFeedback
      v-if="toastMessage"
      :message="toastMessage"
      @dismiss="toastMessage = ''"
    />

    <!-- Skeleton Loader for 2-Column Banner Layout -->
    <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div
        v-for="col in 2"
        :key="`banner-col-skel-${col}`"
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div class="h-5 w-28 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div class="h-7 w-32 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div
            v-for="item in 2"
            :key="`banner-item-skel-${col}-${item}`"
            class="rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 dark:border-gray-800 dark:bg-gray-800/40 animate-pulse space-y-2.5"
          >
            <div class="h-[120px] w-full rounded-md bg-gray-200 dark:bg-gray-800" />
            <div class="h-3.5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
            <div class="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
            <div class="h-2.5 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
            <div class="h-2.5 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
    >
      <p class="font-semibold mb-2">{{ error ? (error.message || 'Failed to load banners') : '' }}</p>
      <button
        type="button"
        class="rounded-md bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700"
        @click="refresh"
      >
        Retry
      </button>
    </div>

    <!-- Main Content: 2-Column Banner Cards Grid (Main Banner & Product Banner side by side) -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <!-- 1. Main Banner Column -->
      <div class="rounded-xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div class="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
          <h5 class="text-base font-bold text-gray-900 dark:text-white">Main Banner</h5>
          <button
            id="addMainBtn"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-md bg-[#f97316] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#ea580c] transition-colors"
            @click="handleAddMain"
          >
            <FeatherIcon name="plus" :size="13" />
            <span>Add Main Banner</span>
          </button>
        </div>
        <div class="p-4">
          <div v-if="mainBanners.length === 0" class="py-12 text-center text-xs text-gray-400">
            No banners yet.
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="b in mainBanners"
              :key="b.id"
              class="rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 transition hover:shadow-sm dark:border-gray-800 dark:bg-gray-800/40"
            >
              <!-- Thumbnail Container with Badges & Actions -->
              <div class="relative mb-2.5 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                <!-- Status Badge -->
                <span
                  :class="[
                    'absolute top-2 left-2 z-10 rounded px-2 py-0.5 text-[11px] font-semibold text-white shadow-xs',
                    isVisibleNow(b) ? 'bg-[#28c76f]' : 'bg-[#6c757d]'
                  ]"
                >
                  {{ isVisibleNow(b) ? 'Active' : 'Inactive' }}
                </span>

                <!-- Action Buttons -->
                <div class="absolute top-2 right-2 z-10 flex items-center gap-1.5">
                  <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:text-primary transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    title="Edit"
                    @click="handleEdit(b)"
                  >
                    <FeatherIcon name="edit" :size="13" />
                  </button>
                  <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded bg-[#ef4444] text-white shadow-sm hover:bg-red-600 transition-colors"
                    title="Delete"
                    @click="bannerToDelete = b"
                  >
                    <FeatherIcon name="trash-2" :size="13" />
                  </button>
                </div>

                <!-- Banner Image -->
                <a :href="b.src || b.imageUrl" target="_blank" rel="noopener noreferrer" class="block">
                  <img
                    :src="b.src || b.imageUrl"
                    :alt="b.title"
                    class="h-[120px] w-full object-cover transition-transform duration-300 hover:scale-105"
                    @error="($event.target as HTMLImageElement).src = 'https://percetakan-dulank.netlify.app/images/brosur.jpg'"
                  />
                </a>
              </div>

              <!-- Information Details -->
              <div class="space-y-0.5 pt-0.5">
                <strong class="block text-xs font-bold text-gray-900 truncate dark:text-white">
                  {{ b.title }}
                </strong>
                <p class="text-[11px] text-gray-500 truncate dark:text-gray-400 mb-1">
                  {{ b.desc || b.description || '—' }}
                </p>
                <div class="text-[11px] text-gray-500 dark:text-gray-400 space-y-0.5">
                  <div>Start: {{ formatScheduleDate(b.start || b.startDate) }}</div>
                  <div>End: {{ formatScheduleDate(b.end || b.endDate) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Product Banner Column -->
      <div class="rounded-xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div class="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
          <h5 class="text-base font-bold text-gray-900 dark:text-white">Product Banner</h5>
          <button
            id="addProductBtn"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-md bg-[#f97316] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#ea580c] transition-colors"
            @click="handleAddProduct"
          >
            <FeatherIcon name="plus" :size="13" />
            <span>Add Product Banner</span>
          </button>
        </div>
        <div class="p-4">
          <div v-if="productBanners.length === 0" class="py-12 text-center text-xs text-gray-400">
            No banners yet.
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="b in productBanners"
              :key="b.id"
              class="rounded-lg border border-gray-100 bg-gray-50/50 p-2.5 transition hover:shadow-sm dark:border-gray-800 dark:bg-gray-800/40"
            >
              <!-- Thumbnail Container with Badges & Actions -->
              <div class="relative mb-2.5 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                <!-- Status Badge -->
                <span
                  :class="[
                    'absolute top-2 left-2 z-10 rounded px-2 py-0.5 text-[11px] font-semibold text-white shadow-xs',
                    isVisibleNow(b) ? 'bg-[#28c76f]' : 'bg-[#6c757d]'
                  ]"
                >
                  {{ isVisibleNow(b) ? 'Active' : 'Inactive' }}
                </span>

                <!-- Action Buttons -->
                <div class="absolute top-2 right-2 z-10 flex items-center gap-1.5">
                  <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded bg-white text-gray-700 shadow-sm hover:bg-gray-100 hover:text-primary transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    title="Edit"
                    @click="handleEdit(b)"
                  >
                    <FeatherIcon name="edit" :size="13" />
                  </button>
                  <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded bg-[#ef4444] text-white shadow-sm hover:bg-red-600 transition-colors"
                    title="Delete"
                    @click="bannerToDelete = b"
                  >
                    <FeatherIcon name="trash-2" :size="13" />
                  </button>
                </div>

                <!-- Banner Image -->
                <a :href="b.src || b.imageUrl" target="_blank" rel="noopener noreferrer" class="block">
                  <img
                    :src="b.src || b.imageUrl"
                    :alt="b.title"
                    class="h-[120px] w-full object-cover transition-transform duration-300 hover:scale-105"
                    @error="($event.target as HTMLImageElement).src = 'https://percetakan-dulank.netlify.app/images/brosur.jpg'"
                  />
                </a>
              </div>

              <!-- Information Details -->
              <div class="space-y-0.5 pt-0.5">
                <strong class="block text-xs font-bold text-gray-900 truncate dark:text-white">
                  {{ b.title }}
                </strong>
                <p class="text-[11px] text-gray-500 truncate dark:text-gray-400 mb-1">
                  {{ b.desc || b.description || '—' }}
                </p>
                <div class="text-[11px] text-gray-500 dark:text-gray-400 space-y-0.5">
                  <div>Start: {{ formatScheduleDate(b.start || b.startDate) }}</div>
                  <div>End: {{ formatScheduleDate(b.end || b.endDate) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <BannerFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :banner-data="activeBannerForEdit"
      :banner-type="targetType"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!bannerToDelete"
      :busy="isBusy"
      title="Delete Banner"
      :message="`Are you sure you want to delete banner '${bannerToDelete?.title}'?`"
      @close="bannerToDelete = null"
      @confirm="handleConfirmDelete"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Banner Report"
      subtitle="Promotional banner schedule and publication status"
      :columns="printColumns"
      :items="printItems"
      date-field="startAt"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

