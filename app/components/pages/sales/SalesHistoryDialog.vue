<script setup lang="ts">
import type { SalesHistoryEntry } from '#server/types/sales-document'
const props = defineProps<{ kind: 'deleted' | 'cancelled' | null }>()
defineEmits<{ close: [] }>()
const { data, pending, error, refresh } = useFetch<{ data: SalesHistoryEntry[] }>('/api/sales/history', {
  key: 'sales-history',
})
watch(
  () => props.kind,
  (value) => {
    if (value) refresh()
  },
)
const from = ref('')
const to = ref('')
const items = computed(() =>
  (data.value?.data || []).filter((item) => {
    const date = item.date.split('/').reverse().join('-')
    return item.kind === props.kind && (!from.value || date >= from.value) && (!to.value || date <= to.value)
  }),
)
const { formatRupiah } = useFormatters()
const columns = computed(() => [
  { key: 'saleNo', label: 'No Sales', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'date', label: props.kind === 'deleted' ? 'Date Delete' : 'Date Cancel', sortable: true },
  {
    key: 'total',
    label: props.kind === 'deleted' ? 'Total (IDR)' : 'Total Refund',
    sortable: true,
    align: 'end' as const,
  },
  { key: 'created', label: 'Created' },
])
</script>
<template>
  <SalesDialog
    :open="!!kind"
    :title="kind === 'deleted' ? 'History Deleted Sales' : 'Canceled Transaction'"
    wide
    @close="$emit('close')"
  >
    <SalesFeedback
      :pending="pending"
      :error="error ? 'Unable to load sales history.' : ''"
      @retry="refresh()"
    />
    <div class="mb-4 flex flex-wrap gap-3">
      <label :class="salesLabel">From<input v-model="from" type="date" :class="salesField" /></label
      ><label :class="salesLabel">To<input v-model="to" type="date" :min="from" :class="salesField" /></label>
    </div>
    <SalesDataTable :columns="columns" :items="items"
      ><template #cell(total)="{ item }">{{ formatRupiah(item.total) }}</template
      ><template #footer
        ><tr>
          <td colspan="3" class="px-4 py-3">Total</td>
          <td class="px-4 py-3 text-right">
            {{ formatRupiah(items.reduce((sum, item) => sum + item.total, 0)) }}
          </td>
          <td /></tr></template
    ></SalesDataTable>
    <div class="mt-5 flex justify-end">
      <button type="button" :class="salesSecondaryButton" @click="$emit('close')">Cancel</button>
    </div>
  </SalesDialog>
</template>
