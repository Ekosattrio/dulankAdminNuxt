<script setup lang="ts">
import type { QuotationDocument } from '#server/types/quotation'
import type { SalesContact } from '#server/types/sales-document'
const form = defineModel<QuotationDocument>({ required: true })
defineProps<{ number: string; busy: boolean; total: number; tax: number }>()
defineEmits<{ submit: [] }>()
const { formatRupiah } = useFormatters()
const { data: products } = useFetch<{ product: { name: string; code: string; category: string }[] }>(
  '/assets/json/product.json',
  { key: 'sales-products-source' },
)
const searchProduct = ref('')
const productList = useId()
function addItem(name = '') {
  form.value.legacyTotal = undefined
  form.value.items.push({
    productName: name,
    description: '',
    moq: 1,
    unitPrice: 0,
    order: 1,
    unit: 'Ream',
    amount: 0,
  })
  searchProduct.value = ''
}
function selectCustomer(c: SalesContact) {
  form.value.shipping.recipient = c.name
  form.value.shipping.phone = c.phone
  form.value.shipping.address = c.address
}
</script>
<template>
  <form @submit.prevent="$emit('submit')">
    <fieldset :disabled="busy" class="min-w-0 space-y-6 disabled:opacity-60">
      <div
        class="space-y-6 rounded-lg border border-gray-200 bg-white p-5 text-xs text-gray-700 shadow-sm sm:p-12 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >
        <SalesCompanyHeader />
        <section class="max-w-lg space-y-2 pb-8">
          <h2 class="mb-4 text-2xl font-semibold">Quotation</h2>
          <div
            class="space-y-2 [&>label]:grid [&>label]:grid-cols-[80px_minmax(0,1fr)] [&>label]:items-center [&>label]:gap-3"
          >
            <label :class="salesLabel"
              >No<input
                :value="number"
                :class="salesField"
                placeholder="Generated when saved"
                readonly /></label
            ><label :class="salesLabel"
              >Date<input v-model="form.date" type="date" :class="salesField" required /></label
            ><label :class="salesLabel"
              >Currency<select aria-label="Currency" v-model="form.currency" :class="salesField">
                <option>IDR</option>
              </select></label
            ><label :class="salesLabel"
              >TOP<select aria-label="TOP" v-model="form.top" :class="salesField">
                <option>Cash on Delivery</option>
                <option>15 Days</option>
                <option>30 Days</option>
                <option>60 Days</option>
              </select></label
            ><label :class="salesLabel">Att<input v-model="form.att" :class="salesField" /></label>
          </div>
        </section>
        <div class="grid min-h-48 gap-8 sm:grid-cols-2">
          <SalesCustomerField v-model="form.contact" @select="selectCustomer" /><SalesShippingFields
            v-model="form.shipping"
          />
        </div>
        <div class="flex max-w-lg flex-wrap items-end gap-3">
          <label :class="salesLabel" class="min-w-48 flex-1"
            >Search Product *<input
              v-model="searchProduct"
              :list="productList"
              :class="salesField"
              placeholder="Search Product"
              @keydown.enter.prevent="searchProduct.trim() && addItem(searchProduct)" /></label
          ><button
            type="button"
            :class="salesSecondaryButton"
            :disabled="!searchProduct.trim()"
            @click="addItem(searchProduct)"
          >
            <FeatherIcon name="plus-circle" :size="14" />add New
          </button>
        </div>
        <datalist :id="productList">
          <option v-for="product in products?.product || []" :key="product.code" :value="product.name" />
        </datalist>
        <div class="overflow-x-auto">
          <table :class="salesDocumentTable" class="min-w-[850px]">
            <thead>
              <tr>
                <th>Products</th>
                <th>MOQ</th>
                <th>Unit Price</th>
                <th>Order</th>
                <th>Unit</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form.items" :key="index">
                <td class="min-w-64">
                  <input
                    v-model="item.productName"
                    aria-label="Product Name"
                    :class="salesField"
                    required
                  /><textarea
                    v-model="item.description"
                    aria-label="Product description"
                    :class="salesField"
                    class="mt-2"
                    rows="2"
                  />
                </td>
                <td class="w-24">
                  <input
                    v-model.number="item.moq"
                    aria-label="MOQ"
                    type="number"
                    min="1"
                    :class="salesField"
                    required
                  />
                </td>
                <td class="w-32">
                  <input
                    v-model.number="item.unitPrice"
                    aria-label="Unit Price"
                    type="number"
                    min="0"
                    :class="salesField"
                    required
                  />
                </td>
                <td class="w-24">
                  <input
                    v-model.number="item.order"
                    aria-label="Order"
                    type="number"
                    :min="item.moq"
                    :class="salesField"
                    required
                  />
                </td>
                <td class="w-28">
                  <select v-model="item.unit" aria-label="Unit" :class="salesField">
                    <option>Ream</option>
                    <option>Pieces</option>
                    <option>Pcs</option>
                    <option>Box</option>
                    <option>Set</option>
                  </select>
                </td>
                <td class="whitespace-nowrap">{{ formatRupiah(item.order * item.unitPrice) }}</td>
                <td>
                  <SalesActionButton
                    icon="trash-2"
                    label="Remove product"
                    @click="form.items.splice(index, 1)"
                  />
                </td>
              </tr>
              <tr v-if="!form.items.length">
                <td colspan="7" class="text-center text-gray-500">
                  {{
                    form.legacyTotal !== undefined
                      ? 'Rincian produk belum tersimpan pada quotation ini.'
                      : 'No products added'
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-wrap justify-between gap-3">
          <button type="button" class="inline-flex items-center gap-2 text-primary" @click="addItem()">
            <FeatherIcon name="plus-circle" :size="14" />add New blank</button
          ><label class="flex items-center gap-2"
            ><input v-model="form.pricesIncludeTax" type="checkbox" class="accent-primary" />Harga termasuk
            PPN</label
          >
        </div>
        <div class="grid gap-8 sm:grid-cols-2">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Term &amp; Condition</h3>
            <div v-for="(_term, index) in form.terms" :key="index" class="flex items-center gap-3">
              <span>{{ index + 1 }}</span
              ><input
                v-model="form.terms[index]"
                aria-label="Term and condition"
                :class="salesField"
              /><SalesActionButton icon="trash-2" label="Remove term" @click="form.terms.splice(index, 1)" />
            </div>
            <button
              type="button"
              class="inline-flex items-center gap-2 text-primary"
              @click="form.terms.push('')"
            >
              <FeatherIcon name="plus-circle" :size="14" />add New blank
            </button>
          </div>
          <div class="space-y-4">
            <label :class="salesLabel"
              >Shipping Cost<input
                v-model.number="form.shippingCost"
                type="number"
                min="0"
                :class="salesField" /></label
            ><label :class="salesLabel"
              >Tax<select aria-label="Tax" v-model.number="form.taxRate" :class="salesField">
                <option :value="0">No Tax</option>
                <option :value="11">Ppn 11%</option>
                <option :value="12">Ppn 12%</option>
              </select></label
            >
            <p>Tax: {{ formatRupiah(tax) }}</p>
            <div
              class="flex justify-between border-t border-gray-200 pt-4 text-sm font-semibold dark:border-gray-700"
            >
              <span>Grand Total</span><span>{{ formatRupiah(total) }}</span>
            </div>
          </div>
        </div>
        <div class="ml-auto w-full max-w-60 space-y-4 pt-6">
          <p>Your's Fithfully</p>
          <label :class="salesLabel"
            ><span class="sr-only">Name</span
            ><input v-model="form.signature" :class="salesField" placeholder="Name" /></label
          ><label :class="salesLabel"
            ><span class="sr-only">Position</span
            ><input v-model="form.position" :class="salesField" placeholder="Position"
          /></label>
        </div>
      </div>
      <div class="flex justify-end gap-3">
        <NuxtLink to="/quotation" :class="salesSecondaryButton">Cancel</NuxtLink
        ><button type="submit" :class="salesPrimaryButton">{{ busy ? 'Saving...' : 'Save Changes' }}</button>
      </div>
    </fieldset>
  </form>
</template>
