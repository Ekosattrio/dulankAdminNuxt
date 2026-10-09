<script setup lang="ts">
import { ref, watch } from 'vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import type { PrefixItem } from '#server/types/system-settings'

const { prefixes, pending, refresh, savePrefixes } = usePrefixes()

interface PrefixFieldDef {
  key: string
  label: string
  defaultPrefix: string
}

const prefixFields: PrefixFieldDef[] = [
  { key: 'product_sku', label: 'Product (SKU)', defaultPrefix: 'SKU - ' },
  { key: 'supplier', label: 'Supplier', defaultPrefix: 'SUP - ' },
  { key: 'purchase', label: 'Purchase', defaultPrefix: 'PU - ' },
  { key: 'purchase_return', label: 'Purchase Return', defaultPrefix: 'PR - ' },
  { key: 'sales', label: 'Sales', defaultPrefix: 'SA - ' },
  { key: 'sales_return', label: 'Sales Return', defaultPrefix: 'SR - ' },
  { key: 'customer', label: 'Customer', defaultPrefix: 'CT - ' },
  { key: 'expense', label: 'Expense', defaultPrefix: 'EX - ' },
  { key: 'stock_transfer', label: 'Stock Transfer', defaultPrefix: 'ST - ' },
  { key: 'stock_adjustment', label: 'Stock Adjustmentt', defaultPrefix: 'SA - ' },
  { key: 'sales_order', label: 'Sales Order', defaultPrefix: 'SO - ' },
  { key: 'pos_invoice', label: 'POS Invoice', defaultPrefix: 'PINV - ' },
  { key: 'estimation', label: 'Estimation', defaultPrefix: 'EST - ' },
  { key: 'transaction', label: 'Transaction', defaultPrefix: 'TRN - ' },
  { key: 'employee', label: 'Employee', defaultPrefix: 'EMP - ' },
]

// Form model binding keyed by field key
const formData = ref<Record<string, string>>({})
const isSaving = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'info'>('success')
let toastTimer: any = null

function showToast(msg: string, type: 'success' | 'info' = 'success') {
  toastMessage.value = msg
  toastType.value = type
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

function initFormData(items: PrefixItem[] = []) {
  const map: Record<string, string> = {}
  prefixFields.forEach((field) => {
    const existing = items.find((i) => i.key === field.key)
    map[field.key] = existing?.prefix ?? field.defaultPrefix
  })
  formData.value = map
}

watch(
  prefixes,
  (val) => {
    if (val && val.length > 0) {
      initFormData(val)
    } else {
      initFormData()
    }
  },
  { immediate: true },
)

function handleCancel() {
  initFormData(prefixes.value || [])
  showToast('Perubahan dibatalkan.', 'info')
}

async function handleSave() {
  isSaving.value = true
  try {
    const updatedList: PrefixItem[] = prefixFields.map((field, idx) => {
      const existing = (prefixes.value || []).find((i) => i.key === field.key)
      return {
        id: existing?.id || `PRF-${String(idx + 1).padStart(2, '0')}`,
        key: field.key,
        name: field.label,
        prefix: formData.value[field.key] ?? field.defaultPrefix,
        format: existing?.format || `${formData.value[field.key] ?? field.defaultPrefix}{YYYY}{MM}-{SEQ:4}`,
        sample: existing?.sample || `${formData.value[field.key] ?? field.defaultPrefix}0001`,
        updatedAt: new Date().toISOString().split('T')[0],
      }
    })

    const res = await savePrefixes(updatedList)
    showToast(res?.message || 'Prefixes updated successfully!', 'success')
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save prefixes.', 'info')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Success / Info Toast -->
    <div
      v-if="toastMessage"
      class="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold text-white shadow-xl transition-all"
      :class="toastType === 'success' ? 'bg-emerald-600' : 'bg-slate-700'"
    >
      <FeatherIcon :name="toastType === 'success' ? 'check-circle' : 'info'" size="16" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Header Section -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h4 class="text-xl font-bold text-gray-900 dark:text-white">Settings</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400">Manage your settings on portal</p>
      </div>

      <!-- Action Icons (Refresh & Collapse) -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          title="Refresh"
          aria-label="Refresh"
          class="inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
          @click="refresh()"
        >
          <FeatherIcon name="rotate-ccw" size="16" :class="{ 'animate-spin': pending }" />
        </button>
        <button
          type="button"
          title="Collapse"
          aria-label="Collapse"
          class="inline-flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <FeatherIcon name="chevron-up" size="16" />
        </button>
      </div>
    </div>

    <!-- Main Card Container -->
    <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Section Title -->
      <div class="mb-6">
        <h3 class="text-base font-bold text-gray-900 dark:text-white">Prefixes</h3>
      </div>

      <!-- Skeleton Loader saat pending -->
      <div v-if="pending" class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="n in 15" :key="n" class="space-y-2">
          <div class="h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
          <div class="h-10 w-full animate-pulse rounded-md bg-slate-100 dark:bg-slate-800"></div>
        </div>
      </div>

      <!-- Form Grid 4 Kolom Sesuai Benchmark -->
      <form v-else @submit.prevent="handleSave">
        <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="field in prefixFields" :key="field.key" class="space-y-1.5">
            <label :for="`prefix-${field.key}`" class="block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {{ field.label }}
            </label>
            <input
              :id="`prefix-${field.key}`"
              v-model="formData[field.key]"
              type="text"
              :placeholder="field.defaultPrefix"
              class="w-full rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <!-- Action Buttons di Kanan Bawah -->
        <div class="mt-8 flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            :disabled="isSaving"
            class="rounded-md bg-slate-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600"
            @click="handleCancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50"
          >
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

