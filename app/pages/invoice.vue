<script setup lang="ts">const { formatRupiah } = useFormatters();

useHead({
  title: "Invoice - Kacetak System",
});

const { data: invoiceData } = await useFetch<InvoiceItem[]>('/api/invoice')
const invoices = ref<InvoiceItem[]>(invoiceData.value ?? [])
useMockSync('invoice', invoices);

const statusFilter = ref<"All" | "Paid" | "Partial" | "Unpaid">("All");

const filteredInvoices = computed(() => {
  if (statusFilter.value === "All") return invoices.value;
  return invoices.value.filter((inv) => inv.status === statusFilter.value);
});

const columns = [
  { key: "invoiceNo", label: "Invoice No", sortable: true },
  { key: "customer", label: "Customer", sortable: true },
  { key: "dueDate", label: "Due Date", sortable: true },
  { key: "amount", label: "Amount (IDR)", sortable: true, align: "end" as const },
  { key: "paid", label: "Paid (IDR)", sortable: true, align: "end" as const },
  { key: "amountDue", label: "Amount Due (IDR)", sortable: true, align: "end" as const },
  { key: "status", label: "Status", sortable: true, align: "center" as const },
  { key: "actions", label: "Action", align: "center" as const },
];

const totalAmount = computed(() => filteredInvoices.value.reduce((sum, item) => sum + item.amount, 0));
const totalPaid = computed(() => filteredInvoices.value.reduce((sum, item) => sum + item.paid, 0));
const totalDue = computed(() => filteredInvoices.value.reduce((sum, item) => sum + item.amountDue, 0));

// Delete modal state
const deleteModalOpen = ref(false);
const selectedInvoice = ref<InvoiceItem | null>(null);

const confirmDelete = (item: InvoiceItem) => {
  selectedInvoice.value = item;
  deleteModalOpen.value = true;
};

const handleDelete = () => {
  if (!selectedInvoice.value) return;
  invoices.value = invoices.value.filter((inv) => inv.id !== selectedInvoice.value?.id);
  deleteModalOpen.value = false;
  selectedInvoice.value = null;
};

const printTable = () => {
  window.print();
};</script>

<template>
  <div>
    <!-- Page Header -->
    <CommonPageHeader title="Invoice" subtitle="Manage Your Invoice">
      <template #actions>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            title="PDF"
          >
            <img src="/assets/img/icons/pdf.svg" alt="PDF" class="h-4 w-4" />
          </button>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            title="Print"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="16" />
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Filter Bar -->
    <div
      class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex items-center gap-2">
        <label class="text-xs font-medium text-gray-600 dark:text-gray-400">Filter Status:</label>
        <select
          v-model="statusFilter"
          class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>
    </div>

    <!-- Data Table -->
    <TablesDataTable
      :columns="columns"
      :items="filteredInvoices"
      search-placeholder="Search invoice or customer..."
      @print="printTable"
    >
      <!-- Invoice No -->
      <template #cell(invoiceNo)="{ item }">
        <NuxtLink :to="`/invoice-details?no=${item.invoiceNo}`" class="font-semibold text-primary hover:underline">
          {{ item.invoiceNo }}
        </NuxtLink>
      </template>

      <!-- Amount -->
      <template #cell(amount)="{ item }">
        <span class="font-medium">{{ formatRupiah(item.amount) }}</span>
      </template>

      <!-- Paid -->
      <template #cell(paid)="{ item }">
        <span class="font-medium text-success">{{ formatRupiah(item.paid) }}</span>
      </template>

      <!-- Amount Due -->
      <template #cell(amountDue)="{ item }">
        <span :class="item.amountDue > 0 ? 'font-medium text-danger' : 'text-gray-500'">
          {{ formatRupiah(item.amountDue) }}
        </span>
      </template>

      <!-- Status -->
      <template #cell(status)="{ item }">
          <CommonStatusPill :status="item.status" />
        </template>

      <!-- Actions -->
      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center gap-1.5">
          <NuxtLink
            :to="`/invoice-details?no=${item.invoiceNo}`"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-400"
            title="View Details"
          >
            <CommonFeatherIcon name="eye" size="13" />
          </NuxtLink>
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-danger hover:text-danger dark:border-gray-700 dark:text-gray-400"
            title="Delete Invoice"
            @click="confirmDelete(item)"
          >
            <CommonFeatherIcon name="trash-2" size="13" />
          </button>
        </div>
      </template>

      <!-- Table Footer Summary -->
      <template #footer>
        <tr>
          <td colspan="3" class="px-4 py-3 text-start font-bold">Total</td>
          <td class="px-4 py-3 text-end font-bold">{{ formatRupiah(totalAmount) }}</td>
          <td class="px-4 py-3 text-end font-bold text-success">{{ formatRupiah(totalPaid) }}</td>
          <td class="px-4 py-3 text-end font-bold text-danger">{{ formatRupiah(totalDue) }}</td>
          <td colspan="2"></td>
        </tr>
      </template>
    </TablesDataTable>

    <!-- Delete Confirm Modal -->
    <CommonBaseModal v-model="deleteModalOpen" title="Delete Invoice" size="sm">
      <div class="p-4 text-center">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-danger dark:bg-red-950/50"
        >
          <CommonFeatherIcon name="alert-triangle" size="24" />
        </div>
        <h5 class="text-base font-semibold text-gray-900 dark:text-white">Are you sure?</h5>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Do you really want to delete invoice
          <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedInvoice?.invoiceNo }}</span
          >? This process cannot be undone.
        </p>
        <div class="mt-6 flex justify-center gap-3">
          <button
            type="button"
            class="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            @click="deleteModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-danger px-4 py-2 text-xs font-medium text-white hover:bg-danger/90"
            @click="handleDelete"
          >
            Yes, Delete It
          </button>
        </div>
      </div>
    </CommonBaseModal>
  </div>
</template>
