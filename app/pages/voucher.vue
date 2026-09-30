<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Coupons" subtitle="Manage Your Coupons">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refresh"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add New Coupons</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search coupon name or code..." />
        <button
          type="button"
          :class="[
            'flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition',
            showFilters
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
          ]"
          @click="showFilters = !showFilters"
        >
          <CommonFeatherIcon name="filter" size="16" />
          Filters
        </button>
      </div>

      <!-- Filter Section -->
      <div v-if="showFilters" class="mb-5 rounded-lg border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/30">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Coupon Type</label>
            <select
              v-model="filterType"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Types</option>
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
            <select
              v-model="filterStatus"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Store Filter</label>
            <select
              v-model="filterStore"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Stores</option>
              <option value="Ellectro Mart">Ellectro Mart</option>
              <option value="Ekos Mart">Ekos Mart</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              type="button"
              class="w-full h-10 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              @click="resetFilters"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Code</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Type</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Discount</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Limit</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Used</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Valid</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredCoupons" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 font-mono text-[11px] text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
                  {{ item.code }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.type }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-medium">{{ item.discountDisplay }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.limit === 0 ? "Unlimited" : String(item.limit).padStart(2, "0") }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ String(item.used).padStart(2, "0") }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.validDate }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredCoupons.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No vouchers or coupons found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Coupon Modal -->
    <CommonBaseModal v-model="showAddModal" title="Add Coupons" maxWidth="lg">
      <form @submit.prevent="saveCoupon" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Name" required>
            <input
              v-model="formData.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="e.g. Coupons 21"
            />
          </CommonFormField>
          <CommonFormField label="Code" required>
            <input
              v-model="formData.code"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="e.g. CHRISTMAS20"
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Type" required>
            <select
              v-model="formData.type"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Discount Value" required>
            <input
              v-model.number="formData.discount"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              min="1"
              placeholder="Amount or %"
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Limit" hint="0 for Unlimited">
          <input
            v-model.number="formData.limit"
            type="number"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            min="0"
            placeholder="Limit"
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Start Date">
            <input
              v-model="formData.startDate"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <CommonFormField label="End Date">
            <input
              v-model="formData.endDate"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>

        <!-- Switches -->
        <div class="space-y-2.5 rounded-lg border border-gray-100 p-3.5 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Applicable to All Products</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.allProducts ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
              ]"
              @click="formData.allProducts = !formData.allProducts"
            >
              <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.allProducts ? 'translate-x-5' : 'translate-x-0']" />
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Once Per Customer</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.oncePerCustomer ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
              ]"
              @click="formData.oncePerCustomer = !formData.oncePerCustomer"
            >
              <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.oncePerCustomer ? 'translate-x-5' : 'translate-x-0']" />
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Active Status</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
              ]"
              @click="formData.isActive = !formData.isActive"
            >
              <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.isActive ? 'translate-x-5' : 'translate-x-0']" />
            </button>
          </div>
        </div>

        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- Edit Coupon Modal -->
    <CommonBaseModal v-model="showEditModal" title="Edit Coupons" maxWidth="lg">
      <form @submit.prevent="updateCoupon" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Name" required>
            <input
              v-model="formData.name"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Code" required>
            <input
              v-model="formData.code"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Type" required>
            <select
              v-model="formData.type"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Discount Value" required>
            <input
              v-model.number="formData.discount"
              type="number"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              min="1"
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Limit" hint="0 for Unlimited">
          <input
            v-model.number="formData.limit"
            type="number"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            min="0"
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Start Date">
            <input
              v-model="formData.startDate"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <CommonFormField label="End Date">
            <input
              v-model="formData.endDate"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>

        <!-- Switches -->
        <div class="space-y-2.5 rounded-lg border border-gray-100 p-3.5 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Applicable to All Products</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.allProducts ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
              ]"
              @click="formData.allProducts = !formData.allProducts"
            >
              <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.allProducts ? 'translate-x-5' : 'translate-x-0']" />
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Once Per Customer</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.oncePerCustomer ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
              ]"
              @click="formData.oncePerCustomer = !formData.oncePerCustomer"
            >
              <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.oncePerCustomer ? 'translate-x-5' : 'translate-x-0']" />
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Active Status</span>
            <button
              type="button"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                formData.isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700',
              ]"
              @click="formData.isActive = !formData.isActive"
            >
              <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.isActive ? 'translate-x-5' : 'translate-x-0']" />
            </button>
          </div>
        </div>

        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

