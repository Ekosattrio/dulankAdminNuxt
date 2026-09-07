<script setup lang="ts">
import type { Customer } from "~/components/forms/CustomerLiveSearch.vue";

definePageMeta({
  layout: "pos",
});

useHead({
  title: "POS - Kacetak System",
});

const { formatRupiah } = useFormatters();

interface POSProduct {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  specs?: string;
}

interface CartItem {
  id: string;
  productId: string;
  code: string;
  name: string;
  category: string;
  price: number;
  qty: number;
  specs: string;
  jobTitle: string;
}

const categories = [
  { id: "all", name: "All Categories", count: 80, icon: "/assets/img/categories/category-01.png" },
  { id: "cetak", name: "Cetak Full Color", count: 12, icon: "/assets/img/categories/category-01.png" },
  { id: "headphones", name: "Headphones", count: 4, icon: "/assets/img/categories/category-02.png" },
  { id: "shoes", name: "Shoes", count: 14, icon: "/assets/img/categories/category-03.png" },
  { id: "mobiles", name: "Mobiles", count: 7, icon: "/assets/img/categories/category-04.png" },
  { id: "watches", name: "Watches", count: 16, icon: "/assets/img/categories/category-05.png" },
  { id: "laptops", name: "Laptops", count: 18, icon: "/assets/img/categories/category-06.png" },
];

const selectedCategory = ref("all");
const productSearchQuery = ref("");

const products = ref<POSProduct[]>([
  {
    id: "p1",
    code: "PT0001",
    name: "Brosur Full Color A4",
    category: "cetak",
    price: 15800,
    stock: 50,
    image: "/assets/img/products/brosur.png",
    specs: "A4, Art Paper 150gr, Tanpa Laminasi",
  },
  {
    id: "p2",
    code: "PT0002",
    name: "Ideapad slim 7",
    category: "laptops",
    price: 15800,
    stock: 30,
    image: "/assets/img/products/pos-product-07.png",
  },
  {
    id: "p3",
    code: "PT0003",
    name: "Headset Iphone",
    category: "headphones",
    price: 15800,
    stock: 30,
    image: "/assets/img/products/pos-product-08.png",
  },
  {
    id: "p4",
    code: "PT0004",
    name: "IPhone 14 64GB",
    category: "mobiles",
    price: 15800,
    stock: 30,
    image: "/assets/img/products/pos-product-01.png",
  },
  {
    id: "p5",
    code: "PT0005",
    name: "Samsung ROG",
    category: "laptops",
    price: 15800,
    stock: 30,
    image: "/assets/img/products/pos-product-12.png",
  },
  {
    id: "p6",
    code: "PT0006",
    name: "Airpod 2",
    category: "headphones",
    price: 5478,
    stock: 47,
    image: "/assets/img/products/pos-product-05.png",
  },
  {
    id: "p7",
    code: "PT0007",
    name: "SWAGME Earphone",
    category: "headphones",
    price: 6587,
    stock: 14,
    image: "/assets/img/products/pos-product-08.png",
  },
  {
    id: "p8",
    code: "PT0008",
    name: "Red Nike Angelo",
    category: "shoes",
    price: 7800,
    stock: 78,
    image: "/assets/img/products/pos-product-04.png",
  },
  {
    id: "p9",
    code: "PT0009",
    name: "Blue White OGR",
    category: "shoes",
    price: 987,
    stock: 54,
    image: "/assets/img/products/pos-product-06.png",
  },
  {
    id: "p10",
    code: "PT0010",
    name: "MacBook Pro M2",
    category: "laptops",
    price: 1000,
    stock: 140,
    image: "/assets/img/products/pos-product-02.png",
  },
  {
    id: "p11",
    code: "PT0011",
    name: "Rolex Tribute V3",
    category: "watches",
    price: 6800,
    stock: 220,
    image: "/assets/img/products/pos-product-03.png",
  },
  {
    id: "p12",
    code: "PT0012",
    name: "Timex Black Silver",
    category: "watches",
    price: 1457,
    stock: 24,
    image: "/assets/img/products/pos-product-09.png",
  },
  {
    id: "p13",
    code: "PT0013",
    name: "Tablet 1.02 inch",
    category: "mobiles",
    price: 4744,
    stock: 14,
    image: "/assets/img/products/pos-product-10.png",
  },
  {
    id: "p14",
    code: "PT0014",
    name: "Fossil Pair Of 3 in 1",
    category: "watches",
    price: 789,
    stock: 40,
    image: "/assets/img/products/pos-product-11.png",
  },
  {
    id: "p15",
    code: "PT0015",
    name: "Green Nike Fe",
    category: "shoes",
    price: 7847,
    stock: 78,
    image: "/assets/img/products/pos-product-18.png",
  },
]);

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchesCategory = selectedCategory.value === "all" || p.category === selectedCategory.value;
    const matchesSearch =
      !productSearchQuery.value ||
      p.name.toLowerCase().includes(productSearchQuery.value.toLowerCase()) ||
      p.code.toLowerCase().includes(productSearchQuery.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
});

