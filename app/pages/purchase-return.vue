<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Purchase Return List" subtitle="Manage your Returns">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="printList"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
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
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add Purchase Return</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Purchase Return Table Card -->
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
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" @click="setDateRange('semua')">Semua</div>
            </div>
          </div>
        </div>

        <CommonFilterSelect
          v-model="statusFilter"
          allLabel="Status: All"
          :options="[
            { value: 'Refunded', label: 'Refunded' },
            { value: 'Pending', label: 'Pending' },
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
              <th class="px-4 py-3 text-start whitespace-nowrap">No PR</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">No Purchase</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Supplier</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Amount (IDR)</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Paid (IDR)</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Due (IDR)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status By</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredReturns" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ item.noPR }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.created }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.noPurchase }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.supplier }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">{{ formatNumber(item.amount) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end text-emerald-600 dark:text-emerald-400">{{ formatNumber(item.paid) }}</td>
              <td :class="item.due > 0 ? 'px-4 py-3 whitespace-nowrap text-end text-rose-600 dark:text-rose-400' : 'px-4 py-3 whitespace-nowrap text-end text-gray-400'">
                {{ formatNumber(item.due) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill
                  :status="item.status || '-'"
                  :tone="item.status === 'Refunded' ? 'emerald' : item.status === 'Pending' ? 'amber' : item.status === 'Cancel' ? 'rose' : 'slate'"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.statusBy || "-" }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteReturn(item)">
                  <template #extra>
                    <NuxtLink
                      to="/purchase-return-detail"
                      title="View Detail"
                      class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-sky-500 dark:hover:bg-gray-800"
                    >
                      <CommonFeatherIcon name="eye" size="16" />
                    </NuxtLink>
                  </template>
                </CommonRowActions>
              </td>
            </tr>
            <tr v-if="filteredReturns.length === 0">
              <td colspan="11" class="p-8 text-center text-gray-400">No purchase returns found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Purchase Return Modal -->
    <CommonBaseModal v-model="showModal" :title="isEdit ? 'Edit Purchase Return' : 'Add Purchase Return'" maxWidth="xl">
      <form @submit.prevent="saveReturn" class="space-y-4">
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
          <CommonFormField label="No Purchase Return">
            <input
              v-model="formData.noPR"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <CommonFormField label="No Purchase Order / Ref">
            <input
              v-model="formData.noPurchase"
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

        <!-- Return Items -->
        <div>
          <h5 class="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">Return Items</h5>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
              <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th class="px-3 py-2 text-start">Product Name</th>
                  <th class="w-16 px-3 py-2 text-center">Qty</th>
                  <th class="w-24 px-3 py-2 text-center">Qty Return</th>
                  <th class="w-16 px-3 py-2 text-center">Unit</th>
                  <th class="w-32 px-3 py-2 text-end">Price</th>
                  <th class="w-32 px-3 py-2 text-end">Amount</th>
                  <th class="w-52 px-3 py-2">Description of return</th>
                  <th class="w-10 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="(item, idx) in returnItems" :key="idx">
                  <td class="px-3 py-1.5">
                    <input
                      v-model="item.name"
                      type="text"
                      class="w-full h-8 rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                  </td>
                  <td class="px-3 py-1.5 text-center">{{ item.qty }}</td>
                  <td class="px-3 py-1.5">
                    <input
                      v-model.number="item.qtyReturn"
                      type="number"
                      min="1"
                      class="w-full h-8 rounded-md border border-gray-200 bg-white px-2 text-center text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                  </td>
                  <td class="px-3 py-1.5 text-center">{{ item.unit }}</td>
                  <td class="px-3 py-1.5">
                    <input
                      v-model.number="item.price"
                      type="number"
                      class="w-full h-8 rounded-md border border-gray-200 bg-white px-2 text-end text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    />
                  </td>
                  <td class="px-3 py-1.5 text-end font-bold">{{ formatNumber(item.qtyReturn * item.price) }}</td>
                  <td class="px-3 py-1.5">
                    <input
                      v-model="item.reason"
                      type="text"
                      class="w-full h-8 rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      placeholder="Reason..."
                    />
                  </td>
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
            Add Return Item
          </button>
        </div>

        <!-- Bank & Totals -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p class="mb-1 text-xs font-bold text-gray-700 dark:text-gray-300">Refund To Bank : Bank BCA PT Dulank Semesta Cida - 1091956271</p>
            <CommonFormField label="Payment Return Status">
              <select
                v-model="formData.status"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option>Refunded</option>
                <option>Pending</option>
                <option>Cancel</option>
              </select>
            </CommonFormField>
          </div>
          <div class="space-y-2 rounded-lg border border-gray-100 p-3 dark:border-gray-800 sm:max-w-[260px] sm:ms-auto">
            <div class="flex justify-between text-sm font-bold text-gray-800 dark:text-gray-200">
              <span>Sub Total</span><span>Rp. {{ formatNumber(subTotal) }}</span>
            </div>
            <div class="flex justify-between text-sm font-bold text-gray-800 dark:text-gray-200">
              <span>Tax (PPN 11%)</span><span>0</span>
            </div>
            <div class="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-primary dark:border-gray-800">
              <span>Total</span><span>Rp. {{ formatNumber(subTotal) }}</span>
            </div>
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

// Sample Purchase Return Data
const { data: purchaseReturnData } = await useFetch<any[]>('/api/purchase-return')
const returns = ref(purchaseReturnData.value ?? []);

// Filter & Search
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

const filteredReturns = computed(() => {
  return returns.value.filter((r) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q || r.noPR.toLowerCase().includes(q) || r.noPurchase.toLowerCase().includes(q) || r.supplier.toLowerCase().includes(q);

    const matchesStatus = !statusFilter.value || r.status.toLowerCase() === statusFilter.value.toLowerCase();
    return matchesSearch && matchesStatus;
  });
});