useHead({
  title: "Voucher - Kacetak System",
});

const { data: voucherData } = await useFetch<VoucherItem[]>('/api/voucher')
const coupons = ref<VoucherItem[]>(voucherData.value ?? [])
useMockSync('voucher', coupons);

const searchQuery = ref("");
const showFilters = ref(false);
const filterType = ref("");
const filterStatus = ref("");
const filterStore = ref("");

const filteredCoupons = computed(() => {
  return coupons.value.filter((item) => {
    const matchSearch =
      searchQuery.value === "" ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchType = !filterType.value || item.type === filterType.value;
    const matchStatus = !filterStatus.value || item.status === filterStatus.value;
    return matchSearch && matchType && matchStatus;
  });
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const editingId = ref<number | null>(null);

const defaultFormData = () => ({
  name: "",
  code: "",
  type: "Fixed" as "Fixed" | "Percentage",
  discount: 20000,
  limit: 10,
  startDate: "",
  endDate: "",
  allProducts: true,
  oncePerCustomer: false,
  isActive: true,
});

const formData = ref(defaultFormData());

const openAddModal = () => {
  formData.value = defaultFormData();
  showAddModal.value = true;
};

const openEditModal = (item: VoucherItem) => {
  editingId.value = item.id;
  formData.value = {
    name: item.name,
    code: item.code,
    type: item.type,
    discount: item.discount,
    limit: item.limit,
    startDate: item.startDate,
    endDate: item.endDate,
    allProducts: item.allProducts,
    oncePerCustomer: item.oncePerCustomer,
    isActive: item.status === "Active",
  };
  showEditModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingId.value = null;
};

const formatDiscountDisplay = (val: number, type: "Fixed" | "Percentage") => {
  if (type === "Percentage") return `${val}%`;
  return `Rp${new Intl.NumberFormat("id-ID").format(val)}`;
};

const saveCoupon = () => {
  const newId = Math.max(0, ...coupons.value.map((c) => c.id)) + 1;
  coupons.value.unshift({
    id: newId,
    name: formData.value.name,
    code: formData.value.code,
    type: formData.value.type,
    discount: formData.value.discount,
    discountDisplay: formatDiscountDisplay(formData.value.discount, formData.value.type),
    limit: formData.value.limit,
    used: 0,
    validDate: formData.value.endDate || "Ongoing",
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    allProducts: formData.value.allProducts,
    oncePerCustomer: formData.value.oncePerCustomer,
    status: formData.value.isActive ? "Active" : "Inactive",
  });
  closeModal();
};

const updateCoupon = () => {
  if (editingId.value === null) return;
  const idx = coupons.value.findIndex((c) => c.id === editingId.value);
  if (idx !== -1) {
    coupons.value[idx] = {
      ...coupons.value[idx],
      name: formData.value.name,
      code: formData.value.code,
      type: formData.value.type,
      discount: formData.value.discount,
      discountDisplay: formatDiscountDisplay(formData.value.discount, formData.value.type),
      limit: formData.value.limit,
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      validDate: formData.value.endDate || coupons.value[idx].validDate,
      allProducts: formData.value.allProducts,
      oncePerCustomer: formData.value.oncePerCustomer,
      status: formData.value.isActive ? "Active" : "Inactive",
    };
  }
  closeModal();
};

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this coupon?")) {
    coupons.value = coupons.value.filter((c) => c.id !== id);
  }
};

const resetFilters = () => {
  searchQuery.value = "";
  filterType.value = "";
  filterStatus.value = "";
  filterStore.value = "";
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  resetFilters();
};</script>