// Cart State
const cart = ref<CartItem[]>([
  {
    id: "c1",
    productId: "p1",
    code: "PT0005",
    name: "Cetak Full Color",
    category: "cetak",
    price: 2000,
    qty: 1,
    specs: "A3, 80*80, Art Paper, SM 52 4 Warna, 1 Sisi Cetak, Doff, 1 lipatan",
    jobTitle: "Brosur PPDN",
  },
]);

const customer = ref<Customer>({
  name: "Walk-in Customer",
  phone: "-",
  email: "-",
  address: "-",
});

// Modifiers
const discountAmount = ref(0);
const shippingCost = ref(0);
const taxRate = ref(0); // percent

const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.qty, 0));
const taxAmount = computed(() => Math.round(((subtotal.value - discountAmount.value) * taxRate.value) / 100));
const totalPayable = computed(() => Math.max(0, subtotal.value - discountAmount.value + shippingCost.value + taxAmount.value));

const addToCart = (p: POSProduct) => {
  const existing = cart.value.find((item) => item.productId === p.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.value.push({
      id: String(Date.now()),
      productId: p.id,
      code: p.code,
      name: p.name,
      category: p.category,
      price: p.price,
      qty: 1,
      specs: p.specs || "Standard Specification",
      jobTitle: p.name,
    });
  }
};

const updateQty = (item: CartItem, delta: number) => {
  item.qty += delta;
  if (item.qty <= 0) {
    cart.value = cart.value.filter((i) => i.id !== item.id);
  }
};

const removeCartItem = (id: string) => {
  cart.value = cart.value.filter((i) => i.id !== id);
};

const clearCart = () => {
  cart.value = [];
};

// Modals
const taxModalOpen = ref(false);
const shippingModalOpen = ref(false);
const discountModalOpen = ref(false);
const holdModalOpen = ref(false);
const paymentModalOpen = ref(false);
const receiptModalOpen = ref(false);
const ordersModalOpen = ref(false);
const transactionsModalOpen = ref(false);
const addCustomerModalOpen = ref(false);
const editItemModalOpen = ref(false);

const editingItem = ref<CartItem | null>(null);
const openEditItem = (item: CartItem) => {
  editingItem.value = JSON.parse(JSON.stringify(item));
  editItemModalOpen.value = true;
};
const saveEditingItem = () => {
  if (!editingItem.value) return;
  const idx = cart.value.findIndex((i) => i.id === editingItem.value?.id);
  if (idx !== -1) {
    cart.value[idx] = editingItem.value;
  }
  editItemModalOpen.value = false;
};

// Hold orders
const holdOrders = ref<Array<{ id: string; ref: string; total: number; time: string; items: CartItem[] }>>([]);
const holdReference = ref("");

const confirmHold = () => {
  if (cart.value.length === 0) return;
  holdOrders.value.push({
    id: String(Date.now()),
    ref: holdReference.value || `HOLD-${holdOrders.value.length + 1}`,
    total: totalPayable.value,
    time: new Date().toLocaleTimeString(),
    items: JSON.parse(JSON.stringify(cart.value)),
  });
  cart.value = [];
  holdReference.value = "";
  holdModalOpen.value = false;
};

const restoreHold = (h: (typeof holdOrders.value)[0]) => {
  cart.value = JSON.parse(JSON.stringify(h.items));
  holdOrders.value = holdOrders.value.filter((item) => item.id !== h.id);
  ordersModalOpen.value = false;
};

