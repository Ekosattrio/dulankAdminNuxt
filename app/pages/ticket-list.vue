<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Support Ticket List" subtitle="Manage your Support Ticket">
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
            <span>Add New Support Ticket</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- KPI Widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CommonStatCard label="Total Tickets" value="307,144.00" icon="ticket" tone="primary" />
      <CommonStatCard label="Total Pending Tickets" value="4,385.00" icon="clock" tone="warning" />
      <CommonStatCard label="Total Closed Tickets" value="385,656.50" icon="check-circle" tone="success" />
      <CommonStatCard label="Total Deleted Tickets" value="400.00" icon="trash-2" tone="danger" />
    </div>

    <!-- Ticket List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search ticket id, requester, subject..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterPriority"
            allLabel="All Priorities"
            :options="[
              { value: 'High', label: 'High' },
              { value: 'Medium', label: 'Medium' },
              { value: 'Low', label: 'Low' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="All Statuses"
            :options="[
              { value: 'Open', label: 'Open' },
              { value: 'Closed', label: 'Closed' },
            ]"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">ID</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Requested By</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Subject</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Assignee</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Priority</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Due Date</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredTickets" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-primary">{{ item.ticketId }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <img :src="item.avatar" alt="user" class="h-7 w-7 rounded-full object-cover" />
                  <NuxtLink to="/ticket-detail" class="font-medium text-gray-900 hover:text-primary dark:text-gray-100">{{ item.requestedBy }}</NuxtLink>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.subject }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <img :src="item.assigneeAvatar" alt="user" class="h-7 w-7 rounded-full object-cover" />
                  <span>{{ item.assignee }}</span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.priority" :tone="item.priority === 'High' ? 'rose' : item.priority === 'Medium' ? 'indigo' : 'slate'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" :tone="item.status === 'Open' ? 'emerald' : 'slate'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.createdDate }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.dueDate }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteItem(item.id)">
                  <template #extra>
                    <NuxtLink
                      to="/ticket-detail"
                      title="View"
                      class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-sky-500 dark:hover:bg-gray-800"
                    >
                      <CommonFeatherIcon name="eye" size="16" />
                    </NuxtLink>
                  </template>
                </CommonRowActions>
              </td>
            </tr>
            <tr v-if="filteredTickets.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No tickets found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Ticket Modal -->
    <CommonBaseModal v-model="showAddModal" title="Add New Support Ticket" maxWidth="lg">
      <form @submit.prevent="saveTicket" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Requested By" required>
            <input
              v-model="formData.requestedBy"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="User name"
            />
          </CommonFormField>
          <CommonFormField label="Assignee" required>
            <input
              v-model="formData.assignee"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
              placeholder="Staff assignee"
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Subject" required>
          <input
            v-model="formData.subject"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
            placeholder="Ticket topic / issue"
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Priority">
            <select
              v-model="formData.priority"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Due Date">
            <input
              v-model="formData.dueDate"
              type="date"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Description">
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Describe the issue..."
          ></textarea>
        </CommonFormField>
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- Edit Ticket Modal -->
    <CommonBaseModal v-model="showEditModal" title="Edit Support Ticket" maxWidth="lg">
      <form @submit.prevent="updateTicket" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Requested By" required>
            <input
              v-model="formData.requestedBy"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
          <CommonFormField label="Assignee" required>
            <input
              v-model="formData.assignee"
              type="text"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              required
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Subject" required>
          <input
            v-model="formData.subject"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Priority">
            <select
              v-model="formData.priority"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Status">
            <select
              v-model="formData.status"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </CommonFormField>
        </div>
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

useHead({
  title: "Support Ticket List - Kacetak System",
});

const { data: ticketListData } = await useFetch<TicketListItem[]>('/api/ticket-list')
const tickets = ref<TicketListItem[]>(ticketListData.value ?? [])
useMockSync('ticket-list', tickets);

const searchQuery = ref("");
const filterPriority = ref("");
const filterStatus = ref("");

const filteredTickets = computed(() => {
  return tickets.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchSearch =
      !q ||
      item.ticketId.toLowerCase().includes(q) ||
      item.requestedBy.toLowerCase().includes(q) ||
      item.subject.toLowerCase().includes(q);
    const matchPri = !filterPriority.value || item.priority === filterPriority.value;
    const matchSt = !filterStatus.value || item.status === filterStatus.value;
    return matchSearch && matchPri && matchSt;
  });
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const editingId = ref<number | null>(null);

const defaultFormData = () => ({
  requestedBy: "",
  assignee: "Eko Satrio",
  subject: "",
  priority: "Medium" as "High" | "Medium" | "Low",
  status: "Open" as "Open" | "Closed",
  dueDate: "",
  description: "",
});

const formData = ref(defaultFormData());

const openAddModal = () => {
  formData.value = defaultFormData();
  showAddModal.value = true;
};

const openEditModal = (item: TicketListItem) => {
  editingId.value = item.id;
  formData.value = {
    requestedBy: item.requestedBy,
    assignee: item.assignee,
    subject: item.subject,
    priority: item.priority,
    status: item.status,
    dueDate: item.dueDate,
    description: "",
  };
  showEditModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingId.value = null;
};

const saveTicket = () => {
  const newId = Math.max(0, ...tickets.value.map((t) => t.id)) + 1;
  const count = 1020 + tickets.value.length;
  tickets.value.unshift({
    id: newId,
    ticketId: `#${count}`,
    requestedBy: formData.value.requestedBy,
    avatar: "/assets/img/users/user-23.jpg",
    subject: formData.value.subject,
    assignee: formData.value.assignee,
    assigneeAvatar: "/assets/img/users/user-24.jpg",
    priority: formData.value.priority,
    status: "Open",
    createdDate: new Date().toLocaleDateString("en-GB"),
    dueDate: formData.value.dueDate || "20/08/2025",
  });
  closeModal();
};

const updateTicket = () => {
  if (editingId.value === null) return;
  const idx = tickets.value.findIndex((t) => t.id === editingId.value);
  if (idx !== -1) {
    tickets.value[idx] = {
      ...tickets.value[idx],
      requestedBy: formData.value.requestedBy,
      assignee: formData.value.assignee,
      subject: formData.value.subject,
      priority: formData.value.priority,
      status: formData.value.status,
    };
  }
  closeModal();
};

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this ticket?")) {
    tickets.value = tickets.value.filter((t) => t.id !== id);
  }
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  searchQuery.value = "";
  filterPriority.value = "";
  filterStatus.value = "";
};</script>