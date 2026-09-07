<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Customer Balance Account</h4>
          <h6>Manage customer account balances and deposits</h6>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" @click.prevent="printList">
            <img src="/assets/img/icons/pdf.svg" alt="img" />
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print" @click.prevent="printList">
            <i class="feather-printer"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" @click.prevent="refreshList">
            <i class="feather-rotate-ccw"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header" @click.prevent="toggleHeader">
            <i class="feather-chevron-up"></i>
          </a>
        </li>
      </ul>
    </div>

    <!-- Stat Cards -->
    <div class="row mt-4">
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget w-100">
          <div class="dash-widgetimg">
            <span><img src="/assets/img/icons/dash1.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Balance Amount</h6>
            <h5>
              Rp <span>{{ formatNumber(totalBalance) }}</span>
            </h5>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-sm-6 col-12 d-flex">
        <div class="dash-widget dash1 w-100">
          <div class="dash-widgetimg">
            <span><img src="/assets/img/icons/dash2.svg" alt="img" /></span>
          </div>
          <div class="dash-widgetcontent">
            <h6>Total Customers</h6>
            <h5>
              <span>{{ customers.length }}</span>
            </h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="search-set d-block d-md-flex align-items-center gap-2">
            <div class="search-input">
              <input v-model="searchQuery" type="text" placeholder="Search customer..." class="form-control form-control-sm" />
            </div>
            <div class="type-filter">
              <select class="form-select form-select-sm" v-model="typeFilter">
                <option value="">All Customer Types</option>
                <option>Corporate</option>
                <option>General</option>
                <option>Reseller</option>
                <option>VIP</option>
              </select>
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table datanew">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Customer Type</th>
                <th class="text-end">Balance Amount (IDR)</th>
                <th class="no-sort">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredCustomers" :key="item.id">
                <td class="fw-bold">{{ item.code }}</td>
                <td>{{ item.name }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-outline-primary': item.type === 'Corporate',
                      'bg-outline-success': item.type === 'VIP',
                      'bg-outline-warning': item.type === 'Reseller',
                      'bg-outline-secondary': item.type === 'General',
                    }"
                  >
                    {{ item.type }}
                  </span>
                </td>
                <td class="text-end fw-bold text-success">{{ formatNumber(item.balance) }}</td>
                <td class="action-table-data">
                  <div class="edit-delete-action">
                    <a class="p-2 text-primary cursor-pointer" @click.prevent="viewCustomer(item)" title="View Details">
                      <i class="feather-eye"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredCustomers.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">No customer records found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- View Customer Balance Modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">Customer Balance Details</h4>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4" v-if="selectedCustomer">
            <div class="mb-2"><strong>Customer ID:</strong> {{ selectedCustomer.code }}</div>
            <div class="mb-2"><strong>Name:</strong> {{ selectedCustomer.name }}</div>
            <div class="mb-2"><strong>Type:</strong> {{ selectedCustomer.type }}</div>
            <div class="mb-2"><strong>Current Balance:</strong> Rp {{ formatNumber(selectedCustomer.balance) }}</div>
            <div class="modal-footer p-0 pt-3 border-top justify-content-end mt-4">
              <button type="button" class="btn btn-secondary" @click="showModal = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const customers = ref([
  { id: 1, code: "ID000001", name: "Aditya Pratama", type: "Corporate", balance: 1500000 },
  { id: 2, code: "ID000006", name: "Fitri Handayani", type: "General", balance: 350000 },
  { id: 3, code: "ID000007", name: "Guntur Saputra", type: "Reseller", balance: 257000 },
  { id: 4, code: "ID000008", name: "Hana Pertiwi", type: "VIP", balance: 1200000 },
  { id: 5, code: "ID000013", name: "Maya Indah", type: "General", balance: 580000 },
]);

const searchQuery = ref("");
const typeFilter = ref("");

const filteredCustomers = computed(() => {
  return customers.value.filter((c) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch = !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
    const matchesType = !typeFilter.value || c.type.toLowerCase() === typeFilter.value.toLowerCase();
    return matchesSearch && matchesType;
  });
});

const totalBalance = computed(() => customers.value.reduce((acc, c) => acc + c.balance, 0));

const showModal = ref(false);
const selectedCustomer = ref<any>(null);

const viewCustomer = (c: any) => {
  selectedCustomer.value = c;
  showModal.value = true;
};

const printList = () => {
  window.print();
};

const refreshList = () => {
  searchQuery.value = "";
  typeFilter.value = "";
};

const toggleHeader = () => {
  // toggle
};
</script>
