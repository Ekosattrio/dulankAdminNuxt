<script setup lang="ts">
useHead({
  title: "Delivery Note - Kacetak System",
});

interface DNItemRow {
  description: string;
  qty: number;
  unit: string;
  packingQty: string;
  weight: string;
}

interface DeliveryNoteItem {
  id: string;
  dnNo: string;
  date: string;
  customer: string;
  noSales: string;
  shippingAddress: string;
  status: "Complete" | "Pending" | "Ordered" | "Received";
  dateStatus: string;
  po: string;
  shippingBy: string;
  reference: string;
  items: DNItemRow[];
}

const deliveryNotes = ref<DeliveryNoteItem[]>([
  {
    id: "1",
    dnNo: "DN0001",
    date: "01/10/2025",
    customer: "PT Makmur Abadi",
    noSales: "2511000001",
    shippingAddress: "Jl. Damai No. 4, Kec. Kramat Jati, Jakarta Timur, DKI Jakarta",
    status: "Complete",
    dateStatus: "02/10/2025",
    po: "PO - 12120001",
    shippingBy: "Car",
    reference: "Mr. Aman",
    items: [
      { description: "Brosur Full Color\nBrosur PPDB SMAN 1 Bandung", qty: 2, unit: "Ream", packingQty: "2 Pax", weight: "6 Kg" },
    ],
  },
  {
    id: "2",
    dnNo: "DN0002",
    date: "03/10/2025",
    customer: "Toko Buku Cerdas",
    noSales: "2511000002",
    shippingAddress: "Ruko Indah Blok A, Kec. Cinere, Kota Depok, Jawa Barat",
    status: "Complete",
    dateStatus: "04/10/2025",
    po: "PO - 12120002",
    shippingBy: "Motorcycle",
    reference: "Ibu Cerdas",
    items: [{ description: "Kalender Dinding 2026 Spiral", qty: 50, unit: "Pieces", packingQty: "1 Box", weight: "12 Kg" }],
  },
  {
    id: "3",
    dnNo: "DN0003",
    date: "05/10/2025",
    customer: "CV Jaya Sentosa",
    noSales: "2511000003",
    shippingAddress: "Kawasan Industri KIIC Lot C-4, Karawang Barat",
    status: "Pending",
    dateStatus: "05/10/2025",
    po: "PO - 12120003",
    shippingBy: "Truck",
    reference: "Bpk. Jaya",
    items: [{ description: "Kop Surat & Amplop Custom", qty: 5, unit: "Ream", packingQty: "5 Box", weight: "15 Kg" }],
  },
  {
    id: "4",
    dnNo: "DN0004",
    date: "08/10/2025",
    customer: "PT Global Solusi",
    noSales: "2511000004",
    shippingAddress: "Wisma Mulia Lt. 12, Gatot Subroto, Jakarta Selatan",
    status: "Ordered",
    dateStatus: "09/10/2025",
    po: "PO - 12120004",
    shippingBy: "Car",
    reference: "Dani Alfa",
    items: [{ description: "Company Profile Hardcover Excl.", qty: 100, unit: "Pieces", packingQty: "4 Box", weight: "28 Kg" }],
  },
  {
    id: "5",
    dnNo: "DN0005",
    date: "12/10/2025",
    customer: "Percetakan Berkah",
    noSales: "2511000005",
    shippingAddress: "Jl. Ahmad Yani No. 88, Bekasi Timur",
    status: "Received",
    dateStatus: "13/10/2025",
    po: "PO - 12120005",
    shippingBy: "Motorcycle",
    reference: "Haji Berkah",
    items: [{ description: "Paper Bag Custom Kraft 150gr", qty: 500, unit: "Pieces", packingQty: "2 Bale", weight: "20 Kg" }],
  },
]);

const statusFilter = ref<string>("All");

const filteredNotes = computed(() => {
  if (statusFilter.value === "All") return deliveryNotes.value;
  return deliveryNotes.value.filter((n) => n.status === statusFilter.value);
});

