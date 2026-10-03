<script setup lang="ts">
import type { ProductVariant } from '#server/types/product'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import QuantityStepper from '~/components/common/QuantityStepper.vue'
import { formControlClass } from '~/utils/salesUi'

export type PriceTypeTab =
  | 'Single Product'
  | 'Variable Product'
  | 'Size Calculation'
  | 'Large Format'
  | 'Offset Service Price'

const props = defineProps<{
  priceType: PriceTypeTab
  quantity: number
  price: number
  minOrderQty: number
  discountType: string
  discountValue: number
  taxType: string
  quantityAlert: number
  minPrice: number
  druckPrice: number
  minLength: number
  minWidth: number
  variants: ProductVariant[]
  selectedAttribute: string
  attributeTags: string[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:priceType': [value: PriceTypeTab]
  'update:quantity': [value: number]
  'update:price': [value: number]
  'update:minOrderQty': [value: number]
  'update:discountType': [value: string]
  'update:discountValue': [value: number]
  'update:taxType': [value: string]
  'update:quantityAlert': [value: number]
  'update:minPrice': [value: number]
  'update:druckPrice': [value: number]
  'update:minLength': [value: number]
  'update:minWidth': [value: number]
  'update:variants': [variants: ProductVariant[]]
  'update:selectedAttribute': [value: string]
  'update:attributeTags': [tags: string[]]
  'open-attribute-modal': []
  'open-variation-modal': [variant: ProductVariant]
}>()

const priceTypeTabs: PriceTypeTab[] = [
  'Single Product',
  'Variable Product',
  'Size Calculation',
  'Large Format',
  'Offset Service Price',
]

const tagInput = ref('')

function addTag() {
  const val = tagInput.value.trim()
  if (val && !props.attributeTags.includes(val)) {
    const nextTags = [...props.attributeTags, val]
    emit('update:attributeTags', nextTags)
    // Also auto-add to variants table if not existing
    const newVariant: ProductVariant = {
      id: String(Date.now() + Math.random()),
      variation: props.selectedAttribute || 'Color',
      value: val,
      quantity: 1,
      price: props.price || 50000,
      checked: true,
    }
    emit('update:variants', [...props.variants, newVariant])
  }
  tagInput.value = ''
}

function removeTag(tag: string) {
  const nextTags = props.attributeTags.filter((t) => t !== tag)
  emit('update:attributeTags', nextTags)
  const nextVariants = props.variants.filter((v) => v.value !== tag)
  emit('update:variants', nextVariants)
}

function updateVariantQty(index: number, qty: number) {
  const list = [...props.variants]
  if (list[index]) {
    list[index] = { ...list[index], quantity: qty }
    emit('update:variants', list)
  }
}

function updateVariantPrice(index: number, prc: number) {
  const list = [...props.variants]
  if (list[index]) {
    list[index] = { ...list[index], price: prc }
    emit('update:variants', list)
  }
}

function toggleVariantCheck(index: number) {
  const list = [...props.variants]
  if (list[index]) {
    list[index] = { ...list[index], checked: !list[index].checked }
    emit('update:variants', list)
  }
}

function removeVariant(index: number) {
  const list = [...props.variants]
  list.splice(index, 1)
  emit('update:variants', list)
}
</script>

<template>
  <div class="space-y-5">
    <!-- Price Type Pills Selector -->
    <div>
      <label class="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-300">Price Type</label>
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="tab in priceTypeTabs"
          :key="tab"
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-md border px-3.5 text-xs font-medium transition-colors focus:outline-none"
          :class="[
            priceType === tab
              ? 'border-primary bg-primary text-white shadow-sm'
              : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ]"
          :disabled="disabled"
          @click="emit('update:priceType', tab)"
        >
          <span
            class="flex size-3.5 items-center justify-center rounded-full border"
            :class="priceType === tab ? 'border-white bg-white' : 'border-gray-300 dark:border-gray-600'"
          >
            <span
              v-if="priceType === tab"
              class="size-1.5 rounded-full bg-primary"
            />
          </span>
          <span>{{ tab }}</span>
        </button>
      </div>
    </div>

    <!-- 1. Single Product Tab -->
    <div v-if="priceType === 'Single Product'" class="space-y-4 pt-1">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Quantity</label>
          <input
            :value="quantity"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:quantity', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Price (IDR)</label>
          <input
            :value="price"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:price', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Minimum Order Qty</label>
          <input
            :value="minOrderQty"
            type="number"
            min="1"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:minOrderQty', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Discount Type</label>
          <select
            :value="discountType"
            :disabled="disabled"
            :class="formControlClass"
            @change="emit('update:discountType', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">Choose</option>
            <option value="Percentage">Percentage</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Discount Value</label>
          <input
            :value="discountValue"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:discountValue', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Tax Type</label>
          <select
            :value="taxType"
            :disabled="disabled"
            :class="formControlClass"
            @change="emit('update:taxType', ($event.target as HTMLSelectElement).value)"
          >
            <option value="Exclusive">Exclusive</option>
            <option value="Sales Tax">Sales Tax</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Quantity Alert</label>
          <input
            :value="quantityAlert"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:quantityAlert', Number(($event.target as HTMLInputElement).value))"
          />
        </div>
      </div>
    </div>

    <!-- 2. Variable Product Tab -->
    <div v-else-if="priceType === 'Variable Product'" class="space-y-4 pt-1">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div class="mb-1 flex items-center justify-between">
            <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Variant Attribute</label>
            <button
              type="button"
              class="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline focus:outline-none"
              @click="emit('open-attribute-modal')"
            >
              <FeatherIcon name="plus-circle" :size="12" />
              <span>Add Attribute</span>
            </button>
          </div>
          <div class="flex gap-2">
            <select
              :value="selectedAttribute"
              :disabled="disabled"
              :class="formControlClass"
              @change="emit('update:selectedAttribute', ($event.target as HTMLSelectElement).value)"
            >
              <option value="Color">Color</option>
              <option value="Size">Size</option>
              <option value="Material">Material</option>
            </select>
            <button
              type="button"
              class="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              @click="emit('open-attribute-modal')"
            >
              <FeatherIcon name="plus-circle" :size="16" />
            </button>
          </div>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Add Variant Value</label>
          <div class="flex gap-2">
            <input
              v-model="tagInput"
              type="text"
              placeholder="e.g. Red, XL, Glossy..."
              :class="formControlClass"
              @keydown.enter.prevent="addTag"
            />
            <button
              type="button"
              class="inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none"
              @click="addTag"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <!-- Attribute Tags display -->
      <div v-if="attributeTags.length > 0" class="flex flex-wrap items-center gap-2">
        <span
          v-for="tag in attributeTags"
          :key="tag"
          class="inline-flex items-center gap-1 rounded bg-[#ff9f43]/10 px-2.5 py-1 text-xs font-semibold text-[#c8701a] border border-[#ff9f43]/25 dark:bg-[#ff9f43]/20 dark:text-[#ffb766] dark:border-[#ff9f43]/30"
        >
          <span>{{ tag }}</span>
          <button
            type="button"
            class="text-[#c8701a]/70 hover:text-red-500 focus:outline-none"
            @click="removeTag(tag)"
          >
            <FeatherIcon name="x" :size="12" />
          </button>
        </span>
      </div>

      <!-- Variants Table -->
      <div class="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead class="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th class="px-4 py-3 text-start">Variation</th>
              <th class="px-4 py-3 text-start">Variant Value</th>
              <th class="px-4 py-3 text-start">Quantity</th>
              <th class="px-4 py-3 text-start">Price</th>
              <th class="w-24 px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-if="variants.length === 0">
              <td colspan="5" class="py-6 text-center text-xs text-gray-400">
                No variants added yet. Add variant values above.
              </td>
            </tr>
            <tr v-for="(v, idx) in variants" :key="v.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
              <td class="px-4 py-2 font-medium">{{ v.variation }}</td>
              <td class="px-4 py-2">{{ v.value }}</td>
              <td class="px-4 py-2">
                <QuantityStepper
                  :model-value="v.quantity"
                  compact
                  @update:model-value="updateVariantQty(idx, $event)"
                />
              </td>
              <td class="px-4 py-2">
                <input
                  :value="v.price"
                  type="number"
                  min="0"
                  class="h-8 w-28 rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-800 shadow-sm outline-none transition hover:border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  @input="updateVariantPrice(idx, Number(($event.target as HTMLInputElement).value))"
                />
              </td>
              <td class="px-4 py-2">
                <div class="flex items-center justify-center gap-2">
                  <input
                    type="checkbox"
                    :checked="v.checked !== false"
                    class="size-4 rounded accent-primary cursor-pointer"
                    @change="toggleVariantCheck(idx)"
                  />
                  <button
                    type="button"
                    class="p-1 text-gray-400 hover:text-primary transition focus:outline-none"
                    title="Variation Details"
                    @click="emit('open-variation-modal', v)"
                  >
                    <FeatherIcon name="plus" :size="14" />
                  </button>
                  <button
                    type="button"
                    class="p-1 text-gray-400 hover:text-red-500 transition focus:outline-none"
                    title="Delete Variant"
                    @click="removeVariant(idx)"
                  >
                    <FeatherIcon name="trash-2" :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 3. Size Calculation Tab -->
    <div v-else-if="priceType === 'Size Calculation'" class="space-y-4 pt-1">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Price (IDR)</label>
          <input
            :value="price"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:price', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Minimal Price</label>
          <input
            :value="minPrice"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:minPrice', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Discount Type</label>
          <select
            :value="discountType"
            :disabled="disabled"
            :class="formControlClass"
            @change="emit('update:discountType', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">Choose</option>
            <option value="Percentage">Percentage</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Discount Value</label>
          <input
            :value="discountValue"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:discountValue', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Tax Type</label>
          <select
            :value="taxType"
            :disabled="disabled"
            :class="formControlClass"
            @change="emit('update:taxType', ($event.target as HTMLSelectElement).value)"
          >
            <option value="Direct">Direct</option>
            <option value="Indirect">Indirect</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 4. Large Format Tab -->
    <div v-else-if="priceType === 'Large Format'" class="space-y-4 pt-1">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Price (IDR)</label>
          <input
            :value="price"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:price', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Minimal Qty</label>
          <input
            :value="minOrderQty"
            type="number"
            min="1"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:minOrderQty', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Minimal Price</label>
          <input
            :value="minPrice"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:minPrice', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Minimal Length (optional)</label>
          <input
            :value="minLength"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:minLength', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Minimal Width (optional)</label>
          <input
            :value="minWidth"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:minWidth', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Discount Type</label>
          <select
            :value="discountType"
            :disabled="disabled"
            :class="formControlClass"
            @change="emit('update:discountType', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">Choose</option>
            <option value="Percentage">Percentage</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Discount Value</label>
          <input
            :value="discountValue"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:discountValue', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Tax Type</label>
          <select
            :value="taxType"
            :disabled="disabled"
            :class="formControlClass"
            @change="emit('update:taxType', ($event.target as HTMLSelectElement).value)"
          >
            <option value="Direct">Direct</option>
            <option value="Indirect">Indirect</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 5. Offset Service Price Tab -->
    <div v-else-if="priceType === 'Offset Service Price'" class="space-y-4 pt-1">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Druck Price</label>
          <input
            :value="druckPrice"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:druckPrice', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Minimal Qty</label>
          <input
            :value="minOrderQty"
            type="number"
            min="1"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:minOrderQty', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Minimal Price</label>
          <input
            :value="minPrice"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:minPrice', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Discount Type</label>
          <select
            :value="discountType"
            :disabled="disabled"
            :class="formControlClass"
            @change="emit('update:discountType', ($event.target as HTMLSelectElement).value)"
          >
            <option value="">Choose</option>
            <option value="Percentage">Percentage</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Discount Value</label>
          <input
            :value="discountValue"
            type="number"
            min="0"
            :disabled="disabled"
            :class="formControlClass"
            @input="emit('update:discountValue', Number(($event.target as HTMLInputElement).value))"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Tax Type</label>
          <select
            :value="taxType"
            :disabled="disabled"
            :class="formControlClass"
            @change="emit('update:taxType', ($event.target as HTMLSelectElement).value)"
          >
            <option value="Direct">Direct</option>
            <option value="Indirect">Indirect</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