// Payment State
const paymentMethod = ref<"cash" | "card" | "bank" | "qris">("cash");
const cashReceived = ref<number>(0);
const changeDue = computed(() => Math.max(0, cashReceived.value - totalPayable.value));

const openPaymentModal = () => {
  if (cart.value.length === 0) return;
  cashReceived.value = totalPayable.value;
  paymentModalOpen.value = true;
};

const completePayment = () => {
  paymentModalOpen.value = false;
  receiptModalOpen.value = true;
};

const printThermalReceipt = () => {
  window.print();
};

const resetAll = () => {
  cart.value = [];
  discountAmount.value = 0;
  shippingCost.value = 0;
  taxRate.value = 0;
  receiptModalOpen.value = false;
};
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-gray-100 dark:bg-gray-950">
    <!-- POS Top Navigation -->
    <header
      class="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-secondary/90"
        >
          <FeatherIcon name="home" size="14" />
          <span>Dashboard Admin</span>
        </NuxtLink>

        <button
          type="button"
          class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="ordersModalOpen = true"
        >
          <FeatherIcon name="shopping-cart" size="14" />
          <span>View Orders</span>
          <span v-if="holdOrders.length > 0" class="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] text-white">
            {{ holdOrders.length }}
          </span>
        </button>

        <button
          type="button"
          class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="clearCart"
        >
          <FeatherIcon name="rotate-cw" size="14" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          class="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
          @click="transactionsModalOpen = true"
        >
          <FeatherIcon name="refresh-ccw" size="14" />
          <span>Transaction</span>
        </button>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Dulank Printing POS</span>
        <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
      </div>
    </header>

    <!-- Main Content Area: 2 Columns -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Column: Categories & Product Grid -->
      <div class="flex flex-1 flex-col overflow-y-auto p-4 lg:w-2/3">
        <!-- Categories Bar -->
        <div class="mb-4">
          <div class="mb-2 flex items-center justify-between">
            <h5 class="text-sm font-bold text-gray-900 dark:text-white">Categories</h5>
            <div class="relative w-64">
              <input
                v-model="productSearchQuery"
                type="text"
                placeholder="Search products..."
                class="w-full rounded-lg border border-gray-200 bg-white py-1.5 ps-8 pe-3 text-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <span class="absolute inset-y-0 start-0 flex items-center ps-2.5 text-gray-400">
                <FeatherIcon name="search" size="13" />
              </span>
            </div>
          </div>

          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              :class="[
                'flex shrink-0 items-center gap-2.5 rounded-xl border p-2.5 transition text-start shadow-sm',
                selectedCategory === cat.id
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 text-gray-700 dark:text-gray-300',
              ]"
              @click="selectedCategory = cat.id"
            >
              <img :src="cat.icon" :alt="cat.name" class="h-9 w-9 rounded-lg object-cover" />
              <div>
                <p class="text-xs font-bold leading-tight">{{ cat.name }}</p>
                <span class="text-[10px] text-gray-500">{{ cat.count }} Items</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="flex-1">
          <h5 class="mb-3 text-sm font-bold text-gray-900 dark:text-white">Products</h5>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4">
            <div
              v-for="prod in filteredProducts"
              :key="prod.id"
              class="group flex cursor-pointer flex-col justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              @click="addToCart(prod)"
            >
              <div
                class="relative mb-2 flex h-28 items-center justify-center overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <img
                  :src="prod.image"
                  :alt="prod.name"
                  class="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                />
                <span
                  class="absolute end-1.5 top-1.5 rounded-full bg-primary/10 p-1 text-primary opacity-0 transition group-hover:opacity-100"
                >
                  <FeatherIcon name="plus" size="12" />
                </span>
              </div>

              <div>
                <span class="text-[10px] font-semibold uppercase text-gray-400">{{ prod.category }}</span>
                <h6 class="line-clamp-1 text-xs font-bold text-gray-900 dark:text-white">{{ prod.name }}</h6>
                <div class="mt-2 flex items-center justify-between text-xs">
                  <span class="text-[10px] text-gray-500">{{ prod.stock }} Pcs</span>
                  <span class="font-bold text-primary">{{ formatRupiah(prod.price) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Cart & Checkout -->
      <div class="flex w-full flex-col border-s border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:w-1/3">
        <!-- Customer Selector Bar -->
        <div class="border-b border-gray-100 p-3 dark:border-gray-800">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-gray-700 dark:text-gray-300">Customer:</span>
            <button type="button" class="font-semibold text-primary hover:underline" @click="addCustomerModalOpen = true">
              + Change / New
            </button>
          </div>
          <div
            class="mt-1 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          >
            <span>{{ customer.name }}</span>
            <span class="text-gray-400">{{ customer.phone }}</span>
          </div>
        </div>

        <!-- Product Added List -->
        <div class="flex items-center justify-between border-b border-gray-100 px-3 py-2 text-xs dark:border-gray-800">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-gray-900 dark:text-white">Product Added</span>
            <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              {{ cart.length }}
            </span>
          </div>
          <button type="button" class="text-xs text-danger hover:underline" @click="clearCart">Clear all</button>
        </div>

        <!-- Scrollable Cart Items -->
        <div class="flex-1 overflow-y-auto p-3 space-y-2.5">
          <div v-if="cart.length === 0" class="flex h-48 flex-col items-center justify-center text-center text-gray-400">
            <FeatherIcon name="shopping-cart" size="32" class="opacity-30" />
            <p class="mt-2 text-xs">Your cart is empty</p>
            <p class="text-[11px] text-gray-400">Select items from the catalog</p>
          </div>

          <div
            v-for="item in cart"
            :key="item.id"
            class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 dark:border-gray-800 dark:bg-gray-800/40"
          >
            <div class="flex items-center gap-2.5">
              <div class="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white p-1 dark:bg-gray-900">
                <img src="/assets/img/products/brosur.png" :alt="item.name" class="h-full w-full object-contain" />
              </div>
              <div class="text-xs">
                <p class="font-bold text-gray-900 dark:text-white">{{ item.name }}</p>
                <p class="line-clamp-1 text-[10px] text-gray-500">{{ item.specs }}</p>
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-primary">{{ formatRupiah(item.price) }}</span>
                  <span class="text-[10px] text-gray-400">Job: {{ item.jobTitle }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <!-- Stepper -->
              <div class="flex items-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <button
                  type="button"
                  class="flex h-6 w-6 items-center justify-center text-gray-500 hover:text-danger"
                  @click="updateQty(item, -1)"
                >
                  <FeatherIcon name="minus" size="11" />
                </button>
                <input
                  v-model.number="item.qty"
                  type="text"
                  class="w-7 text-center text-xs font-semibold text-gray-900 focus:outline-none dark:text-white"
                />
                <button
                  type="button"
                  class="flex h-6 w-6 items-center justify-center text-gray-500 hover:text-primary"
                  @click="updateQty(item, 1)"
                >
                  <FeatherIcon name="plus" size="11" />
                </button>
              </div>

              <!-- Item Actions -->
              <button type="button" class="text-gray-400 hover:text-primary" title="Edit item specs" @click="openEditItem(item)">
                <FeatherIcon name="edit" size="13" />
              </button>
              <button type="button" class="text-gray-400 hover:text-danger" title="Delete item" @click="removeCartItem(item.id)">
                <FeatherIcon name="trash-2" size="13" />
              </button>
            </div>
          </div>
        </div>

        <!-- Modifiers Bar: Hold / Void / Tax / Shipping / Discount -->
        <div class="border-t border-gray-100 p-3 dark:border-gray-800">
          <div class="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              class="flex items-center justify-center gap-1 rounded-lg bg-blue-50 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300"
              @click="holdModalOpen = true"
            >
              <FeatherIcon name="pause" size="13" />
              <span>Hold Order</span>
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-1 rounded-lg bg-rose-50 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300"
              @click="clearCart"
            >
              <FeatherIcon name="trash-2" size="13" />
              <span>Void</span>
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              class="flex items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              @click="taxModalOpen = true"
            >
              <FeatherIcon name="percent" size="12" />
              <span>Tax ({{ taxRate }}%)</span>
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              @click="shippingModalOpen = true"
            >
              <FeatherIcon name="truck" size="12" />
              <span>Shipping</span>
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-1 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              @click="discountModalOpen = true"
            >
              <FeatherIcon name="tag" size="12" />
              <span>Discount</span>
            </button>
          </div>
        </div>

        <!-- Calculations & Checkout Button -->
        <div class="border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30">
          <div class="mb-3 space-y-1 text-xs">
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Sub Total:</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ formatRupiah(subtotal) }}</span>
            </div>
            <div v-if="discountAmount > 0" class="flex justify-between text-emerald-600">
              <span>Discount:</span>
              <span>-{{ formatRupiah(discountAmount) }}</span>
            </div>
            <div v-if="shippingCost > 0" class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Shipping:</span>
              <span>{{ formatRupiah(shippingCost) }}</span>
            </div>
            <div v-if="taxRate > 0" class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Tax ({{ taxRate }}%):</span>
              <span>{{ formatRupiah(taxAmount) }}</span>
            </div>
            <div class="flex justify-between border-t border-gray-200 pt-1 text-sm font-bold dark:border-gray-700">
              <span class="text-gray-900 dark:text-white">Total Payable:</span>
              <span class="text-primary">{{ formatRupiah(totalPayable) }}</span>
            </div>
          </div>

          <button
            type="button"
            :disabled="cart.length === 0"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary/90 disabled:opacity-50"
            @click="openPaymentModal"
          >
            <FeatherIcon name="credit-card" size="16" />
            <span>Payment Total {{ formatRupiah(totalPayable) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->

    <!-- Tax Modal -->
    <BaseModal v-model="taxModalOpen" title="Order Tax" size="sm">
      <div class="p-5 text-xs space-y-3">
        <label class="font-semibold text-gray-700 dark:text-gray-300">Select Tax Rate</label>
        <select
          v-model="taxRate"
          class="w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option :value="0">No Tax (0%)</option>
          <option :value="10">Standard 10%</option>
          <option :value="11">PPN 11%</option>
          <option :value="15">Luxury 15%</option>
        </select>
        <div class="flex justify-end pt-2">
          <button type="button" class="rounded bg-primary px-4 py-1.5 font-semibold text-white" @click="taxModalOpen = false">
            Apply
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Shipping Modal -->
    <BaseModal v-model="shippingModalOpen" title="Shipping Cost" size="sm">
      <div class="p-5 text-xs space-y-3">
        <label class="font-semibold text-gray-700 dark:text-gray-300">Enter Shipping Fee</label>
        <input
          v-model.number="shippingCost"
          type="number"
          min="0"
          class="w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <div class="flex justify-end pt-2">
          <button
            type="button"
            class="rounded bg-primary px-4 py-1.5 font-semibold text-white"
            @click="shippingModalOpen = false"
          >
            Apply
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Discount Modal -->
    <BaseModal v-model="discountModalOpen" title="Order Discount" size="sm">
      <div class="p-5 text-xs space-y-3">
        <label class="font-semibold text-gray-700 dark:text-gray-300">Discount Amount</label>
        <input
          v-model.number="discountAmount"
          type="number"
          min="0"
          class="w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <div class="flex justify-end pt-2">
          <button
            type="button"
            class="rounded bg-primary px-4 py-1.5 font-semibold text-white"
            @click="discountModalOpen = false"
          >
            Apply
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Hold Order Modal -->
    <BaseModal v-model="holdModalOpen" title="Hold Order" size="sm">
      <div class="p-5 text-xs space-y-3">
        <h3 class="text-center text-lg font-bold text-gray-900 dark:text-white">{{ formatRupiah(totalPayable) }}</h3>
        <label class="font-semibold text-gray-700 dark:text-gray-300">Order Reference / Note</label>
        <input
          v-model="holdReference"
          type="text"
          placeholder="e.g. Table 4 / Pak Budi"
          class="w-full rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <p class="text-gray-400">The current cart will be saved to held orders. You can retrieve it anytime from View Orders.</p>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="rounded border px-3 py-1.5" @click="holdModalOpen = false">Cancel</button>
          <button type="button" class="rounded bg-primary px-4 py-1.5 font-semibold text-white" @click="confirmHold">
            Hold Order
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- View Orders (Held) Modal -->
    <BaseModal v-model="ordersModalOpen" title="Held Orders" size="md">
      <div class="p-5 text-xs space-y-3">
        <div v-if="holdOrders.length === 0" class="py-6 text-center text-gray-400">No held orders found</div>
        <div
          v-for="h in holdOrders"
          :key="h.id"
          class="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
        >
          <div>
            <p class="font-bold text-gray-900 dark:text-white">{{ h.ref }}</p>
            <p class="text-gray-500">{{ h.items.length }} items | {{ h.time }}</p>
            <span class="font-semibold text-primary">{{ formatRupiah(h.total) }}</span>
          </div>
          <button type="button" class="rounded bg-primary px-3 py-1.5 font-semibold text-white" @click="restoreHold(h)">
            Resume
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Payment Modal -->
    <BaseModal v-model="paymentModalOpen" title="Payment Checkout" size="md">
      <div class="p-5 text-xs space-y-4">
        <!-- Method Selector -->
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="method in ['cash', 'card', 'bank', 'qris'] as const"
            :key="method"
            type="button"
            :class="[
              'rounded-lg border p-2 font-semibold uppercase text-xs transition',
              paymentMethod === method
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400',
            ]"
            @click="paymentMethod = method"
          >
            {{ method }}
          </button>
        </div>

        <div class="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
          <span class="text-gray-500">Total Payable Amount</span>
          <h2 class="text-2xl font-bold text-primary">{{ formatRupiah(totalPayable) }}</h2>
        </div>

        <!-- Cash input & quick increments -->
        <div v-if="paymentMethod === 'cash'" class="space-y-3">
          <div>
            <label class="font-semibold text-gray-700 dark:text-gray-300">Cash Received</label>
            <input
              v-model.number="cashReceived"
              type="number"
              class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-base font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div class="flex gap-2">
            <button type="button" class="rounded border px-2.5 py-1 text-xs" @click="cashReceived = totalPayable">Exact</button>
            <button type="button" class="rounded border px-2.5 py-1 text-xs" @click="cashReceived = totalPayable + 10000">
              +10k
            </button>
            <button type="button" class="rounded border px-2.5 py-1 text-xs" @click="cashReceived = totalPayable + 50000">
              +50k
            </button>
            <button type="button" class="rounded border px-2.5 py-1 text-xs" @click="cashReceived = totalPayable + 100000">
              +100k
            </button>
          </div>

          <div
            class="flex justify-between rounded-lg bg-emerald-50 p-3 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <span class="font-semibold">Change Due:</span>
            <span class="font-bold">{{ formatRupiah(changeDue) }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button type="button" class="rounded border px-4 py-2" @click="paymentModalOpen = false">Cancel</button>
          <button
            type="button"
            class="rounded-lg bg-primary px-6 py-2 font-bold text-white hover:bg-primary/90"
            @click="completePayment"
          >
            Complete Order
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Receipt Print Modal (80mm Thermal Receipt Preview) -->
    <BaseModal v-model="receiptModalOpen" title="Order Completed" size="sm">
      <div class="p-5 text-center text-xs space-y-4">
        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50"
        >
          <FeatherIcon name="check" size="24" />
        </div>
        <h4 class="text-base font-bold text-gray-900 dark:text-white">Transaction Successful!</h4>

        <!-- Mini Receipt -->
        <div
          id="receipt-preview"
          class="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-start font-mono text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <div class="text-center font-bold">KACETAK SYSTEM</div>
          <div class="text-center text-[10px] text-gray-500">Jl. Arif Rahman Hakim Karawang</div>
          <div class="my-2 border-b border-dashed border-gray-300 dark:border-gray-700"></div>

          <div v-for="item in cart" :key="item.id" class="flex justify-between py-0.5">
            <span>{{ item.qty }}x {{ item.name }}</span>
            <span>{{ formatRupiah(item.price * item.qty) }}</span>
          </div>

          <div class="my-2 border-b border-dashed border-gray-300 dark:border-gray-700"></div>
          <div class="flex justify-between font-bold">
            <span>TOTAL:</span>
            <span>{{ formatRupiah(totalPayable) }}</span>
          </div>
          <div class="flex justify-between">
            <span>PAID:</span>
            <span>{{ formatRupiah(cashReceived) }}</span>
          </div>
          <div class="flex justify-between">
            <span>CHANGE:</span>
            <span>{{ formatRupiah(changeDue) }}</span>
          </div>
          <div class="mt-3 text-center text-[9px] text-gray-400">Thank You For Shopping With Us!</div>
        </div>

        <div class="flex justify-center gap-2 pt-2">
          <NuxtLink
            to="/sales-receipt"
            target="_blank"
            class="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90"
          >
            Print Receipt
          </NuxtLink>
          <button
            type="button"
            class="rounded-lg border border-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300"
            @click="resetAll"
          >
            New Sale
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