const columns = [
  { key: "dnNo", label: "No. DN", sortable: true },
  { key: "date", label: "Date", sortable: true },
  { key: "customer", label: "Customer", sortable: true },
  { key: "noSales", label: "No Sales", sortable: true },
  { key: "shippingAddress", label: "Shipping Address" },
  { key: "status", label: "Status", sortable: true, align: "center" as const },
  { key: "dateStatus", label: "Date Status", sortable: true },
  { key: "actions", label: "Action", align: "center" as const },
];

// Modal Form State (Add / Edit)
const isModalOpen = ref(false);
const modalMode = ref<"add" | "edit">("add");
const editingId = ref<string | null>(null);

const form = ref({
  dnNo: "",
  date: new Date().toISOString().substring(0, 10),
  customer: "",
  noSales: "",
  shippingAddress: "",
  po: "",
  shippingBy: "Car",
  reference: "",
  items: [] as DNItemRow[],
});

const openAddModal = () => {
  modalMode.value = "add";
  editingId.value = null;
  const nextNum = String(deliveryNotes.value.length + 1).padStart(4, "0");
  form.value = {
    dnNo: `DN${nextNum}`,
    date: new Date().toISOString().substring(0, 10),
    customer: "PT. Exabytes Network Indonesia",
    noSales: "2512000009",
    shippingAddress: "Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said, XS No. 13, Jakarta Selatan, 12950.",
    po: "PO - 12120009",
    shippingBy: "Car",
    reference: "Mr. Aman",
    items: [
      { description: "Brosur Full Color\nBrosur PPDB SMAN 1 Bandung", qty: 2, unit: "Ream", packingQty: "2 Pax", weight: "6 Kg" },
    ],
  };
  isModalOpen.value = true;
};

const openEditModal = (note: DeliveryNoteItem) => {
  modalMode.value = "edit";
  editingId.value = note.id;
  form.value = {
    dnNo: note.dnNo,
    date: note.date,
    customer: note.customer,
    noSales: note.noSales,
    shippingAddress: note.shippingAddress,
    po: note.po,
    shippingBy: note.shippingBy,
    reference: note.reference,
    items: JSON.parse(JSON.stringify(note.items)),
  };
  isModalOpen.value = true;
};

const addRow = () => {
  form.value.items.push({
    description: "",
    qty: 1,
    unit: "Pieces",
    packingQty: "1 Box",
    weight: "1 Kg",
  });
};

const removeRow = (index: number) => {
  form.value.items.splice(index, 1);
};

const saveDeliveryNote = () => {
  if (modalMode.value === "add") {
    deliveryNotes.value.unshift({
      id: String(Date.now()),
      dnNo: form.value.dnNo,
      date: form.value.date,
      customer: form.value.customer,
      noSales: form.value.noSales,
      shippingAddress: form.value.shippingAddress,
      status: "Pending",
      dateStatus: form.value.date,
      po: form.value.po,
      shippingBy: form.value.shippingBy,
      reference: form.value.reference,
      items: form.value.items,
    });
  } else if (editingId.value) {
    const idx = deliveryNotes.value.findIndex((n) => n.id === editingId.value);
    if (idx !== -1) {
      deliveryNotes.value[idx] = {
        ...deliveryNotes.value[idx],
        dnNo: form.value.dnNo,
        customer: form.value.customer,
        noSales: form.value.noSales,
        shippingAddress: form.value.shippingAddress,
        po: form.value.po,
        shippingBy: form.value.shippingBy,
        reference: form.value.reference,
        items: form.value.items,
      };
    }
  }
  isModalOpen.value = false;
};

// Delete Confirmation
const deleteModalOpen = ref(false);
const noteToDelete = ref<DeliveryNoteItem | null>(null);

const confirmDelete = (item: DeliveryNoteItem) => {
  noteToDelete.value = item;
  deleteModalOpen.value = true;
};

const handleDelete = () => {
  if (!noteToDelete.value) return;
  deliveryNotes.value = deliveryNotes.value.filter((n) => n.id !== noteToDelete.value?.id);
  deleteModalOpen.value = false;
  noteToDelete.value = null;
};
</script>

