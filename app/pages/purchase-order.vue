<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Purchase Order List" subtitle="Manage your Purchase Orders">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printList"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refreshList"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add Purchase Order</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- PO List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <CommonSearchFilter v-model="searchQuery" placeholder="Search..." />

          <!-- Date Range Picker (custom) -->
          <div class="relative">
            <input
              type="text"
              readonly
              placeholder="Date"
              :value="selectedDateRangeLabel"
              class="w-full h-10 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 pe-4 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              @click="showDateDropdown = !showDateDropdown"
            />
            <div
              v-if="showDateDropdown"
              class="absolute z-20 mt-1 w-48 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('kemarin')">Kemarin</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('7hari')">7 Hari Terakhir</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('bulanIni')">Bulan Ini</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('bulanLalu')">Bulan Lalu</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('tahunLalu')">Tahun Lalu</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" @click="setDateRange('semua')">Semua</div>
            </div>
          </div>
        </div>

        <CommonFilterSelect
          v-model="statusFilter"
          allLabel="Status: All"
          :options="[
            { value: 'Sent', label: 'Sent' },
            { value: 'Draft', label: 'Draft' },
            { value: 'Cancel', label: 'Cancel' },
          ]"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">No PO</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">No Purchase</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Supplier</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Amount (IDR)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">PO Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Goods Receiving Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Goods Receiving Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Goods Receiving By</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredOrders" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ item.noPO }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.created }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.noPurchase }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.supplier }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">{{ formatNumber(item.amount) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.poStatus" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.goodsStatus" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.goodsDate || "-" }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.goodsBy || "-" }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteOrder(item)">
                  <template #extra>
                    <NuxtLink
                      to="/purchase-order-detail"
                      title="View Detail"
                      class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-sky-500 dark:hover:bg-gray-800"
                    >
                      <CommonFeatherIcon name="eye" size="16" />
                    </NuxtLink>
                  </template>
                </CommonRowActions>
              </td>
            </tr>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="11" class="p-8 text-center text-gray-400">No purchase orders found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Purchase Order Modal -->
    <CommonBaseModal v-model="showModal" :title="isEdit ? 'Edit Purchase Order' : 'Add Purchase Order'" maxWidth="xl">
      <form @submit.prevent="saveOrder" class="space-y-4">
        <!-- Header Form -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CommonFormField label="Supplier">
            <select
              v-model="formData.supplier"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option>PT Kertas Jaya</option>
              <option>PT Cipta Kreasi</option>
              <option>Global Inkindo</option>
              <option>Indo Material</option>
            </select>
          </CommonFormField>
          <CommonFormField label="No Purchase">
            <input
              v-model="formData.noPurchase"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <CommonFormField label="No PO">
            <input
              v-model="formData.noPO"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <CommonFormField label="Date">
            <input
              type="date"
              v-model="formData.date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>

        <!-- Line Items -->
        <div>
          <h5 class="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">Order Items</h5>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
              <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th class="w-10 px-3 py-2">#</th>
                  <th class="px-3 py-2 text-start">Product Name</th>
                  <th class="w-28 px-3 py-2 text-center">Qty</th>
                  <th class="w-24 px-3 py-2 text-center">Unit</th>
                  <th class="w-32 px-3 py-2 text-end">Price</th>
                  <th class="w-32 px-3 py-2 text-end">Amount</th>
                  <th class="w-10 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="(p, idx) in orderItems" :key="idx">
                  <td class="px-3 py-1.5">{{ idx + 1 }}</td>
                  <td class="px-3 py-1.5">
                    <input
                      v-model="p.name"
                      type="text"
                      class="w-full h-8 rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                  </td>
                  <td class="px-3 py-1.5">
                    <input
                      v-model.number="p.qty"
                      type="number"
                      min="1"
                      class="w-full h-8 rounded-md border border-gray-200 bg-white px-2 text-center text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                  </td>
                  <td class="px-3 py-1.5">
                    <select
                      v-model="p.unit"
                      class="w-full h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    >
                      <option>Kg</option>
                      <option>Ream</option>
                      <option>Pcs</option>
                      <option>Box</option>
                    </select>
                  </td>
                  <td class="px-3 py-1.5">
                    <input
                      v-model.number="p.price"
                      type="number"
                      class="w-full h-8 rounded-md border border-gray-200 bg-white px-2 text-end text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                  </td>
                  <td class="px-3 py-1.5 text-end font-bold">{{ formatNumber(p.qty * p.price) }}</td>
                  <td class="px-3 py-1.5 text-center">
                    <button type="button" class="rounded p-1 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950" @click="removeItem(idx)">
                      <CommonFeatherIcon name="trash-2" size="14" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            type="button"
            class="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
            @click="addItem"
          >
            <CommonFeatherIcon name="plus" size="14" />
            Add Product
          </button>
        </div>

        <!-- Goods Receive Section -->
        <div>
          <h5 class="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">Goods Receive</h5>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CommonFormField label="PO Document Status">
              <select
                v-model="formData.poStatus"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option>Sent</option>
                <option>Draft</option>
                <option>Cancel</option>
              </select>
            </CommonFormField>
            <CommonFormField label="Goods Receive Status">
              <select
                v-model="formData.goodsStatus"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option>Scheduled</option>
                <option>Complete</option>
                <option>Cancel</option>
              </select>
            </CommonFormField>
            <CommonFormField label="Goods Receive Date">
              <input
                type="date"
                v-model="formData.goodsDate"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </CommonFormField>
          </div>
        </div>

        <CommonModalFooter @cancel="showModal = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

