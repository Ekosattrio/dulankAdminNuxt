<script setup lang="ts">
import type { ProductImportRow } from '#server/types/product'

defineProps<{ open: boolean; busy?: boolean; error?: string }>()
const emit = defineEmits<{ close: []; submit: [rows: ProductImportRow[]] }>()
const rows = ref<ProductImportRow[]>([])
const fileName = ref('')
const parseError = ref('')

function parseCsvLine(line: string) {
  const cells: string[] = []
  let value = ''
  let quoted = false
  for (let index = 0; index < line.length; index++) {
    const character = line[index]!
    if (character === '"') {
      if (quoted && line[index + 1] === '"') { value += '"'; index++ } else quoted = !quoted
    } else if (character === ',' && !quoted) { cells.push(value.trim()); value = '' }
    else value += character
  }
  cells.push(value.trim())
  return cells
}

async function loadFile(event: Event) {
  rows.value = []
  parseError.value = ''
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  fileName.value = file.name
  try {
    const content = await file.text()
    if (file.name.toLowerCase().endsWith('.json')) {
      const parsed = JSON.parse(content)
      rows.value = Array.isArray(parsed) ? parsed : parsed.rows
    } else {
      const lines = content.split(/\r?\n/).filter(line => line.trim())
      const headers = parseCsvLine(lines.shift() || '').map(header => header.trim())
      rows.value = lines.map((line) => {
        const values = parseCsvLine(line)
        const item = Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])) as Record<string, string>
        return {
          code: item.code ?? '', name: item.name ?? '', category: item.category ?? '', subCategory: item.subCategory ?? '',
          unit: item.unit ?? '', price: Number(item.price || 0), priceType: item.priceType || 'Single Product',
        }
      })
    }
    if (!Array.isArray(rows.value) || !rows.value.length) throw new Error('File tidak memiliki data produk')
  } catch (cause) {
    rows.value = []
    parseError.value = cause instanceof Error ? cause.message : 'File gagal dibaca'
  }
}
</script>

<template>
  <SalesDialog :open="open" title="Import Product" medium :busy="busy" @close="$emit('close')">
    <form class="space-y-4" @submit.prevent="emit('submit', rows)">
      <div class="rounded-md border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800">
        <FeatherIcon name="upload-cloud" :size="28" class="mx-auto text-gray-400" />
        <p class="mt-2 text-sm font-semibold">Upload CSV or JSON</p>
        <p class="mt-1 text-xs text-gray-500">Columns: code, name, category, subCategory, unit, price, priceType</p>
        <label class="mt-4 inline-flex h-9 cursor-pointer items-center rounded-md bg-primary px-4 text-xs font-semibold text-white">
          Choose File<input type="file" accept=".csv,.json,text/csv,application/json" class="sr-only" @change="loadFile" />
        </label>
      </div>
      <p v-if="fileName" class="text-xs text-gray-600">{{ fileName }}: {{ rows.length }} rows ready</p>
      <p v-if="parseError || error" role="alert" class="rounded-md bg-red-50 p-3 text-xs text-red-700">{{ parseError || error }}</p>
      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4">
        <button type="button" class="h-9 rounded-md border border-gray-300 px-4 text-xs font-semibold" :disabled="busy" @click="$emit('close')">Cancel</button>
        <button type="submit" class="h-9 rounded-md bg-primary px-4 text-xs font-semibold text-white disabled:opacity-50" :disabled="busy || !rows.length">{{ busy ? 'Importing...' : 'Import Product' }}</button>
      </div>
    </form>
  </SalesDialog>
</template>