// Modal Form State
const showModal = ref(false);
const isEdit = ref(false);
const formData = ref<any>({});
const returnItems = ref<any[]>([]);

const subTotal = computed(() => {
  return returnItems.value.reduce((acc, item) => acc + (item.qtyReturn || 0) * (item.price || 0), 0);
});

const openAddModal = () => {
  isEdit.value = false;
  formData.value = {
    noPR: `PRT-00${String(returns.value.length + 11).padStart(2, "0")}`,
    date: new Date().toISOString().slice(0, 10),
    created: "Sales Staff",
    noPurchase: "PUR000001",
    supplier: "PT Cipta Kreasi",
    status: "Pending",
    statusBy: "Admin",
    paid: 0,
    due: 0,
  };
  returnItems.value = [
    { name: "Tinta Cemani Cyan 1 Kg", qty: 2, qtyReturn: 2, unit: "Kg", price: 450000, reason: "Sudah Expired" },
  ];
  showModal.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  formData.value = { ...item };
  returnItems.value = [
    { name: "Tinta Cemani Cyan 1 Kg", qty: 2, qtyReturn: 2, unit: "Kg", price: 450000, reason: "Sudah Expired" },
    { name: "Kertas Art Paper 150gr", qty: 1, qtyReturn: 1, unit: "Ream", price: 600000, reason: "Salah Ukuran" },
  ];
  showModal.value = true;
};

const addItem = () => {
  returnItems.value.push({ name: "", qty: 1, qtyReturn: 1, unit: "Pcs", price: 0, reason: "" });
};

const removeItem = (idx: number) => {
  returnItems.value.splice(idx, 1);
};

const saveReturn = () => {
  const total = subTotal.value;
  if (isEdit.value) {
    const idx = returns.value.findIndex((r) => r.id === formData.value.id);
    if (idx !== -1) {
      returns.value[idx] = {
        ...formData.value,
        amount: total,
        due: formData.value.status === "Refunded" ? 0 : total,
        paid: formData.value.status === "Refunded" ? total : 0,
      };
    }
  } else {
    returns.value.unshift({
      id: Date.now(),
      ...formData.value,
      amount: total,
      due: formData.value.status === "Refunded" ? 0 : total,
      paid: formData.value.status === "Refunded" ? total : 0,
    });
  }
  showModal.value = false;
};

const deleteReturn = (item: any) => {
  if (confirm(`Are you sure you want to delete ${item.noPR}?`)) {
    returns.value = returns.value.filter((r) => r.id !== item.id);
  }
};

const printList = () => {
  window.print();
};

const toggleHeader = () => {
  // header toggle
};
useMockSync('purchase-return', returns);
</script>
=======
<script setup lang="ts">
import type { PurchaseReturn, PurchaseReturnFormData } from '#server/types/purchase-return'
import { usePurchaseReturns } from '~/composables/usePurchaseReturns'
import { useSuppliers } from '~/composables/useSuppliers'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatNumber } from '~/composables/useFormatters'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import PurchaseReturnStatsWidgets from '~/components/pages/purchase-return/PurchaseReturnStatsWidgets.vue'
import PurchaseReturnRecordsTable from '~/components/pages/purchase-return/PurchaseReturnRecordsTable.vue'
import PurchaseReturnDetailModal from '~/components/pages/purchase-return/PurchaseReturnDetailModal.vue'
import PurchaseReturnFormModal from '~/components/pages/purchase-return/PurchaseReturnFormModal.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Purchase Return List - Pengembalian Pembelian',
  sweetAlert: false
})

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  status: filterStatus.value,
}))

const { purchaseReturns, pending, error, refresh, savePurchaseReturn, deletePurchaseReturn } = usePurchaseReturns(filterParams)
const { suppliers } = useSuppliers()

