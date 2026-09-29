<script setup lang="ts">
import PageHeader from "~/components/common/PageHeader.vue";
import DataTable from "~/components/table/DataTable.vue";
import BaseModal from "~/components/modal/BaseModal.vue";

useHead({
  title: "Sales - Kacetak System",
});

interface SaleItem {
  id: string;
  customer: string;
  date: string;
  subTotal: string;
  deliveryFee: string;
  discount: string;
  tax: string;
  total: string;
  delivery: "Pick Up" | "Shipping";
  channel: "POS" | "Website";
  status: "Paid" | "Unpaid" | "Partial";
  method: "Cash" | "Bank Transfer" | "Debit Card";
}

const columns = [
  { key: "actions", label: "", sortable: false, class: "w-10" },
  { key: "id", label: "No Sales", sortable: true },
  { key: "customer", label: "Customer", sortable: true },
  { key: "date", label: "Date", sortable: true },
  { key: "subTotal", label: "Sub Total", sortable: true },
  { key: "deliveryFee", label: "Delivery Fee", sortable: true },
  { key: "discount", label: "Discount", sortable: true },
  { key: "tax", label: "Tax", sortable: true },
  { key: "total", label: "Total", sortable: true },
  { key: "delivery", label: "Delivery", sortable: true },
  { key: "channel", label: "Sales Channel", sortable: true },
  { key: "status", label: "Payment Status", sortable: true },
  { key: "method", label: "Method", sortable: true },
];

const salesList = ref<SaleItem[]>([
  {
    id: "PT002",
    customer: "Siti Aminah",
    date: "02/01/2025",
    subTotal: "Rp900.000",
    deliveryFee: "Rp125.000",
    discount: "Rp0",
    tax: "Rp125.000",
    total: "Rp1.150.000",
    delivery: "Pick Up",
    channel: "POS",
    status: "Partial",
    method: "Cash",
  },
  {
    id: "PT001",
    customer: "PT. Exabytes Network Indonesia",
    date: "26/06/2025",
    subTotal: "Rp899.500",
    deliveryFee: "Rp89.500",
    discount: "Rp0",
    tax: "Rp0",
    total: "Rp998.445",
    delivery: "Shipping",
    channel: "Website",
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "PT003",
    customer: "Desman Dwi",
    date: "03/01/2025",
    subTotal: "Rp450.000",
    deliveryFee: "Rp25.000",
    discount: "Rp0",
    tax: "Rp50.000",
    total: "Rp525.000",
    delivery: "Pick Up",
    channel: "POS",
    status: "Paid",
    method: "Cash",
  },
  {
    id: "PT004",
    customer: "Eko Satrio",
    date: "04/01/2025",
    subTotal: "Rp2.400.000",
    deliveryFee: "Rp0",
    discount: "Rp100.000",
    tax: "Rp253.000",
    total: "Rp2.553.000",
    delivery: "Shipping",
    channel: "Website",
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "PT005",
    customer: "CV Maju Jaya Sejahtera",
    date: "05/01/2025",
    subTotal: "Rp3.800.000",
    deliveryFee: "Rp150.000",
    discount: "Rp0",
    tax: "Rp434.500",
    total: "Rp4.384.500",
    delivery: "Shipping",
    channel: "Website",
    status: "Unpaid",
    method: "Bank Transfer",
  },
]);

// Modal states
const isDetailModalOpen = ref(false);
const isPaymentModalOpen = ref(false);
const selectedSale = ref<SaleItem | null>(null);
const activeDropdownId = ref<string | null>(null);

const toggleDropdown = (id: string) => {
  activeDropdownId.value = activeDropdownId.value === id ? null : id;
};

const openDetail = (item: SaleItem) => {
  selectedSale.value = item;
  isDetailModalOpen.value = true;
  activeDropdownId.value = null;
};

const openPayment = (item: SaleItem) => {
  selectedSale.value = item;
  isPaymentModalOpen.value = true;
  activeDropdownId.value = null;
};

const onPrint = () => {
  window.print();
};
</script>

