<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  store: string
  itemCode: string
  name: string
  category: string
  subCategory: string
  unit: string
  sellingType: string
  description: string
  categories: string[]
  subCategories: string[]
  units: string[]
  stores: string[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:store': [value: string]
  'update:itemCode': [value: string]
  'update:name': [value: string]
  'update:category': [value: string]
  'update:subCategory': [value: string]
  'update:unit': [value: string]
  'update:sellingType': [value: string]
  'update:description': [value: string]
  'generate-code': []
  'add-category': []
  'add-sub-category': []
  'add-unit': []
}>()

const sellingTypes = ['Single Price', 'Size Calculation', 'Quantity Tier', 'Lenovo', 'Electronics']
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
      <!-- Store -->
      <div class="lg:col-span-6">
        <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Store</label>
        <select
          :value="store"
          :disabled="disabled"
          :class="formControlClass"
          @change="emit('update:store', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Choose</option>
          <option v-for="s in stores" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <!-- Item Code with Generate Button -->
      <div class="lg:col-span-6">
        <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Item Code</label>
        <div class="flex gap-2">
          <input
            :value="itemCode"
            type="text"
            placeholder="Generated automatically when empty"
            :disabled="disabled"
            :class="formControlClass"
            class="font-mono"
            @input="emit('update:itemCode', ($event.target as HTMLInputElement).value)"
          />
          <button
            type="button"
            :disabled="disabled"
            class="inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none disabled:opacity-50"
            @click="emit('generate-code')"
          >
            Generate Code
          </button>
        </div>
      </div>

      <!-- Product Name -->
      <div class="lg:col-span-6">
        <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
          Product Name <span class="text-red-500">*</span>
        </label>
        <input
          :value="name"
          type="text"
          required
          placeholder="e.g. Flexy Banner 280gr"
          :disabled="disabled"
          :class="formControlClass"
          @input="emit('update:name', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- Category + Add New -->
      <div class="lg:col-span-3">
        <div class="mb-1 flex items-center justify-between">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Category</label>
          <button
            type="button"
            class="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline focus:outline-none"
            @click="emit('add-category')"
          >
            <FeatherIcon name="plus-circle" :size="12" />
            <span>Add New</span>
          </button>
        </div>
        <select
          :value="category"
          :disabled="disabled"
          :class="formControlClass"
          @change="emit('update:category', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <!-- Sub Category + Add New -->
      <div class="lg:col-span-3">
        <div class="mb-1 flex items-center justify-between">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Sub Category</label>
          <button
            type="button"
            class="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline focus:outline-none"
            @click="emit('add-sub-category')"
          >
            <FeatherIcon name="plus-circle" :size="12" />
            <span>Add New</span>
          </button>
        </div>
        <select
          :value="subCategory"
          :disabled="disabled"
          :class="formControlClass"
          @change="emit('update:subCategory', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="sc in subCategories" :key="sc" :value="sc">{{ sc }}</option>
        </select>
      </div>

      <!-- Unit -->
      <div class="lg:col-span-6">
        <div class="mb-1 flex items-center justify-between">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Unit</label>
          <button
            type="button"
            class="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline focus:outline-none"
            @click="emit('add-unit')"
          >
            <FeatherIcon name="plus-circle" :size="12" />
            <span>Add New</span>
          </button>
        </div>
        <select
          :value="unit"
          :disabled="disabled"
          :class="formControlClass"
          @change="emit('update:unit', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Choose</option>
          <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
        </select>
      </div>

      <!-- Selling Type -->
      <div class="lg:col-span-6">
        <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Selling Type</label>
        <select
          :value="sellingType"
          :disabled="disabled"
          :class="formControlClass"
          @change="emit('update:sellingType', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Choose</option>
          <option v-for="st in sellingTypes" :key="st" :value="st">{{ st }}</option>
        </select>
      </div>

      <!-- Description -->
      <div class="lg:col-span-12">
        <div class="mb-1 flex items-center justify-between">
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Description</label>
          <span class="text-[11px] text-gray-400">Maximum 60 Characters</span>
        </div>
        <textarea
          :value="description"
          rows="3"
          placeholder="Enter product description..."
          :disabled="disabled"
          class="w-full rounded-md border border-gray-200 bg-white p-2.5 text-xs text-gray-800 shadow-sm outline-none transition hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          @input="emit('update:description', ($event.target as HTMLTextAreaElement).value)"
        />
      </div>
    </div>
  </div>
</template>
