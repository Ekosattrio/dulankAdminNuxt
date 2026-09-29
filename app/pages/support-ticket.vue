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
      </div>

      <!-- KPI Widgets -->
      <div class="row mt-3 mb-4">
        <div class="col-xl-3 col-sm-6 col-12 d-flex">
          <div class="dash-widget w-100 p-3 bg-white rounded border shadow-sm d-flex align-items-center justify-content-between">
            <div>
              <h6 class="text-muted mb-1">Total Tickets</h6>
              <h4 class="mb-0 fw-bold">307,144</h4>
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
              <h4 class="mb-0 fw-bold text-warning">4,385</h4>
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
              <h4 class="mb-0 fw-bold text-success">385,656</h4>
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
              <h4 class="mb-0 fw-bold text-danger">4,000</h4>
            </div>
            <div class="dash-widgetimg p-3 bg-light-danger rounded-circle">
              <i class="ti ti-trash fs-24 text-danger"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Table List Card -->
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
                    <NuxtLink to="/support-ticket-detail" class="fw-medium text-dark">{{ item.requestedBy }}</NuxtLink>
                  </td>
                  <td>{{ item.subject }}</td>
                  <td>{{ item.assignee }}</td>
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
                      <NuxtLink to="/support-ticket-detail" class="me-2 p-2 text-info" title="View Detail">
                        <i class="ti ti-eye"></i>
                      </NuxtLink>
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
                  <td colspan="9" class="text-center py-4 text-muted">No support tickets found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

useHead({
  title: "Support Ticket List - Kacetak System",
});

const { data: supportTicketData } = await useFetch<TicketItem[]>('/api/support-ticket')
const tickets = ref<TicketItem[]>(supportTicketData.value ?? []);

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

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this support ticket?")) {
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
};</script>