<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="Sales" subtitle="Manage Yours sales">
      <template #actions>
        <NuxtLink
          to="/add-sales"
          class="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors"
        >
          <FeatherIcon name="plus-circle" size="14" />
          <span>Add Sales</span>
        </NuxtLink>
      </template>
    </PageHeader>

    <!-- Top Action Links -->
    <div class="flex justify-end gap-2 mb-4">
      <button
        type="button"
        class="flex items-center gap-1 rounded border border-danger/40 px-2.5 py-1 text-xs text-danger hover:bg-danger-50 transition-colors"
      >
        <FeatherIcon name="trash" size="12" />
        <span>Delete Sales History</span>
      </button>
      <button
        type="button"
        class="flex items-center gap-1 rounded border border-gray-300 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-300"
      >
        <FeatherIcon name="x-circle" size="12" />
        <span>Cancel Transaction History</span>
      </button>
    </div>

    <!-- Data Table -->
    <DataTable :columns="columns" :items="salesList" search-placeholder="Search sales..." @print="onPrint">
      <!-- Action Menu Cell -->
      <template #cell(actions)="{ item }">
        <div class="relative">
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-800"
            @click.stop="toggleDropdown(item.id)"
          >
            <FeatherIcon name="more-vertical" size="14" />
          </button>

          <!-- Dropdown Options -->
          <div
            v-if="activeDropdownId === item.id"
            class="absolute start-0 top-full z-50 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              type="button"
              class="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              @click="openDetail(item)"
            >
              <FeatherIcon name="eye" size="13" />
              <span>Sale Detail</span>
            </button>
            <button
              type="button"
              class="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              @click="openPayment(item)"
            >
              <FeatherIcon name="dollar-sign" size="13" />
              <span>Show Payments</span>
            </button>
            <NuxtLink
              :to="`/sales-receipt?id=${item.id}`"
              class="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FeatherIcon name="printer" size="13" />
              <span>Print Receipt (80mm)</span>
            </NuxtLink>
            <NuxtLink
              :to="`/sales-note?id=${item.id}`"
              class="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FeatherIcon name="file-text" size="13" />
              <span>Print Note (A4)</span>
            </NuxtLink>
          </div>
        </div>
      </template>

      <!-- Custom Cell Formatters -->
      <template #cell(id)="{ item }">
        <NuxtLink :to="`/sales-note?id=${item.id}`" class="font-bold text-primary hover:underline">
          {{ item.id }}
        </NuxtLink>
      </template>

      <template #cell(customer)="{ item }">
        <span class="font-semibold text-gray-900 dark:text-white">{{ item.customer }}</span>
      </template>

      <template #cell(delivery)="{ item }">
        <span
          :class="[
            'inline-block px-2 py-0.5 rounded text-[10px] font-semibold',
            item.delivery === 'Pick Up'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200',
          ]"
        >
          {{ item.delivery }}
        </span>
      </template>

      <template #cell(channel)="{ item }">
        <span class="text-xs text-gray-600 dark:text-gray-300 font-medium">{{ item.channel }}</span>
      </template>

      <template #cell(status)="{ item }">
        <span
          :class="[
            'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold',
            item.status === 'Paid'
              ? 'bg-emerald-100 text-emerald-800'
              : item.status === 'Partial'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800',
          ]"
        >
          {{ item.status }}
        </span>
      </template>

      <template #cell(method)="{ item }">
        <span class="text-xs text-gray-600 dark:text-gray-300">{{ item.method }}</span>
      </template>
    </DataTable>

    <!-- Sale Detail Modal -->
    <BaseModal v-model="isDetailModalOpen" :title="`Sale Details - ${selectedSale?.id}`">
      <div v-if="selectedSale" class="space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-2 border-b pb-3">
          <div>
            <span class="text-gray-400">Customer:</span> <strong class="text-gray-800">{{ selectedSale.customer }}</strong>
          </div>
          <div>
            <span class="text-gray-400">Date:</span> <span class="text-gray-800">{{ selectedSale.date }}</span>
          </div>
          <div>
            <span class="text-gray-400">Delivery:</span> <span class="text-gray-800">{{ selectedSale.delivery }}</span>
          </div>
          <div>
            <span class="text-gray-400">Channel:</span> <span class="text-gray-800">{{ selectedSale.channel }}</span>
          </div>
        </div>
        <div class="space-y-1.5 pt-1">
          <div class="flex justify-between">
            <span>Sub Total:</span> <span class="font-medium">{{ selectedSale.subTotal }}</span>
          </div>
          <div class="flex justify-between">
            <span>Delivery Fee:</span> <span class="font-medium">{{ selectedSale.deliveryFee }}</span>
          </div>
          <div class="flex justify-between">
            <span>Tax:</span> <span class="font-medium">{{ selectedSale.tax }}</span>
          </div>
          <div class="flex justify-between border-t pt-1 font-bold text-sm text-primary">
            <span>Total:</span> <span>{{ selectedSale.total }}</span>
          </div>
        </div>
      </div>
      <template #footer="{ close }">
        <button type="button" class="rounded-lg bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700" @click="close">
          Close
        </button>
      </template>
    </BaseModal>

    <!-- Payment Detail Modal -->
    <BaseModal v-model="isPaymentModalOpen" :title="`Payment Details - ${selectedSale?.id}`">
      <div v-if="selectedSale" class="space-y-2 text-xs">
        <div class="flex justify-between border-b pb-2">
          <span>Status:</span> <span class="font-bold text-success">{{ selectedSale.status }}</span>
        </div>
        <div class="flex justify-between border-b pb-2">
          <span>Payment Method:</span> <span>{{ selectedSale.method }}</span>
        </div>
        <div class="flex justify-between font-bold pt-1">
          <span>Total Paid:</span> <span class="text-primary">{{ selectedSale.total }}</span>
        </div>
      </div>
      <template #footer="{ close }">
        <button type="button" class="rounded-lg bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700" @click="close">
          Close
        </button>
      </template>
    </BaseModal>
  </div>
</template>
