<script setup lang="ts">
import type { Customer } from "~/components/forms/CustomerLiveSearch.vue";
import type { ProductItem } from "~/components/forms/ProductLiveSearch.vue";

const route = useRoute();
const router = useRouter();
const { formatRupiah } = useFormatters();

const quoteNo = computed(() => (route.query.no as string) || "QUO00001");

useHead({
  title: computed(() => `Edit Quotation ${quoteNo.value} - Kacetak System`),
});

interface QuotationLineItem {
  productName: string;
  description?: string;
  moq: number;
  unitPrice: number;
  order: number;
  unit: string;
  amount: number;
}

// Meta Fields
const quotationNo = ref(quoteNo.value);
const quotationDate = ref("2025-11-01");
const currency = ref("IDR");
const topDays = ref("14 Days");
const att = ref("Ibu Dewi Utri");

// Customer & Shipping
const selectedCustomer = ref<Customer | null>({
  name: "PT Semesta Digital",
  phone: "081234567890",
  email: "info@semestadigi.co.id",
  address: "Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said, XS No. 13, Jakarta Selatan, 12950",
});

const shippingMethod = ref<"shipping" | "pickup">("shipping");

const shippingAddress = ref({
  recipient: "PT Semesta Digital",
  phone: "081234567890",
  type: "Office",
  detail: "Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said, XS No. 13, Jakarta Selatan, 12950",
});

const pickupStore = ref({
  storeName: "Dulank Pickup 2",
  phone: "081906855554",
  detail:
    "Toko Kelontong Depan Desa Teluk Jambe, 515 Sarah Shore Suite 828, Port Kennethstad, Iowa, TH, KAB. KARAWANG - TELUK JAMBE TIMUR, JAWA BARAT, ID 41360",
});

// Line Items
const items = ref<QuotationLineItem[]>([
  {
    productName: "Brosur PPDN SMAN 1 Bandung",
    description: "Brosur Full Color A4 (210x297 Milimeter), Art paper 150gr, Tanpa Laminasi, Tanpa Lipatan",
    moq: 5,
    unitPrice: 34000,
    order: 10,
    unit: "pcs",
    amount: 340000,
  },
]);

const voucherDiscount = ref(0);
const shippingCost = ref(89500);
const ppnPercent = ref(11);

const subTotal = computed(() => items.value.reduce((sum, item) => sum + item.amount, 0));
const subTotalBeforeTax = computed(() => Math.max(0, subTotal.value - voucherDiscount.value + shippingCost.value));
const ppnAmount = computed(() => Math.round((subTotalBeforeTax.value * ppnPercent.value) / 100));
const grandTotal = computed(() => subTotalBeforeTax.value + ppnAmount.value);

const terms = ref(["Harga sudah termasuk PPN", "Penawaran ini berlaku 30 hari"]);

const handleProductSelect = (p: ProductItem) => {
  items.value.push({
    productName: p.name,
    description: `Kategori: ${p.category} | Kode: ${p.code}`,
    moq: 1,
    unitPrice: 25000,
    order: 1,
    unit: "pcs",
    amount: 25000,
  });
};

const addNewItem = () => {
  items.value.push({
    productName: "New Item",
    description: "",
    moq: 1,
    unitPrice: 0,
    order: 1,
    unit: "pcs",
    amount: 0,
  });
};

const updateItemAmount = (item: QuotationLineItem) => {
  item.amount = (item.order || 0) * (item.unitPrice || 0);
};

const removeItem = (index: number) => {
  items.value.splice(index, 1);
};

const handleCustomerSelect = (c: Customer) => {
  selectedCustomer.value = c;
  shippingAddress.value.recipient = c.name;
  shippingAddress.value.phone = c.phone;
  shippingAddress.value.detail = c.address;
};

const isSubmitting = ref(false);
const handleSubmit = () => {
  isSubmitting.value = true;
  setTimeout(() => {
    isSubmitting.value = false;
    router.push("/quotation");
  }, 600);
};
</script>

