<script setup lang="ts">
const { formatRupiah } = useFormatters();

useHead({
  title: "Invoice - Kacetak System",
});

interface InvoiceItem {
  id: string;
  invoiceNo: string;
  customer: string;
  dueDate: string;
  amount: number;
  paid: number;
  amountDue: number;
  status: "Paid" | "Partial" | "Unpaid";
}

const invoices = ref<InvoiceItem[]>([
  {
    id: "1",
    invoiceNo: "INV00001",
    customer: "PT Makmur Abadi",
    dueDate: "01/12/2025",
    amount: 1332000,
    paid: 1332000,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "2",
    invoiceNo: "INV00002",
    customer: "Toko Buku Cerdas",
    dueDate: "02/12/2025",
    amount: 3552000,
    paid: 1500000,
    amountDue: 2052000,
    status: "Partial",
  },
  {
    id: "3",
    invoiceNo: "INV00003",
    customer: "Bpk. Rahmat",
    dueDate: "03/12/2025",
    amount: 610500,
    paid: 610500,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "4",
    invoiceNo: "INV00004",
    customer: "CV Jaya Sentosa",
    dueDate: "04/12/2025",
    amount: 3241200,
    paid: 3241200,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "5",
    invoiceNo: "INV00005",
    customer: "Ibu Dian",
    dueDate: "27/11/2025",
    amount: 6493500,
    paid: 3000000,
    amountDue: 3493500,
    status: "Partial",
  },
  {
    id: "6",
    invoiceNo: "INV00006",
    customer: "PT Global Solusi",
    dueDate: "25/11/2025",
    amount: 4484400,
    paid: 4484400,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "7",
    invoiceNo: "INV00007",
    customer: "Bapak Hendra",
    dueDate: "20/11/2025",
    amount: 888000,
    paid: 888000,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "8",
    invoiceNo: "INV00008",
    customer: "Percetakan Berkah",
    dueDate: "18/11/2025",
    amount: 5217000,
    paid: 2000000,
    amountDue: 3217000,
    status: "Partial",
  },
  {
    id: "9",
    invoiceNo: "INV00009",
    customer: "Ibu Rina",
    dueDate: "15/11/2025",
    amount: 1165500,
    paid: 1165500,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "10",
    invoiceNo: "INV00010",
    customer: "PT Digital Kreasi",
    dueDate: "10/11/2025",
    amount: 2886000,
    paid: 2886000,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "11",
    invoiceNo: "INV00011",
    customer: "Bapak Surya",
    dueDate: "05/11/2025",
    amount: 777000,
    paid: 0,
    amountDue: 777000,
    status: "Unpaid",
  },
  {
    id: "12",
    invoiceNo: "INV00012",
    customer: "Toko Sentosa Abadi",
    dueDate: "01/11/2025",
    amount: 4662000,
    paid: 4662000,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "13",
    invoiceNo: "INV00013",
    customer: "CV Karya Utama",
    dueDate: "28/10/2025",
    amount: 3774000,
    paid: 2000000,
    amountDue: 1774000,
    status: "Partial",
  },
  {
    id: "14",
    invoiceNo: "INV00014",
    customer: "Ibu Maya",
    dueDate: "20/10/2025",
    amount: 1443000,
    paid: 1443000,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "15",
    invoiceNo: "INV00015",
    customer: "PT Prima Grafika",
    dueDate: "15/10/2025",
    amount: 5550000,
    paid: 5550000,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "16",
    invoiceNo: "INV00016",
    customer: "Bapak Doni",
    dueDate: "10/10/2025",
    amount: 999000,
    paid: 999000,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "17",
    invoiceNo: "INV00017",
    customer: "Toko Grafika Indah",
    dueDate: "05/10/2025",
    amount: 2220000,
    paid: 1000000,
    amountDue: 1220000,
    status: "Partial",
  },
  {
    id: "18",
    invoiceNo: "INV00018",
    customer: "PT Maju Bersama",
    dueDate: "28/09/2025",
    amount: 6882000,
    paid: 6882000,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "19",
    invoiceNo: "INV00019",
    customer: "Ibu Ratna",
    dueDate: "20/09/2025",
    amount: 1221000,
    paid: 1221000,
    amountDue: 0,
    status: "Paid",
  },
  {
    id: "20",
    invoiceNo: "INV00020",
    customer: "Bapak Doni",
    dueDate: "10/05/2025",
    amount: 555000,
    paid: 555000,
    amountDue: 0,
    status: "Paid",
  },
]);

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
};
</script>

<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="Invoice" subtitle="Manage Your Invoice">
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
            <FeatherIcon name="printer" size="16" />
          </button>
        </div>
      </template>
    </PageHeader>

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
    <DataTable
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
        <span
          :class="[
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            item.status === 'Paid'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
              : item.status === 'Partial'
                ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
          ]"
        >
          {{ item.status }}
        </span>
      </template>

      <!-- Actions -->
      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center gap-1.5">
          <NuxtLink
            :to="`/invoice-details?no=${item.invoiceNo}`"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-400"
            title="View Details"
          >
            <FeatherIcon name="eye" size="13" />
          </NuxtLink>
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-danger hover:text-danger dark:border-gray-700 dark:text-gray-400"
            title="Delete Invoice"
            @click="confirmDelete(item)"
          >
            <FeatherIcon name="trash-2" size="13" />
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
    </DataTable>

    <!-- Delete Confirm Modal -->
    <BaseModal v-model="deleteModalOpen" title="Delete Invoice" size="sm">
      <div class="p-4 text-center">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-danger dark:bg-red-950/50"
        >
          <FeatherIcon name="alert-triangle" size="24" />
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
    </BaseModal>
  </div>
</template>
