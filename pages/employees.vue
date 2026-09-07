<script setup lang="ts">
interface EmployeeItem {
  id: string;
  name: string;
  department: string;
  address: string;
  detailAddress?: string;
  phone: string;
  joinDate: string;
  status: "Active" | "Resign" | "Inactive";
  gender?: string;
  dob?: string;
  joinChannel?: string;
  contact1Name?: string;
  contact1Phone?: string;
  contact2Name?: string;
  contact2Phone?: string;
  email?: string;
}

const employees = ref<EmployeeItem[]>([
  {
    id: "ST001",
    name: "Budi Setiadi",
    department: "Produksi",
    address: "Jawa Barat, Kab. Karawang, Karawang Barat",
    detailAddress: "Perum Griya Indah Blok E2 No.55",
    phone: "+6281234567001",
    joinDate: "15/01/2023",
    status: "Active",
    gender: "Male",
    dob: "12/02/1990",
    joinChannel: "Offline",
    contact1Name: "Dudung Sukaya",
    contact1Phone: "6258454455555",
    contact2Name: "Mimin Mintarsih",
    contact2Phone: "62854515422255",
    email: "budi2548@gmail.com",
  },
  {
    id: "ST002",
    name: "Siti Nurhaliza",
    department: "Administrasi & Keuangan",
    address: "DKI Jakarta, Jakarta Selatan, Tebet",
    detailAddress: "Jl. Tebet Barat Raya No.12",
    phone: "+6281398765002",
    joinDate: "02/03/2023",
    status: "Active",
    gender: "Female",
    dob: "14/05/1993",
    joinChannel: "Online",
    contact1Name: "Ahmad Basuki",
    contact1Phone: "+6281398765099",
    email: "siti.nurhaliza@gmail.com",
  },
  {
    id: "ST003",
    name: "Agus Rahardjo",
    department: "Desain Grafis",
    address: "Banten, Kota Tangerang, Cipondoh",
    detailAddress: "Komplek Garuda Blok B No.10",
    phone: "+62852112223003",
    joinDate: "10/05/2023",
    status: "Active",
    gender: "Male",
    dob: "21/08/1992",
    joinChannel: "Offline",
    contact1Name: "Surya Rahardjo",
    contact1Phone: "+62852112223099",
    email: "agus.rahardjo@gmail.com",
  },
  {
    id: "ST004",
    name: "Rina Permata",
    department: "Marketing",
    address: "Jawa Barat, Kota Bekasi, Bekasi Timur",
    detailAddress: "Perumahan Jaya Blok A3 No.4",
    phone: "+6281155667004",
    joinDate: "20/06/2023",
    status: "Resign",
    gender: "Female",
    dob: "05/11/1995",
    joinChannel: "Online",
    contact1Name: "Iwan Permata",
    contact1Phone: "+6281155667099",
    email: "rina.permata@gmail.com",
  },
  {
    id: "ST005",
    name: "Dedi Kurniawan",
    department: "Produksi",
    address: "Jawa Tengah, Kota Semarang, Gayamsari",
    detailAddress: "Kp. Sawah Besar RT 02/RW 03",
    phone: "+6282199001005",
    joinDate: "12/08/2023",
    status: "Active",
    gender: "Male",
    dob: "30/03/1991",
    joinChannel: "Offline",
    email: "dedi.kurniawan@gmail.com",
  },
  {
    id: "ST006",
    name: "Maya Sartika",
    department: "Produksi",
    address: "Jawa Timur, Kota Surabaya, Gubeng",
    detailAddress: "Jl. Dharmawangsa No.45",
    phone: "+6281933445006",
    joinDate: "05/10/2023",
    status: "Active",
    gender: "Female",
    dob: "18/09/1994",
    joinChannel: "Online",
    email: "maya.sartika@gmail.com",
  },
  {
    id: "ST007",
    name: "Hendra Wijaya",
    department: "Desain Grafis",
    address: "Jawa Barat, Kota Bandung, Coblong",
    detailAddress: "Jl. Dago Pojok No.102",
    phone: "+62857778889007",
    joinDate: "18/11/2023",
    status: "Active",
    gender: "Male",
    dob: "09/01/1993",
    joinChannel: "Offline",
    email: "hendra.wijaya@gmail.com",
  },
  {
    id: "ST008",
    name: "Andi Pratama",
    department: "Marketing",
    address: "DI Yogyakarta, Kab. Sleman, Depok",
    detailAddress: "Perum Condongcatur Blok G-8",
    phone: "+6281288776008",
    joinDate: "03/01/2024",
    status: "Active",
    gender: "Male",
    dob: "17/04/1996",
    joinChannel: "Online",
    email: "andi.pratama@gmail.com",
  },
  {
    id: "ST009",
    name: "Larasati Putri",
    department: "Produksi",
    address: "Jawa Barat, Kab. Bogor, Cibinong",
    detailAddress: "Kp. Parung Jati Desa Sukahati",
    phone: "+6281311223009",
    joinDate: "25/02/2024",
    status: "Resign",
    gender: "Female",
    dob: "23/07/1995",
    joinChannel: "Offline",
    email: "larasati.putri@gmail.com",
  },
  {
    id: "ST010",
    name: "Fajar Ramadhan",
    department: "Produksi",
    address: "Jawa Timur, Kota Malang, Lowokwaru",
    detailAddress: "Jl. Soekarno Hatta No.22",
    phone: "+6281144556010",
    joinDate: "14/04/2024",
    status: "Active",
    gender: "Male",
    dob: "11/12/1997",
    joinChannel: "Online",
    email: "fajar.ramadhan@gmail.com",
  },
]);

