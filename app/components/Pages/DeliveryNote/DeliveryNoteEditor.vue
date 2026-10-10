<script setup lang="ts">
import type { DeliveryNote, DeliveryNoteFormData, DNItemRow } from '#server/types/delivery-note'
import type { SalesContact } from '#server/types/sales-document'
import type { Sale } from '#server/types/sale'
const props = defineProps<{
  isOpen: boolean
  busy?: boolean
  error?: string
  isEdit: boolean
  editData?: DeliveryNote | null
  sourceSale?: Sale | null
}>()
const emit = defineEmits<{ close: []; submit: [form: DeliveryNoteFormData] }>()
const { sales } = useSales()
const blank = (): DeliveryNoteFormData & { items: DNItemRow[] } => ({
  customer: '',
  noSales: '',
  shippingAddress: '',
  status: 'Pending',
  po: '',
  shippingBy: '',
  reference: '',
  date: new Date().toISOString().slice(0, 10),
  receiveBy: '',
  security: '',
  driver: '',
  issuedBy: '',
  items: [],
})
const form = ref(blank())
const contact = ref<SalesContact>({ name: '', phone: '', email: '', address: '' })
watch(
  () => [props.isOpen, props.editData, props.sourceSale] as const,
  ([open, item]) => {
    if (!open) return
    form.value = item
      ? {
          ...blank(),
          ...JSON.parse(JSON.stringify(item)),
          date: /^\d{4}-/.test(item.date) ? item.date : item.date.split('/').reverse().join('-'),
        }
      : blank()
    contact.value = { name: item?.customer || '', address: item?.shippingAddress || '', phone: '', email: '' }
    if (!item && props.sourceSale) {
      form.value.noSales = props.sourceSale.saleNo
      selectSale()
    }
  },
  { immediate: true },
)
function selectCustomer(c: SalesContact) {
  form.value.customer = c.name
  form.value.shippingAddress = c.address
}
function selectSale() {
  const sale = sales.value.find((s) => s.saleNo === form.value.noSales)
  if (!sale) return
  contact.value = sale.document?.contact
    ? { ...sale.document.contact }
    : { name: sale.customer, phone: '', email: '', address: '' }
  form.value.customer = sale.customer
  form.value.shippingAddress = sale.document?.shipping.address || form.value.shippingAddress
  form.value.po = sale.document?.po || form.value.po
  if (sale.items?.length)
    form.value.items = sale.items.map((i) => ({
      description: i.name + (i.specs ? ' - ' + i.specs : ''),
      qty: i.qty,
      unit: i.unit || 'Pcs',
      packingQty: '',
      weight: '',
    }))
}
function addItem() {
  form.value.items.push({ description: '', qty: 1, unit: 'Ream', packingQty: '', weight: '' })
}
function submit() {
  emit('submit', { ...form.value, customer: contact.value.name })
}
</script>
<template>
  <SalesDialog
    :open="isOpen"
    :title="isEdit ? 'Edit Delivery Note' : 'Add New Delivery Note'"
    :busy="busy"
    document
    @close="emit('close')"
  >
    <form @submit.prevent="submit">
      <p v-if="error" role="alert" class="mb-4 text-xs text-red-600">{{ error }}</p>
      <fieldset :disabled="busy" class="min-w-0 space-y-5 disabled:opacity-60">
        <SalesCompanyHeader delivery />
        <h3 class="text-left text-base font-semibold tracking-wide text-gray-800 dark:text-gray-100">
          DELIVERY NOTE
        </h3>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-4">
            <SalesCustomerField v-model="contact" @select="selectCustomer" /><label :class="salesLabel"
              >Ship To:<textarea
                v-model="form.shippingAddress"
                :class="salesField"
                rows="4"
                required
              /></label
            ><label :class="salesLabel"
              >No Sales<select
                aria-label="No Sales"
                v-model="form.noSales"
                :class="salesField"
                required
                @change="selectSale"
              >
                <option value="">Select No Sales</option>
                <option
                  v-if="form.noSales && !sales.some((s) => s.saleNo === form.noSales)"
                  :value="form.noSales"
                >
                  {{ form.noSales }}
                </option>
                <option v-for="sale in sales" :key="sale.id" :value="sale.saleNo">
                  {{ sale.saleNo }} - {{ sale.customer }}
                </option>
              </select></label
            >
          </div>
          <div class="grid content-start gap-3 sm:grid-cols-2">
            <label :class="salesLabel"
              >DN No<input
                :value="form.dnNo || ''"
                :class="salesField"
                placeholder="Generated when saved"
                readonly
            /></label>
            <label :class="salesLabel"
              >Dn Date<input v-model="form.date" type="date" :class="salesField" required
            /></label>
            <label :class="salesLabel" class="sm:col-span-2"
              >PO<input v-model="form.po" :class="salesField"
            /></label>
            <label :class="salesLabel" class="sm:col-span-2"
              >Shipping BY<input v-model="form.shippingBy" :class="salesField"
            /></label>
            <label :class="salesLabel" class="sm:col-span-2"
              >Reference<input v-model="form.reference" :class="salesField"
            /></label>
            <label :class="salesLabel" class="sm:col-span-2"
              >Status<select aria-label="Status" v-model="form.status" :class="salesField">
                <option>Pending</option>
                <option>Ordered</option>
                <option>Received</option>
                <option>Complete</option>
              </select></label
            >
          </div>
        </div>
        <div class="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
          <table :class="salesDocumentTable" class="min-w-[800px]">
            <thead>
              <tr>
                <th>No</th>
                <th>Item Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Packing Qty</th>
                <th>Weight (Kg)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form.items" :key="index">
                <td>{{ index + 1 }}</td>
                <td class="min-w-56">
                  <textarea
                    v-model="item.description"
                    aria-label="Item Description"
                    :class="salesField"
                    rows="2"
                    required
                  />
                </td>
                <td class="w-24">
                  <input
                    v-model.number="item.qty"
                    aria-label="Qty"
                    type="number"
                    min="1"
                    :class="salesField"
                    required
                  />
                </td>
                <td class="w-28">
                  <input
                    v-model="item.unit"
                    aria-label="Unit"
                    :class="salesField"
                    list="delivery-units"
                    required
                  />
                </td>
                <td class="w-28">
                  <input v-model="item.packingQty" aria-label="Packing Qty" :class="salesField" />
                </td>
                <td class="w-28">
                  <input v-model="item.weight" aria-label="Weight (Kg)" :class="salesField" />
                </td>
                <td>
                  <SalesActionButton
                    icon="trash-2"
                    label="Remove item"
                    @click="form.items.splice(index, 1)"
                  />
                </td>
              </tr>
              <tr v-if="!form.items.length">
                <td colspan="7" class="text-center text-gray-500">No items added</td>
              </tr>
            </tbody>
          </table>
        </div>
        <datalist id="delivery-units">
          <option>Ream</option>
          <option>Pieces</option>
          <option>Box</option>
          <option>Set</option>
        </datalist>
        <button type="button" class="inline-flex items-center gap-2 text-xs text-primary" @click="addItem">
          <FeatherIcon name="plus-circle" :size="14" />add New
        </button>
        <div
          class="grid gap-4 border-t border-gray-200 pt-5 sm:grid-cols-2 lg:grid-cols-4 dark:border-gray-700"
        >
          <label :class="salesLabel"
            >Receive By<input
              v-model="form.receiveBy"
              :class="salesField"
              placeholder="Your Name, Sign and Stamp" /></label
          ><label :class="salesLabel"
            >Security / Check<input
              v-model="form.security"
              :class="salesField"
              placeholder="Your Name, Sign and Stamp" /></label
          ><label :class="salesLabel"
            >Driver<input
              v-model="form.driver"
              :class="salesField"
              placeholder="Your Name, Sign and Stamp" /></label
          ><label :class="salesLabel"
            >Issued By<input
              v-model="form.issuedBy"
              :class="salesField"
              placeholder="Your Name, Sign and Stamp"
          /></label>
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
