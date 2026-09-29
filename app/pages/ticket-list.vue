<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Support Ticket List</h4>
            <h6>Manage your Support Ticket</h6>
          </div>
        </div>

        <ul class="table-top-head">
          <li>
            <a title="Pdf" href="javascript:void(0);" @click="exportPdf"><img src="/assets/img/icons/pdf.svg" alt="img" /></a>
          </li>
          <li>
            <a title="Print" href="javascript:void(0);" @click="printTable"><i class="ti ti-printer"></i></a>
          </li>
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
        <div class="page-btn">
          <button type="button" class="btn btn-added btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-2"></i>Add New Support Ticket
          </button>
        </div>
      </div>

      <!-- KPI Widgets -->
      <div class="row mt-3 mb-4">
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h6 class="text-muted mb-1">Total Tickets</h6>
              <h4 class="mb-0 fw-bold">307,144.00</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-primary rounded-circle">
              <i class="ti ti-ticket fs-24 text-primary"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div
            class="dash-widget dash1 w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between"
          >
            <div>
              <h6 class="text-muted mb-1">Total Pending Tickets</h6>
              <h4 class="mb-0 fw-bold text-warning">4,385.00</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-warning rounded-circle">
              <i class="ti ti-clock-pause fs-24 text-warning"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div
            class="dash-widget dash2 w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between"
          >
            <div>
              <h6 class="text-muted mb-1">Total Closed Tickets</h6>
              <h4 class="mb-0 fw-bold text-success">385,656.50</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-success rounded-circle">
              <i class="ti ti-circle-check fs-24 text-success"></i>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div
            class="dash-widget dash3 w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between"
          >
            <div>
              <h6 class="text-muted mb-1">Total Deleted Tickets</h6>
              <h4 class="mb-0 fw-bold text-danger">400.00</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-danger rounded-circle">
              <i class="ti ti-trash fs-24 text-danger"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Ticket List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Search ticket id, requester, subject..."
                />
              </div>
            </div>
            <div class="filters d-flex align-items-center gap-2">
              <select v-model="filterPriority" class="form-select form-select-sm" style="width: auto">
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select v-model="filterStatus" class="form-select form-select-sm" style="width: auto">
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>ID</th>
                  <th>Requested By</th>
                  <th>Subject</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Due Date</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredTickets" :key="item.id">
                  <td class="fw-bold text-primary">{{ item.ticketId }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <img :src="item.avatar" alt="user" class="rounded-circle" width="30" height="30" />
                      <NuxtLink to="/ticket-detail" class="fw-medium text-dark">{{ item.requestedBy }}</NuxtLink>
                    </div>
                  </td>
                  <td>{{ item.subject }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <img :src="item.assigneeAvatar" alt="user" class="rounded-circle" width="30" height="30" />
                      <span>{{ item.assignee }}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      class="badge"
                      :class="{
                        'bg-danger': item.priority === 'High',
                        'bg-primary': item.priority === 'Medium',
                        'bg-secondary': item.priority === 'Low',
                      }"
                    >
                      {{ item.priority }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" :class="item.status === 'Open' ? 'bg-success' : 'bg-dark'">
                      {{ item.status }}
                    </span>
                  </td>
                  <td>{{ item.createdDate }}</td>
                  <td>{{ item.dueDate }}</td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <NuxtLink to="/ticket-detail" class="me-2 p-2 text-info" title="View">
                        <i class="ti ti-eye"></i>
                      </NuxtLink>
                      <a class="me-2 p-2" href="javascript:void(0);" title="Edit" @click="openEditModal(item)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <a
                        class="confirm-text p-2 align-center text-danger"
                        href="javascript:void(0);"
                        title="Delete"
                        @click="deleteItem(item.id)"
                      >
                        <i class="ti ti-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredTickets.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">No tickets found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add Ticket Modal -->
      <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Add New Support Ticket</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="saveTicket">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-lg-6">
                    <label class="form-label">Requested By <span class="text-danger">*</span></label>
                    <input v-model="formData.requestedBy" type="text" class="form-control" required placeholder="User name" />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Assignee <span class="text-danger">*</span></label>
                    <input v-model="formData.assignee" type="text" class="form-control" required placeholder="Staff assignee" />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Subject <span class="text-danger">*</span></label>
                    <input
                      v-model="formData.subject"
                      type="text"
                      class="form-control"
                      required
                      placeholder="Ticket topic / issue"
                    />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Priority</label>
                    <select v-model="formData.priority" class="form-select">
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Due Date</label>
                    <input v-model="formData.dueDate" type="date" class="form-control" />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Description</label>
                    <textarea
                      v-model="formData.description"
                      class="form-control"
                      rows="3"
                      placeholder="Describe the issue..."
                    ></textarea>
                  </div>
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end">
                <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-warning modal-action-submit text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Edit Ticket Modal -->
      <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Edit Support Ticket</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="updateTicket">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-lg-6">
                    <label class="form-label">Requested By <span class="text-danger">*</span></label>
                    <input v-model="formData.requestedBy" type="text" class="form-control" required />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Assignee <span class="text-danger">*</span></label>
                    <input v-model="formData.assignee" type="text" class="form-control" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label">Subject <span class="text-danger">*</span></label>
                    <input v-model="formData.subject" type="text" class="form-control" required />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Priority</label>
                    <select v-model="formData.priority" class="form-select">
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Status</label>
                    <select v-model="formData.status" class="form-select">
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end">
                <button type="button" class="btn btn-dark modal-action-cancel" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-warning modal-action-submit text-white">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

useHead({
  title: "Support Ticket List - Kacetak System",
});

interface TicketItem {
  id: number;
  ticketId: string;
  requestedBy: string;
  avatar: string;
  subject: string;
  assignee: string;
  assigneeAvatar: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "Closed";
  createdDate: string;
  dueDate: string;
}

const tickets = ref<TicketItem[]>([
  {
    id: 1,
    ticketId: "#1020",
    requestedBy: "Lindsay Walton",
    avatar: "/assets/img/users/user-23.jpg",
    subject: "A new rating has been received",
    assignee: "Desman Dwi",
    assigneeAvatar: "/assets/img/users/user-23.jpg",
    priority: "Medium",
    status: "Closed",
    createdDate: "13/08/2023",
    dueDate: "30/08/2023",
  },
  {
    id: 2,
    ticketId: "#1254",
    requestedBy: "Jhon Maryo",
    avatar: "/assets/img/users/user-24.jpg",
    subject: "Your application has been received!",
    assignee: "Eko Satrio",
    assigneeAvatar: "/assets/img/users/user-24.jpg",
    priority: "High",
    status: "Closed",
    createdDate: "01/04/2024",
    dueDate: "21/05/2024",
  },
  {
    id: 3,
    ticketId: "#1256",
    requestedBy: "Jerry Geiger",
    avatar: "/assets/img/users/user-25.jpg",
    subject: "Support for theme",
    assignee: "Desman Dwi",
    assigneeAvatar: "/assets/img/users/user-25.jpg",
    priority: "Low",
    status: "Open",
    createdDate: "28/07/2024",
    dueDate: "28/07/2024",
  },
  {
    id: 4,
    ticketId: "#1352",
    requestedBy: "Adam Thomas",
    avatar: "/assets/img/users/user-26.jpg",
    subject: "Question regarding your Tailwind Theme",
    assignee: "Eko Satrio",
    assigneeAvatar: "/assets/img/users/user-26.jpg",
    priority: "Medium",
    status: "Open",
    createdDate: "10/08/2024",
    dueDate: "15/08/2024",
  },
]);

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

const openEditModal = (item: TicketItem) => {
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
};

const toggleCollapse = () => {
  // collapsible header
};
</script>