// Sample Purchase Orders
const { data: purchaseOrderData } = await useFetch<any[]>('/api/purchase-order')
const orders = ref(purchaseOrderData.value ?? []);
useMockSync('purchase-order', orders);

// Search & Filter
const searchQuery = ref("");
const statusFilter = ref("");
const selectedDateRangeLabel = ref("");
const showDateDropdown = ref(false);

const setDateRange = (range: string) => {
  if (range === "kemarin") selectedDateRangeLabel.value = "Kemarin";
  else if (range === "7hari") selectedDateRangeLabel.value = "7 Hari Terakhir";
  else if (range === "bulanIni") selectedDateRangeLabel.value = "Bulan Ini";
  else if (range === "bulanLalu") selectedDateRangeLabel.value = "Bulan Lalu";
  else if (range === "tahunLalu") selectedDateRangeLabel.value = "Tahun Lalu";
  else selectedDateRangeLabel.value = "";
  showDateDropdown.value = false;
};

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q || o.noPO.toLowerCase().includes(q) || o.noPurchase.toLowerCase().includes(q) || o.supplier.toLowerCase().includes(q);

    const matchesStatus = !statusFilter.value || o.poStatus.toLowerCase() === statusFilter.value.toLowerCase();
    return matchesSearch && matchesStatus;
  });
});

// Modal Form State
const showModal = ref(false);
const isEdit = ref(false);
const formData = ref<any>({});
const orderItems = ref<any[]>([]);

const openAddModal = () => {
  isEdit.value = false;
  formData.value = {
    noPO: `PO-${String(orders.value.length + 1).padStart(6, "0")}`,
    date: new Date().toISOString().slice(0, 10),
    created: "Sales Staff",
    noPurchase: "PR-2512000001",
    supplier: "PT Kertas Jaya",
    poStatus: "Sent",
    goodsStatus: "Scheduled",
    goodsDate: "",
    goodsBy: "Admin",
  };
  orderItems.value = [
    { name: "Tinta Neotex 1Kg Cyan", qty: 2, unit: "Kg", price: 450000 },
    { name: "Kertas Art Paper 150gr", qty: 1, unit: "Ream", price: 600000 },
  ];
  showModal.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  formData.value = { ...item };
  orderItems.value = [
    { name: "Tinta Neotex 1Kg Cyan", qty: 2, unit: "Kg", price: 450000 },
    { name: "Kertas Art Paper 150gr", qty: 1, unit: "Ream", price: 600000 },
  ];
  showModal.value = true;
};

const addItem = () => {
  orderItems.value.push({ name: "", qty: 1, unit: "Pcs", price: 0 });
};

const removeItem = (idx: number) => {
  orderItems.value.splice(idx, 1);
};

const saveOrder = () => {
  const totalAmount = orderItems.value.reduce((acc, p) => acc + (p.qty || 0) * (p.price || 0), 0);
  if (isEdit.value) {
    const idx = orders.value.findIndex((o) => o.id === formData.value.id);
    if (idx !== -1) {
      orders.value[idx] = {
        ...formData.value,
        amount: totalAmount,
      };
    }
  } else {
    orders.value.unshift({
      id: Date.now(),
      ...formData.value,
      amount: totalAmount,
    });
  }
  showModal.value = false;
};

const deleteOrder = (item: any) => {
  if (confirm(`Are you sure you want to delete PO ${item.noPO}?`)) {
    orders.value = orders.value.filter((o) => o.id !== item.id);
  }
};

const printList = () => {
  window.print();
};

const refreshList = () => {
  searchQuery.value = "";
  statusFilter.value = "";
};
</script>