const supplierOptions = computed(() => {
  if (suppliers.value && suppliers.value.length > 0) {
    return suppliers.value.map(s => s.name)
  }
  return ['PT Kertas Jaya', 'CV Kimia Prima', 'Global Inkindo', 'PT Sinar Grafika', 'Indo Material', 'UD Sukses Makmur']
})

// KPI stats calculation
const stats = computed(() => {
  const all = purchaseReturns.value
  const totalReturns = all.length
  const totalAmount = all.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const totalPaid = all.reduce((sum, p) => sum + (Number(p.paid) || 0), 0)
  const totalDue = all.reduce((sum, p) => sum + (Number(p.due) || 0), 0)

  return {
    totalReturns,
    totalAmount,
    totalPaid,
    totalDue,
  }
})

// Modal states
const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditMode = ref(false)
const selectedReturn = ref<PurchaseReturn | null>(null)
const deletingReturn = ref<PurchaseReturn | null>(null)
const formBusy = ref(false)
const deleteBusy = ref(false)

// Print/PDF Setup
const { isPrintModalOpen, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'noPR', label: 'No PR' },
  { key: 'date', label: 'Date' },
  { key: 'created', label: 'Created' },
  { key: 'noPurchase', label: 'No Purchase' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const, format: (val: number) => `Rp ${formatNumber(val)}` },
  { key: 'paid', label: 'Paid (IDR)', align: 'right' as const, format: (val: number) => `Rp ${formatNumber(val)}` },
  { key: 'due', label: 'Due (IDR)', align: 'right' as const, format: (val: number) => `Rp ${formatNumber(val)}` },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'statusBy', label: 'Status By' },
]

function handleOpenAdd() {
  selectedReturn.value = null
  isEditMode.value = false
  isFormModalOpen.value = true
}

function handleView(item: PurchaseReturn) {
  selectedReturn.value = item
  isDetailModalOpen.value = true
}

function handleEdit(item: PurchaseReturn) {
  selectedReturn.value = item
  isEditMode.value = true
  isFormModalOpen.value = true
}

function handleDeleteConfirm(item: PurchaseReturn) {
  deletingReturn.value = item
  isDeleteModalOpen.value = true
}

const actionError = ref('')

async function handleSaveReturn(form: PurchaseReturnFormData) {
  formBusy.value = true
  actionError.value = ''
  try {
    await savePurchaseReturn(form)
    isFormModalOpen.value = false
  } catch (err: any) {
    actionError.value = err?.message || 'Gagal menyimpan purchase return'
  } finally {
    formBusy.value = false
  }
}

async function handleDeleteExecute() {
  if (!deletingReturn.value) return
  deleteBusy.value = true
  actionError.value = ''
  try {
    await deletePurchaseReturn(deletingReturn.value.id)
    isDeleteModalOpen.value = false
    deletingReturn.value = null
  } catch (err: any) {
    actionError.value = err?.message || 'Gagal menghapus purchase return'
  } finally {
    deleteBusy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-purchase-return space-y-6">
    <!-- Header with Breadcrumb and Action Buttons -->
    <SalesListHeader
      title="Purchase Return List"
      subtitle="Kelola Pengembalian Barang & Refund Pembelian"
      add-label="Add Purchase Return"
      @add="handleOpenAdd"
      @refresh="refresh"
      @print="openPrintModal"
      @pdf="openPrintModal"
    />

    <!-- KPI Widgets -->
    <PurchaseReturnStatsWidgets :stats="stats" />

    <!-- Error State -->
    <div
      v-if="error"
      class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
    >
      <div class="flex items-center gap-2">
        <i data-feather="alert-circle" class="h-4 w-4"></i>
        <span>Gagal memuat data retur pembelian: {{ error.message }}</span>
      </div>
    </div>

    <!-- Data Table & Feedback -->
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="11">
      <PurchaseReturnRecordsTable
        :returns="purchaseReturns"
        :search-query="searchQuery"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:filter-status="filterStatus = $event"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDeleteConfirm"
      />
    </SalesFeedback>

    <!-- Modals -->
    <PurchaseReturnFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :return-data="selectedReturn"
      :supplier-options="supplierOptions"
      :busy="formBusy"
      @close="isFormModalOpen = false"
      @submit="handleSaveReturn"
    />

    <PurchaseReturnDetailModal
      :open="isDetailModalOpen"
      :return-data="selectedReturn"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
    />

    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Purchase Return"
      :message="`Apakah Anda yakin ingin menghapus Retur '${deletingReturn?.noPR}' (${deletingReturn?.supplier})?`"
      :busy="deleteBusy"
      @close="isDeleteModalOpen = false"
      @confirm="handleDeleteExecute"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Laporan Purchase Return"
      subtitle="Daftar Pengembalian Barang Pembelian (Retur)"
      :columns="printColumns"
      :items="purchaseReturns"
      @close="closePrintModal"
    />
  </div>
</template>
>>>>>>> origin/eko
