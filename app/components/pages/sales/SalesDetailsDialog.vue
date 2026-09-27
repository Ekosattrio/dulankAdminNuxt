<script setup lang="ts">
import type { Sale } from '#server/types/sale'
defineProps<{ record: Sale | null }>()
defineEmits<{ close: [] }>()
const { formatRupiah } = useFormatters()
</script>
<template>
  <SalesDialog
    :open="!!record"
    :title="'Sales Detail : ' + (record?.saleNo || '')"
    wide
    @close="$emit('close')"
  >
    <div v-if="record" class="space-y-6 text-xs leading-6 text-gray-700 dark:text-gray-300">
      <div class="grid gap-5 sm:grid-cols-3">
        <div>
          <h3 class="font-semibold">Customer :</h3>
          <p>{{ record.customer }}</p>
          <p>{{ record.document?.contact.email }}</p>
          <p>{{ record.document?.contact.phone }}</p>
          <p>{{ record.document?.contact.address }}</p>
        </div>
        <div>
          <h3 class="font-semibold">Shipping :</h3>
          <p>{{ record.document?.shipping.recipient || record.customer }}</p>
          <p>{{ record.document?.shipping.phone }}</p>
          <p>{{ record.document?.shipping.address || '-' }}</p>
        </div>
        <div>
          <h3 class="font-semibold">Invoice Info</h3>
          <p>No. Sales : {{ record.saleNo }}</p>
          <p>Date : {{ record.date }}</p>
          <p>Payment Status : {{ record.status }}</p>
          <p>Delivery : {{ record.delivery }}</p>
          <p>PO Number : {{ record.document?.po || '-' }}</p>
        </div>
      </div>
      <h3 class="text-sm font-semibold">Order Summary</h3>
      <div class="overflow-x-auto">
        <table :class="salesDocumentTable" class="min-w-[650px]">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Price (IDR)</th>
              <th>Amount (IDR)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in record.items || []" :key="item.id">
              <td>
                {{ item.name }}
                <p class="whitespace-pre-line text-gray-500">{{ item.specs }}</p>
              </td>
              <td>{{ item.qty }}</td>
              <td>{{ item.unit || 'Pcs' }}</td>
              <td>{{ formatRupiah(item.price) }}</td>
              <td>{{ formatRupiah(item.price * item.qty) }}</td>
            </tr>
            <tr v-if="!record.items?.length">
              <td colspan="5" class="text-center text-gray-500">No item details recorded.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="grid gap-5 sm:grid-cols-2">
        <p>Notes : {{ record.document?.notes || '-' }}</p>
        <dl class="space-y-2">
          <div class="flex justify-between">
            <dt>Sub Total</dt>
            <dd>{{ formatRupiah(record.subTotal) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt>Voucher {{ record.document?.voucher }}</dt>
            <dd>{{ formatRupiah(record.discount) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt>Shipping Costs</dt>
            <dd>{{ formatRupiah(record.deliveryFee) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt>Sub Total Before Tax</dt>
            <dd>{{ formatRupiah(record.subTotal + record.deliveryFee - record.discount) }}</dd>
          </div>
          <div class="flex justify-between">
            <dt>Tax</dt>
            <dd>{{ formatRupiah(record.tax) }}</dd>
          </div>
          <div class="flex justify-between border-t border-gray-200 pt-3 font-semibold">
            <dt>Grand Total (IDR)</dt>
            <dd>{{ formatRupiah(record.total) }}</dd>
          </div>
        </dl>
      </div>
      <div class="flex justify-end">
        <button type="button" :class="salesSecondaryButton" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </SalesDialog>
</template>