<template>
  <div>
    <!-- Page Header -->
    <PageHeader title="Delivery Note" subtitle="Manage Your Delivery Note">
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
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
            @click="openAddModal"
          >
            <FeatherIcon name="plus-circle" size="14" />
            <span>Add New Delivery Note</span>
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
          <option value="Complete">Complete</option>
          <option value="Pending">Pending</option>
          <option value="Ordered">Ordered</option>
          <option value="Received">Received</option>
        </select>
      </div>
    </div>

    <!-- Data Table -->
    <DataTable
      :columns="columns"
      :items="filteredNotes"
      search-placeholder="Search delivery note, customer, sales no..."
      @print="() => window.print()"
    >
      <!-- DN No -->
      <template #cell(dnNo)="{ item }">
        <NuxtLink :to="`/delivery-note-detail?no=${item.dnNo}`" class="font-semibold text-primary hover:underline">
          {{ item.dnNo }}
        </NuxtLink>
      </template>

      <!-- Customer -->
      <template #cell(customer)="{ item }">
        <span class="font-medium text-gray-900 dark:text-white">{{ item.customer }}</span>
      </template>

      <!-- Shipping Address -->
      <template #cell(shippingAddress)="{ item }">
        <span class="inline-block max-w-xs truncate text-xs text-gray-500 dark:text-gray-400" :title="item.shippingAddress">
          {{ item.shippingAddress }}
        </span>
      </template>

      <!-- Status -->
      <template #cell(status)="{ item }">
        <span
          :class="[
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            item.status === 'Complete'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
              : item.status === 'Pending'
                ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                : item.status === 'Ordered'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
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
            :to="`/delivery-note-detail?no=${item.dnNo}`"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-400"
            title="View Details"
          >
            <FeatherIcon name="eye" size="13" />
          </NuxtLink>
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-warning hover:text-warning dark:border-gray-700 dark:text-gray-400"
            title="Edit Delivery Note"
            @click="openEditModal(item)"
          >
            <FeatherIcon name="edit" size="13" />
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

    <!-- Add / Edit Modal -->
    <BaseModal v-model="isModalOpen" :title="modalMode === 'add' ? 'Add Delivery Note' : 'Edit Delivery Note'" size="xl">
      <form @submit.prevent="saveDeliveryNote">
        <div class="p-6 space-y-6">
          <!-- Company & Header -->
          <div
            class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-gray-100 pb-4 dark:border-gray-800"
          >
            <div
              class="flex h-20 w-36 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
            >
              <span class="text-xs font-bold text-gray-400">Logo</span>
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400 sm:text-end">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white">PT. DULANK SEMESTA CIDA</h4>
              <p>Jl. Arif Rahman Hakim Niaga Kel. Nagasari Karawang Barat - Karawang</p>
              <p>Email: ptdulanksemestacida@gmail.com | WA: 0877 8813 1400</p>
            </div>
          </div>

          <!-- Metadata Fields -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div>
              <label class="font-semibold text-gray-700 dark:text-gray-300">Ship To / Customer</label>
              <input
                v-model="form.customer"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
              <label class="mt-2 block font-semibold text-gray-700 dark:text-gray-300">Shipping Address</label>
              <textarea
                v-model="form.shippingAddress"
                rows="3"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
            </div>

            <div class="space-y-2">
              <div class="grid grid-cols-3 items-center gap-2">
                <span class="font-semibold text-gray-700 dark:text-gray-300">DN No:</span>
                <input
                  v-model="form.dnNo"
                  type="text"
                  class="col-span-2 rounded border border-gray-200 bg-gray-50 p-1.5 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div class="grid grid-cols-3 items-center gap-2">
                <span class="font-semibold text-gray-700 dark:text-gray-300">DN Date:</span>
                <input
                  v-model="form.date"
                  type="text"
                  class="col-span-2 rounded border border-gray-200 bg-gray-50 p-1.5 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div class="grid grid-cols-3 items-center gap-2">
                <span class="font-semibold text-gray-700 dark:text-gray-300">PO Number:</span>
                <input
                  v-model="form.po"
                  type="text"
                  class="col-span-2 rounded border border-gray-200 bg-gray-50 p-1.5 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div class="grid grid-cols-3 items-center gap-2">
                <span class="font-semibold text-gray-700 dark:text-gray-300">Shipping By:</span>
                <input
                  v-model="form.shippingBy"
                  type="text"
                  class="col-span-2 rounded border border-gray-200 bg-gray-50 p-1.5 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div class="grid grid-cols-3 items-center gap-2">
                <span class="font-semibold text-gray-700 dark:text-gray-300">Reference:</span>
                <input
                  v-model="form.reference"
                  type="text"
                  class="col-span-2 rounded border border-gray-200 bg-gray-50 p-1.5 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div class="overflow-x-auto">
            <table class="w-full border-collapse text-xs">
              <thead>
                <tr
                  class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <th class="p-2 text-center" style="width: 40px">No</th>
                  <th class="p-2 text-start">Item Description</th>
                  <th class="p-2 text-end" style="width: 90px">Qty</th>
                  <th class="p-2 text-start" style="width: 110px">Unit</th>
                  <th class="p-2 text-start" style="width: 100px">Packing Qty</th>
                  <th class="p-2 text-start" style="width: 100px">Weight</th>
                  <th class="p-2 text-center" style="width: 50px">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="(item, idx) in form.items" :key="idx">
                  <td class="p-2 text-center text-gray-500">{{ idx + 1 }}</td>
                  <td class="p-2">
                    <textarea
                      v-model="item.description"
                      rows="2"
                      placeholder="Item name & specifications..."
                      class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    ></textarea>
                  </td>
                  <td class="p-2">
                    <input
                      v-model.number="item.qty"
                      type="number"
                      min="0"
                      class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-end text-xs focus:border-primary focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </td>
                  <td class="p-2">
                    <select
                      v-model="item.unit"
                      class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="Ream">Ream</option>
                      <option value="Pieces">Pieces</option>
                      <option value="Box">Box</option>
                      <option value="Rim">Rim</option>
                      <option value="Set">Set</option>
                    </select>
                  </td>
                  <td class="p-2">
                    <input
                      v-model="item.packingQty"
                      type="text"
                      placeholder="e.g. 2 Pax"
                      class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </td>
                  <td class="p-2">
                    <input
                      v-model="item.weight"
                      type="text"
                      placeholder="e.g. 6 Kg"
                      class="w-full rounded border border-gray-200 bg-gray-50 p-1.5 text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </td>
                  <td class="p-2 text-center">
                    <button type="button" class="text-gray-400 hover:text-danger" title="Delete Row" @click="removeRow(idx)">
                      <FeatherIcon name="trash-2" size="14" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <button
              type="button"
              class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              @click="addRow"
            >
              <FeatherIcon name="plus-circle" size="14" />
              <span>Add New Item</span>
            </button>
          </div>

          <!-- Signatures Preview -->
          <div class="grid grid-cols-4 gap-4 border-t border-gray-100 pt-6 text-center text-xs dark:border-gray-800">
            <div>
              <p class="font-bold text-gray-800 dark:text-gray-200">Receive By</p>
              <div class="my-8 border-b border-gray-400"></div>
              <small class="text-gray-500">Your Name, Sign & Stamp</small>
            </div>
            <div>
              <p class="font-bold text-gray-800 dark:text-gray-200">Security / Check</p>
              <div class="my-8 border-b border-gray-400"></div>
              <small class="text-gray-500">Sign & Stamp</small>
            </div>
            <div>
              <p class="font-bold text-gray-800 dark:text-gray-200">Driver</p>
              <div class="my-8 border-b border-gray-400"></div>
              <small class="text-gray-700 dark:text-gray-300">Nurdin</small>
            </div>
            <div>
              <p class="font-bold text-gray-800 dark:text-gray-200">Issued By</p>
              <div class="my-8 border-b border-gray-400"></div>
              <small class="text-gray-700 dark:text-gray-300">Nurdin</small>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
          <button
            type="button"
            class="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            @click="isModalOpen = false"
          >
            Cancel
          </button>
          <button type="submit" class="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary/90">
            Submit
          </button>
        </div>
      </form>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal v-model="deleteModalOpen" title="Delete Delivery Note" size="sm">
      <div class="p-4 text-center">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-danger dark:bg-red-950/50"
        >
          <FeatherIcon name="alert-triangle" size="24" />
        </div>
        <h5 class="text-base font-semibold text-gray-900 dark:text-white">Are you sure?</h5>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Do you really want to delete <span class="font-bold text-gray-800 dark:text-gray-200">{{ noteToDelete?.dnNo }}</span
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
