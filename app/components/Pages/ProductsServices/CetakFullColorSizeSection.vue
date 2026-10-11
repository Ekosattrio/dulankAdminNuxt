<script setup lang="ts">
import type { SizePreset } from '#server/types/cetak-full-color'
import GenericSettingTable from './GenericSettingTable.vue'
import { cetakFullColorSizeColumns, cetakFullColorSizeFields } from '~/utils/cetakFullColorSchemas'

defineProps<{
  sizes: SizePreset[]
  customSizeEnabled: boolean
  busy?: boolean
}>()

const emit = defineEmits<{
  'update:sizes': [value: SizePreset[]]
  'update:customSizeEnabled': [value: boolean]
  save: []
}>()
</script>

<template>
  <div class="space-y-5">
    <GenericSettingTable
      :model-value="sizes"
      title="Product Size Option"
      add-label="Add Size"
      :columns="cetakFullColorSizeColumns"
      :fields="cetakFullColorSizeFields"
      :busy="busy"
      @update:model-value="emit('update:sizes', $event as unknown as SizePreset[])"
      @change="emit('save')"
    />

    <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h5 class="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Custom size for Product</h5>
      <div class="flex flex-wrap items-center gap-3">
        <span class="text-sm text-gray-700 dark:text-gray-300">Enable Product for Custom Size ?</span>
        <div class="inline-flex overflow-hidden rounded-md border border-primary">
          <button type="button" :class="['h-9 px-4 text-sm font-semibold', customSizeEnabled ? 'bg-primary text-white' : 'bg-white text-primary']" @click="emit('update:customSizeEnabled', true)">Yes</button>
          <button type="button" :class="['h-9 px-4 text-sm font-semibold', !customSizeEnabled ? 'bg-primary text-white' : 'bg-white text-primary']" @click="emit('update:customSizeEnabled', false)">No</button>
        </div>
      </div>
    </div>
  </div>
</template>
