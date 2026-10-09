<<<<<<< HEAD
<script setup lang="ts">const { formatRupiah } = useFormatters();

useHead({
  title: "Quotation List - Kacetak System",
});

const { data: quotationData } = await useFetch<QuotationItem[]>('/api/quotation')
const quotations = ref<QuotationItem[]>(quotationData.value ?? [])
useMockSync('quotation', quotations);

const statusFilter = ref<string>("All");

const filteredQuotations = computed(() => {
  if (statusFilter.value === "All") return quotations.value;
  return quotations.value.filter((q) => q.status === statusFilter.value);
});

const columns = [
  { key: "noQuotation", label: "No Quotation", sortable: true },
  { key: "date", label: "Date", sortable: true },
  { key: "customer", label: "Customer", sortable: true },
  { key: "email", label: "Email" },
  { key: "status", label: "Status", sortable: true, align: "center" as const },
  { key: "dateStatus", label: "Date Status", sortable: true },
  { key: "total", label: "Total (IDR)", sortable: true, align: "end" as const },
  { key: "channel", label: "Quotation Channel", align: "center" as const },
  { key: "dueDate", label: "Due Date", sortable: true },
  { key: "actions", label: "Action", align: "center" as const },
];

const deleteModalOpen = ref(false);
const selectedQuo = ref<QuotationItem | null>(null);

const confirmDelete = (item: QuotationItem) => {
  selectedQuo.value = item;
  deleteModalOpen.value = true;
};

const handleDelete = () => {
  if (!selectedQuo.value) return;
  quotations.value = quotations.value.filter((q) => q.id !== selectedQuo.value?.id);
  deleteModalOpen.value = false;
  selectedQuo.value = null;
};</script>

<template>
  <div>
    <!-- Page Header -->
    <CommonPageHeader title="Quotation List" subtitle="Manage Your Quotation">
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
            <CommonFeatherIcon name="printer" size="16" />
          </button>
          <NuxtLink
            to="/add-quotation"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <CommonFeatherIcon name="plus-circle" size="14" />
            <span>Add New Quotation</span>
          </NuxtLink>
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
          <option value="Send">Send</option>
          <option value="Complete">Complete</option>
          <option value="Pending">Pending</option>
          <option value="Ordered">Ordered</option>
          <option value="Received">Received</option>
        </select>
      </div>
    </div>

    <!-- Data Table -->
    <TablesDataTable
      :columns="columns"
      :items="filteredQuotations"
      search-placeholder="Search quotation, customer, email..."
      @print="() => window.print()"
    >
      <!-- No Quotation -->
      <template #cell(noQuotation)="{ item }">
        <NuxtLink :to="`/quotation-detail?no=${item.noQuotation}`" class="font-semibold text-primary hover:underline">
          {{ item.noQuotation }}
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

      <!-- Status -->
      <template #cell(status)="{ item }">
          <CommonStatusPill :status="item.status" />
        </template>

      <!-- Total -->
      <template #cell(total)="{ item }">
        <span class="font-semibold text-gray-900 dark:text-white">{{ formatRupiah(item.total) }}</span>
      </template>

      <!-- Channel -->
      <template #cell(channel)="{ item }">
        <span class="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {{ item.channel }}
        </span>
      </template>

      <!-- Actions -->
      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center gap-1.5">
          <NuxtLink
            :to="`/quotation-detail?no=${item.noQuotation}`"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-400"
            title="View Quotation"
          >
            <CommonFeatherIcon name="eye" size="13" />
          </NuxtLink>
          <NuxtLink
            :to="`/edit-quotation?no=${item.noQuotation}`"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-warning hover:text-warning dark:border-gray-700 dark:text-gray-400"
            title="Edit Quotation"
          >
            <CommonFeatherIcon name="edit" size="13" />
          </NuxtLink>
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-danger hover:text-danger dark:border-gray-700 dark:text-gray-400"
            title="Delete"
            @click="confirmDelete(item)"
          >
            <CommonFeatherIcon name="trash-2" size="13" />
          </button>
        </div>
      </template>
    </TablesDataTable>

    <!-- Delete Confirmation Modal -->
    <CommonBaseModal v-model="deleteModalOpen" title="Delete Quotation" size="sm">
      <div class="p-4 text-center">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-danger dark:bg-red-950/50"
        >
          <CommonFeatherIcon name="alert-triangle" size="24" />
        </div>
        <h5 class="text-base font-semibold text-gray-900 dark:text-white">Are you sure?</h5>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Do you really want to delete quotation
          <span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedQuo?.noQuotation }}</span
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
    </CommonBaseModal>
=======
<script setup lang="ts">
import PagesQuotationTable from '~/components/pages/quotation/QuotationRecordsTable.vue'
import PagesQuotationEditor from '~/components/pages/quotation/QuotationEditor.vue'

useLegacyPage({ title: 'Quotation List', sweetAlert: false })
const {
  pending,
  error,
  refresh,
  searchQuery,
  filterStatus,
  filteredList,
  isModalOpen,
  isEdit,
  editData,
  deleting,
  busy,
  actionError,
  toastMessage,
  handleAdd,
  handleEdit,
  handleDelete,
  handleSubmit,
  confirmDelete,
  printTable,
} = useQuotationPage()
</script>

<template>
  <div class="dulank-page dulank-page-quotation">
    <SalesListHeader
      title="Quotation List"
      subtitle="Manage Your Quotation"
      add-label="Add New Quotation"
      add-to="/add-quotation"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh()"
      @print="printTable"
    />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="10"
      :skeleton-rows="6"
      :error="error ? 'Unable to load quotation list. Please try again.' : ''"
      :message="toastMessage"
      @retry="refresh()"
      @dismiss="toastMessage = ''"
    />
    <PagesQuotationTable
      v-if="!pending && !error"
      :quotations="filteredList"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @add-quotation="handleAdd"
      @edit-quotation="handleEdit"
      @delete-quotation="handleDelete"
      @export-pdf="printTable"
      @print-table="printTable"
      @refresh="refresh"
    />
    <PagesQuotationEditor
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      :busy="busy"
      :error="actionError"
      @close="!busy && (isModalOpen = false)"
      @submit="handleSubmit"
    />
    <SalesConfirmDelete
      :open="!!deleting"
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="confirmDelete"
    />
>>>>>>> origin/eko
  </div>
</template>
