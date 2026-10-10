<script setup lang="ts">
import type { SalesReturn, SalesReturnFormData, ReturnItem } from '#server/types/sales-return'
import type { SalesContact } from '#server/types/sales-document'
const props = defineProps<{ open: boolean; record: SalesReturn | null; busy: boolean; error: string }>()
const emit = defineEmits<{ close: []; submit: [form: SalesReturnFormData] }>()
const { sales } = useSales()
const { formatRupiah } = useFormatters()
const blank = (): SalesReturnFormData => ({
  customer: '',
  salesNo: '',
  date: new Date().toLocaleDateString('en-GB'),
  total: 0,
  paymentStatus: 'Unpaid',
  items: [],
  notes: '',
})
const form = ref(blank())
const contact = ref<SalesContact>({ name: '', phone: '', email: '', address: '' })
const availableSales = computed(() =>
  sales.value.filter((s) => !contact.value.name || s.customer === contact.value.name),
)
watch(
  () => [props.open, props.record] as const,
  ([open, item]) => {
    if (!open) return
    form.value = item ? JSON.parse(JSON.stringify(item)) : blank()
    contact.value = { name: item?.customer || '', phone: '', email: '', address: '' }
  },
  { immediate: true },
)
function loadSale() {
  const sale = sales.value.find((s) => s.saleNo === form.value.salesNo)
  if (!sale) return
  contact.value = sale.document?.contact
    ? { ...sale.document.contact }
    : { name: sale.customer, email: '', phone: '', address: '' }
  form.value.items = (sale.items || []).map((i) => ({
    name: i.name,
    description: i.specs,
    qtyOrder: i.qty,
    qtyReturn: 1,
    unit: i.unit || 'Pcs',
    price: i.price,
    returnAmount: i.price,
    reason: '',
  }))
  recalculate()
}
function recalculate() {
  form.value.items.forEach((i) => {
    i.returnAmount = i.qtyReturn * i.price
  })
  form.value.total = form.value.items.reduce((sum, i) => sum + i.returnAmount, 0)
}
function quantity(item: ReturnItem, delta: number) {
  item.qtyReturn = Math.max(1, Math.min(item.qtyOrder, item.qtyReturn + delta))
  recalculate()
}
function addItem() {
  form.value.items.push({
    name: '',
    description: '',
    qtyOrder: 1,
    qtyReturn: 1,
    unit: 'Ream',
    price: 0,
    returnAmount: 0,
    reason: '',
  })
}
</script>
<template>
  <SalesDialog
    :open="open"
    :title="record ? 'Edit Sales Return : ' + record.returnNo : 'Add New Sales Return'"
    :busy="busy"
    document
    @close="emit('close')"
  >
    <form @submit.prevent="emit('submit', { ...form, customer: contact.name })">
      <fieldset :disabled="busy" class="min-w-0 space-y-6 disabled:opacity-60">
        <p v-if="error" role="alert" class="text-xs text-red-600">{{ error }}</p>
        <div class="grid gap-6 sm:grid-cols-2">
          <SalesCustomerField v-model="contact" label="Customer*" /><label :class="salesLabel"
            >No Sales*<select
              aria-label="No Sales*"
              v-model="form.salesNo"
              :class="salesField"
              required
              @change="loadSale"
            >
              <option value="">Select No Sales</option>
              <option
                v-if="form.salesNo && !availableSales.some((s) => s.saleNo === form.salesNo)"
                :value="form.salesNo"
              >
                {{ form.salesNo }}
              </option>
              <option v-for="sale in availableSales" :key="sale.id" :value="sale.saleNo">
                {{ sale.saleNo }} - {{ sale.date }}
              </option>
            </select></label
          >
        </div>
        <div class="overflow-x-auto pt-3">
          <table :class="salesDocumentTable" class="min-w-[900px]">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Qty</th>
                <th>Qty Return</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form.items" :key="index">
                <td class="min-w-52">
                  <input v-model="item.name" aria-label="Product Name" :class="salesField" required /><input
                    v-model="item.description"
                    aria-label="Product description"
                    :class="salesField"
                    class="mt-1"
                  />
                </td>
                <td class="w-20">
                  <input
                    v-model.number="item.qtyOrder"
                    aria-label="Qty"
                    type="number"
                    min="1"
                    :class="salesField"
                    required
                    @input="recalculate"
                  />
                </td>
                <td>
                  <div class="flex items-center gap-1">
                    <SalesActionButton
                      icon="plus-circle"
                      label="Increase return quantity"
                      @click="quantity(item, 1)"
                    /><input
                      v-model.number="item.qtyReturn"
                      aria-label="Qty Return"
                      type="number"
                      min="1"
                      :max="item.qtyOrder"
                      :class="salesField"
                      class="!w-16 text-center"
                      required
                      @input="recalculate"
                    /><SalesActionButton
                      icon="minus-circle"
                      label="Decrease return quantity"
                      @click="quantity(item, -1)"
                    />
                  </div>
                </td>
                <td class="w-24">
                  <input v-model="item.unit" aria-label="Unit" :class="salesField" required />
                </td>
                <td class="w-32">
                  <input
                    v-model.number="item.price"
                    aria-label="Price"
                    type="number"
                    min="0"
                    :class="salesField"
                    required
                    @input="recalculate"
                  />
                </td>
                <td>{{ formatRupiah(item.returnAmount) }}</td>
                <td class="min-w-36">
                  <input v-model="item.reason" aria-label="Description" :class="salesField" />
                </td>
                <td>
                  <SalesActionButton
                    icon="trash-2"
                    label="Remove return item"
                    @click="
                      () => {
                        form.items.splice(index, 1)
                        recalculate()
                      }
                    "
                  />
                </td>
              </tr>
              <tr v-if="!form.items.length">
                <td colspan="8" class="text-center text-gray-500">
                  {{
                    form.salesNo
                      ? 'Rincian barang belum tersimpan. Tambahkan barang yang dikembalikan.'
                      : 'Select No Sales to load the items.'
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="button" class="inline-flex items-center gap-2 text-xs text-primary" @click="addItem">
          <FeatherIcon name="plus-circle" :size="14" />add New blank
        </button>
        <div class="grid gap-6 sm:grid-cols-2">
          <label :class="salesLabel"
            >Notes<textarea
              v-model="form.notes"
              :class="salesField"
              rows="3"
              placeholder="Enter note here....."
            />
          </label>
          <div class="flex items-start justify-between gap-3 pt-2 text-sm font-semibold">
            <span>Grand Total (IDR)</span><span>{{ formatRupiah(form.total) }}</span>
          </div>
        </div>
        <div class="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button type="button" :class="salesSecondaryButton" @click="emit('close')">Cancel</button
          ><button type="submit" :class="salesPrimaryButton" :disabled="!form.items.length">
            {{ busy ? 'Saving...' : 'Submit' }}
          </button>
        </div>
      </fieldset>
    </form>
  </SalesDialog>
</template>
