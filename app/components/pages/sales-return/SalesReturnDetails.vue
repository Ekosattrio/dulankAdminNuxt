<script setup lang="ts">
import type { SalesReturn } from '#server/types/sales-return'
const props = defineProps<{ record: SalesReturn | null }>()
defineEmits<{ close: [] }>()
const { formatRupiah } = useFormatters()
const { contacts } = useSalesContacts()
const contact = computed(() => contacts.value.find((c) => c.name === props.record?.customer))
function printReturn() {
  if (!props.record) return
  printSalesRows(
    'Sales Return ' + props.record.returnNo,
    ['Product Name', 'Qty', 'Qty Return', 'Unit', 'Price (IDR)', 'Return Amount (IDR)', 'Description'],
    props.record.items.map((i) => [
      i.name,
      i.qtyOrder,
      i.qtyReturn,
      i.unit,
      i.price,
      i.returnAmount,
      i.reason,
    ]),
  )
}
</script>
<template>
  <SalesDialog
    :open="!!record"
    :title="'Sales Return Detail : ' + (record?.returnNo || '')"
    document
    @close="$emit('close')"
  >
    <div v-if="record" class="space-y-6 text-xs leading-6 text-gray-700 dark:text-gray-300">
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 class="font-semibold">Customer :</h3>
          <p>{{ record.customer }}</p>
          <p>{{ contact?.email }}</p>
          <p>{{ contact?.phone }}</p>
          <p>{{ contact?.address }}</p>
        </div>
        <dl>
          <div class="flex justify-between gap-4">
            <dt>Payment Method</dt>
            <dd>{{ record.paymentMethod || '-' }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt>Payment Status</dt>
            <dd><SalesStatusBadge :status="record.paymentStatus" /></dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt>Payment Date</dt>
            <dd>{{ record.paymentDate || '-' }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt>Bank / Wallet</dt>
            <dd>{{ record.payment?.bankName || '-' }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt>Account Number</dt>
            <dd>{{ record.payment?.accountNumber || '-' }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt>Account Name</dt>
            <dd>{{ record.payment?.accountName || '-' }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt>Reference</dt>
            <dd>{{ record.payment?.reference || '-' }}</dd>
          </div>
        </dl>
      </div>
      <h3 class="text-sm font-semibold">Return Summary</h3>
      <div class="overflow-x-auto">
        <table :class="salesDocumentTable" class="min-w-[800px]">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Qty</th>
              <th>Qty Return</th>
              <th>Unit</th>
              <th>Price (IDR)</th>
              <th>Return Amount (IDR)</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in record.items" :key="index">
              <td>
                {{ item.name }}
                <p class="whitespace-pre-line text-gray-500">{{ item.description }}</p>
              </td>
              <td>{{ item.qtyOrder }}</td>
              <td>{{ item.qtyReturn }}</td>
              <td>{{ item.unit }}</td>
              <td>{{ formatRupiah(item.price) }}</td>
              <td>{{ formatRupiah(item.returnAmount) }}</td>
              <td>{{ item.reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="grid gap-6 sm:grid-cols-2">
        <p>Notes : {{ record.notes || '-' }}</p>
        <div class="flex justify-between text-sm font-semibold">
          <span>Total (IDR)</span><span>{{ formatRupiah(record.total) }}</span>
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <button type="button" :class="salesSecondaryButton" @click="$emit('close')">Cancel</button
        ><button type="button" :class="salesPrimaryButton" @click="printReturn">
          <FeatherIcon name="printer" :size="14" />Print
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
