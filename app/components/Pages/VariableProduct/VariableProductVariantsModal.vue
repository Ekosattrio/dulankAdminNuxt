<script setup lang="ts">
import type { VariableProductItem } from '#server/types/variable-product'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  open: boolean
  product: VariableProductItem | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    size="lg"
    :title="`Variants: ${product?.name || ''}`"
    @close="emit('close')"
  >
    <div v-if="product" class="space-y-4">
      <!-- Product Quick Meta -->
      <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3.5 dark:border-gray-800 dark:bg-gray-800/60">
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold text-gray-900 dark:text-white">{{ product.code }}</span>
            <span class="text-xs text-gray-400">•</span>
            <span class="text-xs text-gray-600 dark:text-gray-300">{{ product.category }}</span>
            <span v-if="product.subCategory" class="text-xs text-gray-400">({{ product.subCategory }})</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Attribute: <strong class="text-gray-700 dark:text-gray-200">{{ product.attributeName }}</strong>
          </p>
        </div>
        <div class="flex items-center gap-4 text-xs">
          <div>
            <span class="text-gray-500">Total Stock:</span>
            <strong class="ml-1 text-gray-900 dark:text-white">{{ product.totalStock.toLocaleString('id-ID') }} {{ product.unit }}</strong>
          </div>
          <div>
            <span class="text-gray-500">Variants:</span>
            <strong class="ml-1 text-gray-900 dark:text-white">{{ product.variants.length }} options</strong>
          </div>
        </div>
      </div>

      <!-- Variants Table -->
      <div class="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead class="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th class="px-4 py-2.5 text-start">#</th>
              <th class="px-4 py-2.5 text-start">Variation</th>
              <th class="px-4 py-2.5 text-start">Variant Value</th>
              <th class="px-4 py-2.5 text-center">Stock ({{ product.unit }})</th>
              <th class="px-4 py-2.5 text-end">Price (IDR)</th>
              <th class="px-4 py-2.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="(v, idx) in product.variants"
              :key="v.id"
              class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40"
            >
              <td class="px-4 py-2 text-gray-400">{{ idx + 1 }}</td>
              <td class="px-4 py-2 font-medium">{{ v.variation }}</td>
              <td class="px-4 py-2">
                <span class="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  {{ v.value }}
                </span>
              </td>
              <td class="px-4 py-2 text-center font-semibold">{{ v.quantity.toLocaleString('id-ID') }}</td>
              <td class="px-4 py-2 text-end">
                <CurrencyDisplay :value="v.price" />
              </td>
              <td class="px-4 py-2 text-center">
                <span
                  :class="[
                    'inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold',
                    v.checked !== false
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  ]"
                >
                  {{ v.checked !== false ? 'Available' : 'Disabled' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Action -->
      <div class="flex items-center justify-between pt-2">
        <NuxtLink
          :to="{ path: '/create-product', query: { id: product.id, type: 'Variable Product' } }"
          class="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-semibold text-white shadow hover:bg-primary/90"
        >
          <FeatherIcon name="edit-2" :size="14" />
          <span>Edit Product Variants</span>
        </NuxtLink>

        <button
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </SalesDialog>
</template>

