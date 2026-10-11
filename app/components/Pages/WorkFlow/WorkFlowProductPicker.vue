<script setup lang="ts">
import type { WorkFlowEditorProduct } from '#server/types/work-flow'
import { formControlClass } from '~/utils/salesUi'

const props = defineProps<{ product: string; products: WorkFlowEditorProduct[] }>()
defineEmits<{ select: [product: WorkFlowEditorProduct]; 'update:product': [value: string] }>()
const open = ref(false)
const filtered = computed(() => {
  const query = props.product.trim().toLowerCase()
  if (!query) return props.products.slice(0, 8)
  return props.products.filter((item) => [item.name, item.code, item.category].join(' ').toLowerCase().includes(query)).slice(0, 12)
})
</script>

<template>
  <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <h2 class="app-section-title mb-4">Choose the Product want to arrange work flow</h2>
    <div class="space-y-4">
      <div class="grid grid-cols-1 items-start gap-2 md:grid-cols-12 md:items-center">
        <label class="text-xs font-semibold text-gray-700 md:col-span-3 dark:text-gray-300">Product <span class="text-red-500">*</span></label>
        <div class="relative md:col-span-9">
          <div class="mb-1 flex justify-end"><NuxtLink to="/create-product" class="text-xs font-semibold text-amber-500 hover:underline">Add New Product</NuxtLink></div>
          <input :value="product" required placeholder="Search Product" :class="formControlClass" @input="$emit('update:product', ($event.target as HTMLInputElement).value)" @focus="open = true" />
          <div v-if="open && filtered.length" class="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <button v-for="item in filtered" :key="item.id" type="button" class="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700" @click="$emit('select', item); open = false">
              <span class="block font-semibold text-gray-800 dark:text-gray-200">{{ item.name }}</span>
              <span class="text-xs text-gray-500">{{ item.code }} - {{ item.category }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
