<script setup lang="ts">
import type { PaperItemFormData, PaperGroup } from '#server/types/paper-shop'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const props = defineProps<{ groups: PaperGroup[]; sizes?: PaperSize[]; busy?: boolean }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'submit', payload: PaperItemFormData): void }>()

const name = ref('Art Paper')
const priceType = ref<'Group' | 'Single'>('Group')
const selectedGroupId = ref(props.groups[0]?.id || '1')
const merk = ref(props.groups[0]?.merk || 'Pindo Deli')
const price = ref(52000)
const unitPrice = ref('Kilogram')
const gramature = ref(120)

const fallbackSizes = ['90 x 120 cm', '79 x 109 cm', '65 x 100 cm', '65 x 90 cm', '61 x 92 cm', '61 x 86 cm']
const standardSizes = computed(() =>
  props.sizes && props.sizes.length > 0 ? props.sizes.map((s) => `${s.dimension} ${s.unit}`) : fallbackSizes
)

const selectedGroupSizes = ref<string[]>(['79 x 109 cm', '65 x 100 cm', '65 x 90 cm', '61 x 86 cm'])
const selectedSingleSize = ref('79 x 109 cm')
const selectedSizesCount = computed(() => selectedGroupSizes.value.length)

function onGroupSelect() {
  const g = props.groups.find((grp) => String(grp.id) === String(selectedGroupId.value))
  if (g) {
    name.value = g.name
    merk.value = g.merk
    if (g.price) price.value = g.price
    if (g.unitPrice) unitPrice.value = g.unitPrice
  }
}

function onPriceTypeChange(type: 'Group' | 'Single') {
  priceType.value = type
  if (type === 'Group') {
    name.value = 'Art Paper'
    unitPrice.value = 'Kilogram'
    price.value = 52000
    gramature.value = 120
  } else {
    name.value = 'Sticker Cromo'
    merk.value = 'Lintec'
    unitPrice.value = 'Pcs'
    price.value = 6500
    gramature.value = 180
  }
}

function handleSubmit() {
  if (!name.value.trim()) return
  const primarySize = priceType.value === 'Group'
    ? selectedGroupSizes.value[0] || '79 x 109 cm'
    : selectedSingleSize.value

  emit('submit', {
    groupId: selectedGroupId.value || props.groups[0]?.id || '1',
    name: name.value.trim(),
    merk: merk.value.trim(),
    price: price.value,
    priceType: priceType.value,
    unitPrice: unitPrice.value,
    gsm: gramature.value,
    paperSize: primarySize,
    stock: 500,
    unitStock: unitPrice.value === 'Kilogram' ? 'Kg' : 'Lembar',
    status: 'Active'
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Paper Name -->
    <div :class="modalFormRowClass">
      <label :class="modalFormLabelClass">Paper Name <span class="text-rose-500">*</span></label>
      <div :class="modalFormInputColClass">
        <input v-model="name" type="text" :class="formControlClass" required placeholder="Paper Name" />
      </div>
    </div>

    <!-- Price Type Radio -->
    <div :class="modalFormRowClass">
      <label :class="modalFormLabelClass">Price Type</label>
      <div :class="modalFormInputColClass">
        <div class="flex items-center gap-4">
          <label class="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              name="priceTypeAdd"
              :checked="priceType === 'Group'"
              class="text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              @change="onPriceTypeChange('Group')"
            />
            Paper Group
          </label>
          <label class="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              name="priceTypeAdd"
              :checked="priceType === 'Single'"
              class="text-primary focus:ring-primary h-4 w-4 cursor-pointer"
              @change="onPriceTypeChange('Single')"
            />
            Single
          </label>
        </div>
      </div>
    </div>

    <!-- PANEL A: Paper Group Selection -->
    <div v-if="priceType === 'Group'" class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 p-4 space-y-3">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        This Selection containing price settings and calculations in one group
      </p>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Paper Group</label>
        <div :class="modalFormInputColClass">
          <select v-model="selectedGroupId" :class="formControlClass" @change="onGroupSelect">
            <option v-for="grp in groups" :key="grp.id" :value="grp.id">{{ grp.name }}</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Merk</label>
        <div :class="modalFormInputColClass">
          <input v-model="merk" type="text" :class="formControlClass" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Price</label>
        <div :class="modalFormInputColClass">
          <CurrencyInput v-model="price" readonly class="bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Price Unit</label>
        <div :class="modalFormInputColClass">
          <input v-model="unitPrice" type="text" class="bg-gray-100 dark:bg-gray-800" :class="formControlClass" readonly />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Gramature</label>
        <div :class="modalFormInputColClass">
          <input v-model.number="gramature" type="number" :class="formControlClass" />
        </div>
      </div>

      <!-- Paper Size Multi-Checkbox -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Paper Size</label>
        <div :class="modalFormInputColClass">
          <div class="grid grid-cols-2 gap-2">
            <label
              v-for="sz in standardSizes"
              :key="sz"
              class="inline-flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              <input v-model="selectedGroupSizes" type="checkbox" :value="sz" class="rounded text-primary focus:ring-primary h-4 w-4" />
              {{ sz }}
            </label>
          </div>
          <p class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
            {{ selectedSizesCount }} Paper Sizes will be saved
          </p>
        </div>
      </div>
    </div>

    <!-- PANEL B: Single Selection -->
    <div v-else class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 p-4 space-y-3">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Merk</label>
        <div :class="modalFormInputColClass">
          <input v-model="merk" type="text" :class="formControlClass" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Price</label>
        <div :class="modalFormInputColClass">
          <CurrencyInput v-model="price" placeholder="6.500" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Price Unit</label>
        <div :class="modalFormInputColClass">
          <input v-model="unitPrice" type="text" :class="formControlClass" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Gramature</label>
        <div :class="modalFormInputColClass">
          <input v-model.number="gramature" type="number" :class="formControlClass" />
        </div>
      </div>

      <!-- Paper Size Single Radio -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Paper Size</label>
        <div :class="modalFormInputColClass">
          <div class="grid grid-cols-2 gap-2">
            <label
              v-for="sz in standardSizes"
              :key="sz"
              class="inline-flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              <input v-model="selectedSingleSize" type="radio" name="singlePaperSize" :value="sz" class="text-primary focus:ring-primary h-4 w-4" />
              {{ sz }}
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
      <button
        type="button"
        class="h-9 px-4 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
        @click="emit('close')"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="h-9 px-5 rounded-md bg-amber-500 hover:bg-amber-600 text-sm font-semibold text-white shadow disabled:opacity-50 cursor-pointer"
        :disabled="busy"
      >
        {{ busy ? 'Saving...' : 'Submit' }}
      </button>
    </div>
  </form>
</template>

