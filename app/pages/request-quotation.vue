<script setup lang="ts">
useHead({
  title: "Request Quotation List - Kacetak System",
});

interface RFQItem {
  id: string;
  noRequest: string;
  customer: string;
  email: string;
  telp: string;
  date: string;
  status: "Ordered" | "Complete" | "Pending" | "Received";
}

const rfqs = ref<RFQItem[]>([
  {
    id: "1",
    noRequest: "RFQ00001",
    customer: "PT Semesta Digital",
    email: "info@semestadigi.co.id",
    telp: "081234567890",
    date: "01/10/2025",
    status: "Ordered",
  },
  {
    id: "2",
    noRequest: "RFQ00002",
    customer: "PT Makmur Abadi",
    email: "makmurabadi@gmail.com",
    telp: "081398765432",
    date: "03/10/2025",
    status: "Complete",
  },
  {
    id: "3",
    noRequest: "RFQ00003",
    customer: "Toko Buku Cerdas",
    email: "cerdasbuku@yahoo.com",
    telp: "081711223344",
    date: "05/10/2025",
    status: "Pending",
  },
  {
    id: "4",
    noRequest: "RFQ00004",
    customer: "CV Jaya Sentosa",
    email: "jayasentosa@corp.id",
    telp: "085812345678",
    date: "08/10/2025",
    status: "Received",
  },
]);

const statusFilter = ref<string>("All");

const filteredRFQs = computed(() => {
  if (statusFilter.value === "All") return rfqs.value;
  return rfqs.value.filter((r) => r.status === statusFilter.value);
});

const columns = [
  { key: "noRequest", label: "No Request", sortable: true },
  { key: "customer", label: "Customer", sortable: true },
  { key: "email", label: "Email" },
  { key: "telp", label: "Telp" },
  { key: "date", label: "Date", sortable: true },
  { key: "status", label: "Status", sortable: true, align: "center" as const },
  { key: "actions", label: "Action", align: "center" as const },
];

// Delete modal
const deleteModalOpen = ref(false);
const selectedRfq = ref<RFQItem | null>(null);

const confirmDelete = (item: RFQItem) => {
  selectedRfq.value = item;
  deleteModalOpen.value = true;
};

const handleDelete = () => {
  if (!selectedRfq.value) return;
  rfqs.value = rfqs.value.filter((r) => r.id !== selectedRfq.value?.id);
  deleteModalOpen.value = false;
  selectedRfq.value = null;
};

// Duplicate action
const duplicateRFQ = (item: RFQItem) => {
  const nextNum = String(rfqs.value.length + 1).padStart(5, "0");
  rfqs.value.unshift({
    ...item,
    id: String(Date.now()),
    noRequest: `RFQ${nextNum}`,
    date: new Date().toISOString().substring(0, 10),
    status: "Pending",
  });
};
</script>

<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="Request Quotation List" subtitle="Manage Your Request Quotation">
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
            @click="() => window.print()"
          >
            <FeatherIcon name="printer" size="16" />
          </button>
          <NuxtLink
            to="/add-request-quotation"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <FeatherIcon name="plus-circle" size="14" />
            <span>Add New Request Quotation</span>
          </NuxtLink>
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
          <option value="Ordered">Ordered</option>
          <option value="Complete">Complete</option>
          <option value="Pending">Pending</option>
          <option value="Received">Received</option>
        </select>
      </div>
    </div>

    <!-- Data Table -->
    <DataTable
      :columns="columns"
      :items="filteredRFQs"
      search-placeholder="Search RFQ, customer, email..."
      @print="() => window.print()"
    >
      <!-- No Request -->
      <template #cell(noRequest)="{ item }">
        <NuxtLink :to="`/request-quotation-detail?no=${item.noRequest}`" class="font-semibold text-primary hover:underline">
          {{ item.noRequest }}
        </NuxtLink>
      </template>

      <!-- Customer -->
      <template #cell(customer)="{ item }">
        <span class="font-medium text-gray-900 dark:text-white">{{ item.customer }}</span>
      </template>

      <!-- Email -->
      <template #cell(email)="{ item }">
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ item.email }}</span>
      </template>

      <!-- Telp -->
      <template #cell(telp)="{ item }">
        <span class="font-mono text-xs text-gray-600 dark:text-gray-400">{{ item.telp }}</span>
      </template>

      <!-- Status -->
      <template #cell(status)="{ item }">
        <span
          :class="[
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            item.status === 'Complete'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
              : item.status === 'Ordered'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
                : item.status === 'Pending'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
          ]"
        >
          {{ item.status }}
        </span>
      </template>

      <!-- Actions -->
      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center gap-1.5">
          <NuxtLink
            :to="`/request-quotation-detail?no=${item.noRequest}`"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-400"
            title="View RFQ"
          >
            <FeatherIcon name="eye" size="13" />
          </NuxtLink>
          <NuxtLink
            :to="`/edit-request-quotation?no=${item.noRequest}`"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-warning hover:text-warning dark:border-gray-700 dark:text-gray-400"
            title="Edit RFQ"
          >
            <FeatherIcon name="edit" size="13" />
          </NuxtLink>
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-400"
            title="Duplicate RFQ"
            @click="duplicateRFQ(item)"
          >
            <FeatherIcon name="copy" size="13" />
          </button>
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-danger hover:text-danger dark:border-gray-700 dark:text-gray-400"
            title="Delete"
            @click="confirmDelete(item)"
          >
            <FeatherIcon name="trash-2" size="13" />
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Delete Confirmation Modal -->
    <BaseModal v-model="deleteModalOpen" title="Delete Request Quotation" size="sm">
      <div class="p-4 text-center">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-danger dark:bg-red-950/50"
        >
          <FeatherIcon name="alert-triangle" size="24" />
        </div>
        <h5 class="text-base font-semibold text-gray-900 dark:text-white">Are you sure?</h5>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Do you really want to delete RFQ
          <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedRfq?.noRequest }}</span
          >?
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