const searchQuery = ref("");
const selectedStatus = ref("");
const selectedDepartment = ref("");

const filteredEmployees = computed(() => {
  return employees.value.filter((emp) => {
    const matchSearch =
      !searchQuery.value ||
      emp.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.phone.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus = !selectedStatus.value || emp.status === selectedStatus.value;
    const matchDept = !selectedDepartment.value || emp.department === selectedDepartment.value;
    return matchSearch && matchStatus && matchDept;
  });
});

const tableColumns = [
  { key: "id", label: "Employee ID" },
  { key: "name", label: "Name" },
  { key: "department", label: "Department" },
  { key: "address", label: "Alamat" },
  { key: "phone", label: "Phone" },
  { key: "joinDate", label: "Join" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action", class: "text-end no-sort" },
];

// Modal View
const isViewModalOpen = ref(false);
const viewingEmployee = ref<EmployeeItem | null>(null);

const openViewModal = (emp: EmployeeItem) => {
  viewingEmployee.value = emp;
  isViewModalOpen.value = true;
};

// Delete action
const deleteEmployee = (id: string) => {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees.value = employees.value.filter((e) => e.id !== id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Employees" subtitle="Manage your employees">
      <template #actions>
        <NuxtLink
          to="/add-employee"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-600 focus:outline-none"
        >
          <FeatherIcon name="plus-circle" size="18" />
          <span>Add New Employee</span>
        </NuxtLink>
      </template>
    </CommonPageHeader>

    <!-- Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="flex items-center justify-between rounded-xl bg-purple-600 p-5 text-white shadow-sm">
        <div>
          <p class="text-sm font-medium text-purple-100">Total Employee</p>
          <h4 class="mt-1 text-2xl font-bold">1007</h4>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
          <FeatherIcon name="users" size="24" />
        </div>
      </div>

      <div class="flex items-center justify-between rounded-xl bg-teal-600 p-5 text-white shadow-sm">
        <div>
          <p class="text-sm font-medium text-teal-100">Active</p>
          <h4 class="mt-1 text-2xl font-bold">1007</h4>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
          <FeatherIcon name="user-check" size="24" />
        </div>
      </div>

      <div class="flex items-center justify-between rounded-xl bg-slate-600 p-5 text-white shadow-sm">
        <div>
          <p class="text-sm font-medium text-slate-100">Inactive</p>
          <h4 class="mt-1 text-2xl font-bold">1007</h4>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
          <FeatherIcon name="user-x" size="24" />
        </div>
      </div>

      <div class="flex items-center justify-between rounded-xl bg-sky-500 p-5 text-white shadow-sm">
        <div>
          <p class="text-sm font-medium text-sky-100">New Joiners</p>
          <h4 class="mt-1 text-2xl font-bold">67</h4>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
          <FeatherIcon name="user-plus" size="24" />
        </div>
      </div>
    </div>

    <!-- Employee Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Filter Bar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 pe-8 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
            <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-gray-400">
              <FeatherIcon name="search" size="16" />
            </span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <select
            v-model="selectedStatus"
            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Resign">Resign</option>
          </select>

          <select
            v-model="selectedDepartment"
            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">All Department</option>
            <option value="Produksi">Produksi</option>
            <option value="Administrasi & Keuangan">Administrasi & Keuangan</option>
            <option value="Desain Grafis">Desain Grafis</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <TableDataTable :columns="tableColumns" :rows="filteredEmployees">
        <template #cell(id)="{ row }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.id }}</span>
        </template>

        <template #cell(name)="{ row }">
          <div class="font-medium text-gray-900 dark:text-gray-100">{{ row.name }}</div>
          <div class="text-xs text-gray-500">{{ row.email }}</div>
        </template>

        <template #cell(department)="{ row }">
          <span
            class="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {{ row.department }}
          </span>
        </template>

        <template #cell(address)="{ row }">
          <div
            class="max-w-xs truncate text-xs text-gray-600 dark:text-gray-400"
            :title="row.address + (row.detailAddress ? ', ' + row.detailAddress : '')"
          >
            {{ row.address }}
          </div>
        </template>

        <template #cell(phone)="{ row }">
          <span class="text-xs font-mono text-gray-700 dark:text-gray-300">{{ row.phone }}</span>
        </template>

        <template #cell(joinDate)="{ row }">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ row.joinDate }}</span>
        </template>

        <template #cell(status)="{ row }">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
              row.status === 'Active'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
            ]"
          >
            {{ row.status }}
          </span>
        </template>

        <template #cell(action)="{ row }">
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
              title="View"
              @click="openViewModal(row)"
            >
              <FeatherIcon name="eye" size="16" />
            </button>
            <NuxtLink
              :to="`/edit-employee?id=${row.id}`"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-amber-500 dark:hover:bg-gray-800"
              title="Edit"
            >
              <FeatherIcon name="edit" size="16" />
            </NuxtLink>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-800"
              title="Delete"
              @click="deleteEmployee(row.id)"
            >
              <FeatherIcon name="trash-2" size="16" />
            </button>
          </div>
        </template>
      </TableDataTable>
    </div>

    <!-- Modal View Employee -->
    <ModalBaseModal v-model="isViewModalOpen" title="View Employee" size="lg">
      <div v-if="viewingEmployee" class="space-y-6 text-sm">
        <!-- Photo Upload Placeholders -->
        <div class="grid grid-cols-2 gap-4">
          <div
            class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-4 text-center dark:border-gray-700"
          >
            <div class="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-primary">
              <FeatherIcon name="user" size="24" />
            </div>
            <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">Profile Photo</span>
          </div>
          <div
            class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-4 text-center dark:border-gray-700"
          >
            <div class="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FeatherIcon name="credit-card" size="24" />
            </div>
            <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">Photo ID</span>
          </div>
        </div>

        <!-- Emergency Information -->
        <div class="space-y-3">
          <h6 class="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-200">
            <FeatherIcon name="info" size="16" class="text-primary" />
            <span>Emergency Information</span>
          </h6>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="font-semibold text-gray-500">Employee Id</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.id }}</div>

            <div class="font-semibold text-gray-500">Full Name</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.name }}</div>

            <div class="font-semibold text-gray-500">Gender</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.gender || "-" }}</div>

            <div class="font-semibold text-gray-500">Date of Birth</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.dob || "-" }}</div>

            <div class="font-semibold text-gray-500">Join Channel</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.joinChannel || "Offline" }}</div>

            <div class="font-semibold text-gray-500">Join Date</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.joinDate }}</div>

            <div class="font-semibold text-gray-500">Address</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.address }}</div>

            <div class="font-semibold text-gray-500">Detail Address</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.detailAddress || "-" }}</div>
          </div>
        </div>

        <hr class="border-gray-200 dark:border-gray-800" />

        <!-- Designation -->
        <div class="space-y-3">
          <h6 class="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-200">
            <FeatherIcon name="briefcase" size="16" class="text-primary" />
            <span>Designation</span>
          </h6>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="font-semibold text-gray-500">Department</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.department }}</div>
          </div>
        </div>

        <hr class="border-gray-200 dark:border-gray-800" />

        <!-- Personal Information -->
        <div class="space-y-3">
          <h6 class="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-200">
            <FeatherIcon name="user" size="16" class="text-primary" />
            <span>Personal Information</span>
          </h6>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="font-semibold text-gray-500">Contact Person 1</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.contact1Name || "-" }}</div>

            <div class="font-semibold text-gray-500">Phone 1</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.contact1Phone || "-" }}</div>

            <div class="font-semibold text-gray-500">Contact Person 2</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.contact2Name || "-" }}</div>

            <div class="font-semibold text-gray-500">Phone 2</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.contact2Phone || "-" }}</div>
          </div>
        </div>

        <hr class="border-gray-200 dark:border-gray-800" />

        <!-- Account Information -->
        <div class="space-y-3">
          <h6 class="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-200">
            <FeatherIcon name="lock" size="16" class="text-primary" />
            <span>Account Information</span>
          </h6>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="font-semibold text-gray-500">Email</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.email || "-" }}</div>

            <div class="font-semibold text-gray-500">Phone</div>
            <div class="text-gray-900 dark:text-gray-100">{{ viewingEmployee.phone }}</div>

            <div class="font-semibold text-gray-500">Password</div>
            <div class="text-gray-900 dark:text-gray-100">••••••••</div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="isViewModalOpen = false"
          >
            Close
          </button>
        </div>
      </template>
    </ModalBaseModal>
  </div>
</template>