<template>
  <div>
    <!-- Page Header -->
    <PageHeader :title="`Edit Quotation #${quotationNo}`" subtitle="Update quotation details">
      <template #actions>
        <NuxtLink
          to="/quotation"
          class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <FeatherIcon name="arrow-left" size="14" />
          <span>Back to Quotation List</span>
        </NuxtLink>
      </template>
    </PageHeader>

    <form @submit.prevent="handleSubmit">
      <div
        class="mx-auto max-w-5xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <!-- Company Header -->
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-gray-100 pb-6 dark:border-gray-800"
        >
          <div
            class="flex h-24 w-44 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
          >
            <span class="text-sm font-bold text-gray-400">Logo</span>
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 sm:text-end">
            <h2 class="text-base font-bold text-gray-900 dark:text-white">PT. DULANK SEMESTA CIDA</h2>
            <p>Jl. Arif Rahman Hakim / Niaga (depan stasiun) Karawang</p>
            <p>Kel. Nagasari Kec. Karawang Barat Kab. Karawang Jawa Barat</p>
            <p class="font-medium text-gray-800 dark:text-gray-300">ptdulanksemestacida@gmail.com</p>
          </div>
        </div>

        <!-- Quotation Meta Info -->
        <div class="my-6">
          <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Quotation Details</h3>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div>
              <label class="font-semibold text-gray-700 dark:text-gray-300">No Quotation</label>
              <input
                v-model="quotationNo"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label class="font-semibold text-gray-700 dark:text-gray-300">Date</label>
              <input
                v-model="quotationDate"
                type="date"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label class="font-semibold text-gray-700 dark:text-gray-300">Currency</label>
              <input
                v-model="currency"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="font-semibold text-gray-700 dark:text-gray-300">TOP (Terms of Payment)</label>
              <input
                v-model="topDays"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="font-semibold text-gray-700 dark:text-gray-300">Att (Attention)</label>
              <input
                v-model="att"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- Customer & Shipping Method Row -->
        <div
          class="mb-6 grid grid-cols-1 gap-6 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30 sm:grid-cols-2 text-xs"
        >
          <!-- Customer Section -->
          <div>
            <span class="font-bold text-gray-900 dark:text-white">Customer</span>
            <div class="mt-2">
              <CustomerLiveSearch @select="handleCustomerSelect" />
            </div>

            <div
              v-if="selectedCustomer"
              class="mt-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
            >
              <p class="font-bold text-gray-900 dark:text-white">{{ selectedCustomer.name }}</p>
              <p class="text-gray-500">{{ selectedCustomer.email }}</p>
              <p class="text-gray-500">{{ selectedCustomer.phone }}</p>
              <p class="mt-1 text-gray-600 dark:text-gray-300">{{ selectedCustomer.address }}</p>
            </div>
          </div>

          <!-- Shipping Method Section -->
          <div>
            <div class="mb-3 flex items-center gap-4">
              <span class="font-bold text-gray-900 dark:text-white">Shipping Method:</span>
              <label class="flex cursor-pointer items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                <input v-model="shippingMethod" type="radio" value="shipping" class="h-4 w-4 text-primary focus:ring-primary" />
                <span>Shipping</span>
              </label>
              <label class="flex cursor-pointer items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                <input v-model="shippingMethod" type="radio" value="pickup" class="h-4 w-4 text-primary focus:ring-primary" />
                <span>Pickup</span>
              </label>
            </div>

            <div
              v-if="shippingMethod === 'shipping'"
              class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-900 dark:text-white">{{ shippingAddress.recipient }}</span>
                <span class="text-gray-500">{{ shippingAddress.phone }}</span>
                <span class="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {{ shippingAddress.type }}
                </span>
              </div>
              <p class="mt-1 text-gray-600 dark:text-gray-300">{{ shippingAddress.detail }}</p>
            </div>

            <div v-else class="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-900 dark:text-white">{{ pickupStore.storeName }}</span>
                <span class="text-gray-500">({{ pickupStore.phone }})</span>
              </div>
              <p class="mt-1 text-gray-600 dark:text-gray-300">{{ pickupStore.detail }}</p>
            </div>
          </div>
        </div>

        <!-- Product Search & Add Section -->
        <div class="mb-4">
          <div class="mb-2 flex items-center justify-between">
            <label class="text-xs font-bold text-gray-900 dark:text-white">Search Product</label>
            <button
              type="button"
              class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              @click="addNewItem"
            >
              <FeatherIcon name="plus-circle" size="13" />
              <span>Add Custom Item</span>
            </button>
          </div>
          <div class="max-w-md">
            <ProductLiveSearch @select="handleProductSelect" />
          </div>
        </div>

        <!-- Item Table -->
        <div class="mb-6 overflow-x-auto">
          <table class="w-full border-collapse text-xs">
            <thead>
              <tr
                class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <th class="p-3 text-start" style="width: 320px">Products</th>
                <th class="p-3 text-end" style="width: 80px">MOQ</th>
                <th class="p-3 text-end" style="width: 120px">Unit Price</th>
                <th class="p-3 text-end" style="width: 100px">Order</th>
                <th class="p-3 text-center" style="width: 80px">Unit</th>
                <th class="p-3 text-end" style="width: 130px">Amount</th>
                <th class="p-3 text-center" style="width: 50px">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="(item, idx) in items" :key="idx">
                <td class="p-3 align-top">
                  <input
                    v-model="item.productName"
                    type="text"
                    class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-xs font-bold text-gray-900 focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <textarea
                    v-model="item.description"
                    rows="2"
                    class="mt-1.5 w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-[11px] text-gray-600 focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  ></textarea>
                </td>
                <td class="p-3 align-top">
                  <input
                    v-model.number="item.moq"
                    type="number"
                    min="1"
                    class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-end text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </td>
                <td class="p-3 align-top">
                  <input
                    v-model.number="item.unitPrice"
                    type="number"
                    min="0"
                    class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-end text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    @input="updateItemAmount(item)"
                  />
                </td>
                <td class="p-3 align-top">
                  <input
                    v-model.number="item.order"
                    type="number"
                    min="1"
                    class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-end text-xs font-semibold dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    @input="updateItemAmount(item)"
                  />
                </td>
                <td class="p-3 align-top">
                  <input
                    v-model="item.unit"
                    type="text"
                    class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-center text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </td>
                <td class="p-3 align-top text-end font-bold text-gray-900 dark:text-white">
                  {{ formatRupiah(item.amount) }}
                </td>
                <td class="p-3 align-top text-center">
                  <button type="button" class="text-gray-400 hover:text-danger" title="Remove Item" @click="removeItem(idx)">
                    <FeatherIcon name="trash-2" size="14" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Calculation Summary Box -->
        <div class="mb-6 flex justify-end">
          <div class="w-full max-w-sm space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Sub Total:</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ formatRupiah(subTotal) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600 dark:text-gray-400">Voucher / Discount:</span>
              <div class="w-32">
                <input
                  v-model.number="voucherDiscount"
                  type="number"
                  min="0"
                  class="w-full rounded border border-gray-200 bg-gray-50 p-1 text-end text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600 dark:text-gray-400">Shipping Cost:</span>
              <div class="w-32">
                <input
                  v-model.number="shippingCost"
                  type="number"
                  min="0"
                  class="w-full rounded border border-gray-200 bg-gray-50 p-1 text-end text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div class="flex justify-between border-t border-gray-100 pt-2 dark:border-gray-800">
              <span class="text-gray-600 dark:text-gray-400">Sub Total before Tax:</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ formatRupiah(subTotalBeforeTax) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">PPN (11%):</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ formatRupiah(ppnAmount) }}</span>
            </div>
            <div class="flex justify-between border-t-2 border-gray-300 pt-2 text-sm font-bold dark:border-gray-700">
              <span class="text-gray-900 dark:text-white">Grand Total:</span>
              <span class="text-primary">{{ formatRupiah(grandTotal) }}</span>
            </div>
          </div>
        </div>

        <!-- Terms & Conditions -->
        <div class="mb-6 rounded-lg border border-gray-100 bg-gray-50 p-4 text-xs dark:border-gray-800 dark:bg-gray-800/40">
          <span class="font-bold text-gray-900 dark:text-white">Terms & Conditions:</span>
          <ol class="mt-2 list-decimal space-y-1 ps-4 text-gray-600 dark:text-gray-300">
            <li v-for="(term, idx) in terms" :key="idx">{{ term }}</li>
          </ol>
        </div>

        <!-- Submit Bar -->
        <div class="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <NuxtLink
            to="/quotation"
            class="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-6 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            <FeatherIcon v-if="!isSubmitting" name="check" size="14" />
            <span>{{ isSubmitting ? "Updating..." : "Update Quotation" }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
