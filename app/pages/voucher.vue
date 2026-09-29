<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Coupons</h4>
            <h6>Manage Your Coupons</h6>
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
            <i class="ti ti-circle-plus me-2"></i>Add New Coupons
          </button>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search coupon name or code..." />
              </div>
            </div>
            <div class="search-path">
              <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-filter" :class="{ active: showFilters }" @click="showFilters = !showFilters">
                  <i class="ti ti-filter"></i>
                  <span v-if="showFilters"><img src="/assets/img/icons/closes.svg" alt="close" /></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Filter Section -->
          <div v-if="showFilters" class="filter-collapse mb-4 p-3 bg-light rounded">
            <div class="row g-3">
              <div class="col-lg-3 col-sm-6 col-12">
                <label class="form-label fs-12 text-muted mb-1">Coupon Type</label>
                <select v-model="filterType" class="form-select form-select-sm">
                  <option value="">All Types</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Percentage">Percentage</option>
                </select>
              </div>
              <div class="col-lg-3 col-sm-6 col-12">
                <label class="form-label fs-12 text-muted mb-1">Status</label>
                <select v-model="filterStatus" class="form-select form-select-sm">
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div class="col-lg-3 col-sm-6 col-12">
                <label class="form-label fs-12 text-muted mb-1">Store Filter</label>
                <select v-model="filterStore" class="form-select form-select-sm">
                  <option value="">All Stores</option>
                  <option value="Ellectro Mart">Ellectro Mart</option>
                  <option value="Ekos Mart">Ekos Mart</option>
                </select>
              </div>
              <div class="col-lg-3 col-sm-6 col-12 d-flex align-items-end">
                <button type="button" class="btn btn-sm btn-outline-secondary w-100" @click="resetFilters">Reset Filters</button>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Limit</th>
                  <th>Used</th>
                  <th>Valid</th>
                  <th>Status</th>
                  <th class="no-sort text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredCoupons" :key="item.id">
                  <td class="fw-medium text-dark">{{ item.name }}</td>
                  <td>
                    <span class="badge bg-outline-info text-info border border-info px-2 py-1">{{ item.code }}</span>
                  </td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.discountDisplay }}</td>
                  <td>{{ item.limit === 0 ? "Unlimited" : String(item.limit).padStart(2, "0") }}</td>
                  <td>{{ String(item.used).padStart(2, "0") }}</td>
                  <td>{{ item.validDate }}</td>
                  <td>
                    <span class="badge" :class="item.status === 'Active' ? 'bg-success' : 'bg-danger'">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="action-table-data text-end">
                    <div class="edit-delete-action justify-content-end">
                      <a class="me-2 p-2" href="javascript:void(0);" @click="openEditModal(item)">
                        <i class="ti ti-edit"></i>
                      </a>
                      <a
                        class="confirm-text p-2 align-center text-danger"
                        href="javascript:void(0);"
                        @click="deleteItem(item.id)"
                      >
                        <i class="ti ti-trash"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredCoupons.length === 0">
                  <td colspan="9" class="text-center py-4 text-muted">No vouchers or coupons found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add Coupon Modal -->
      <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Add Coupons</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="saveCoupon">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Name <span class="text-danger">*</span></label>
                      <input v-model="formData.name" type="text" class="form-control" required placeholder="e.g. Coupons 21" />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Code <span class="text-danger">*</span></label>
                      <input v-model="formData.code" type="text" class="form-control" required placeholder="e.g. CHRISTMAS20" />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Type <span class="text-danger">*</span></label>
                      <select v-model="formData.type" class="form-select" required>
                        <option value="Fixed">Fixed</option>
                        <option value="Percentage">Percentage</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Discount Value <span class="text-danger">*</span></label>
                      <input
                        v-model.number="formData.discount"
                        type="number"
                        class="form-control"
                        required
                        min="1"
                        placeholder="Amount or %"
                      />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div>
                      <label class="form-label">Limit</label>
                      <input v-model.number="formData.limit" type="number" class="form-control" min="0" placeholder="Limit" />
                      <span class="text-muted fs-12">0 for Unlimited</span>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Start Date</label>
                      <input v-model="formData.startDate" type="date" class="form-control" />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">End Date</label>
                      <input v-model="formData.endDate" type="date" class="form-control" />
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="border rounded p-3">
                      <div class="form-check form-switch d-flex align-items-center justify-content-between mb-2">
                        <label class="form-check-label" for="allProducts">Applicable to All Products</label>
                        <input
                          id="allProducts"
                          v-model="formData.allProducts"
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </div>
                      <div class="form-check form-switch d-flex align-items-center justify-content-between">
                        <label class="form-check-label" for="oncePerCustomer">Once Per Customer</label>
                        <input
                          id="oncePerCustomer"
                          v-model="formData.oncePerCustomer"
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-check form-switch d-flex align-items-center gap-2">
                      <input
                        id="couponStatus"
                        v-model="formData.isActive"
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                      <label class="form-check-label" for="couponStatus">Active Status</label>
                    </div>
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

      <!-- Edit Coupon Modal -->
      <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header">
              <div class="page-title">
                <h4>Edit Coupons</h4>
              </div>
              <button type="button" class="close bg-danger text-white fs-16 border-0 rounded-circle" @click="closeModal">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="updateCoupon">
              <div class="modal-body custom-modal-body">
                <div class="row g-3">
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Name <span class="text-danger">*</span></label>
                      <input v-model="formData.name" type="text" class="form-control" required />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Code <span class="text-danger">*</span></label>
                      <input v-model="formData.code" type="text" class="form-control" required />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Type <span class="text-danger">*</span></label>
                      <select v-model="formData.type" class="form-select" required>
                        <option value="Fixed">Fixed</option>
                        <option value="Percentage">Percentage</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Discount Value <span class="text-danger">*</span></label>
                      <input v-model.number="formData.discount" type="number" class="form-control" required min="1" />
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div>
                      <label class="form-label">Limit</label>
                      <input v-model.number="formData.limit" type="number" class="form-control" min="0" />
                      <span class="text-muted fs-12">0 for Unlimited</span>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">Start Date</label>
                      <input v-model="formData.startDate" type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div>
                      <label class="form-label">End Date</label>
                      <input v-model="formData.endDate" type="text" class="form-control" />
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="border rounded p-3">
                      <div class="form-check form-switch d-flex align-items-center justify-content-between mb-2">
                        <label class="form-check-label" for="editAllProducts">Applicable to All Products</label>
                        <input
                          id="editAllProducts"
                          v-model="formData.allProducts"
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </div>
                      <div class="form-check form-switch d-flex align-items-center justify-content-between">
                        <label class="form-check-label" for="editOncePerCustomer">Once Per Customer</label>
                        <input
                          id="editOncePerCustomer"
                          v-model="formData.oncePerCustomer"
                          class="form-check-input"
                          type="checkbox"
                          role="switch"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-check form-switch d-flex align-items-center gap-2">
                      <input
                        id="editCouponStatus"
                        v-model="formData.isActive"
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                      />
                      <label class="form-check-label" for="editCouponStatus">Active Status</label>
                    </div>
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
  title: "Voucher - Kacetak System",
});

interface CouponItem {
  id: number;
  name: string;
  code: string;
  type: "Fixed" | "Percentage";
  discount: number;
  discountDisplay: string;
  limit: number;
  used: number;
  validDate: string;
  startDate: string;
  endDate: string;
  allProducts: boolean;
  oncePerCustomer: boolean;
  status: "Active" | "Inactive";
}

const coupons = ref<CouponItem[]>([
  {
    id: 1,
    name: "Coupons 21",
    code: "Christmas",
    type: "Fixed",
    discount: 20000,
    discountDisplay: "Rp20.000",
    limit: 4,
    used: 1,
    validDate: "04 Jan 2023",
    startDate: "2023-01-01",
    endDate: "2023-01-04",
    allProducts: true,
    oncePerCustomer: false,
    status: "Active",
  },
  {
    id: 2,
    name: "First Offer",
    code: "First Offer",
    type: "Percentage",
    discount: 10,
    discountDisplay: "10%",
    limit: 47,
    used: 10,
    validDate: "15 Feb 2023",
    startDate: "2023-02-01",
    endDate: "2023-02-15",
    allProducts: true,
    oncePerCustomer: true,
    status: "Active",
  },
  {
    id: 3,
    name: "Offer 40",
    code: "40% Offer",
    type: "Fixed",
    discount: 20000,
    discountDisplay: "Rp20.000",
    limit: 21,
    used: 14,
    validDate: "08 Apr 2023",
    startDate: "2023-04-01",
    endDate: "2023-04-08",
    allProducts: false,
    oncePerCustomer: false,
    status: "Active",
  },
  {
    id: 4,
    name: "Subscription",
    code: "FirstSub01",
    type: "Fixed",
    discount: 20000,
    discountDisplay: "Rp20.000",
    limit: 9,
    used: 7,
    validDate: "12 Aug 2023",
    startDate: "2023-08-01",
    endDate: "2023-08-12",
    allProducts: true,
    oncePerCustomer: true,
    status: "Inactive",
  },
]);

const searchQuery = ref("");
const showFilters = ref(false);
const filterType = ref("");
const filterStatus = ref("");
const filterStore = ref("");

const filteredCoupons = computed(() => {
  return coupons.value.filter((item) => {
    const matchSearch =
      searchQuery.value === "" ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchType = !filterType.value || item.type === filterType.value;
    const matchStatus = !filterStatus.value || item.status === filterStatus.value;
    return matchSearch && matchType && matchStatus;
  });
});

const showAddModal = ref(false);
const showEditModal = ref(false);
const editingId = ref<number | null>(null);

const defaultFormData = () => ({
  name: "",
  code: "",
  type: "Fixed" as "Fixed" | "Percentage",
  discount: 20000,
  limit: 10,
  startDate: "",
  endDate: "",
  allProducts: true,
  oncePerCustomer: false,
  isActive: true,
});

const formData = ref(defaultFormData());

const openAddModal = () => {
  formData.value = defaultFormData();
  showAddModal.value = true;
};

const openEditModal = (item: CouponItem) => {
  editingId.value = item.id;
  formData.value = {
    name: item.name,
    code: item.code,
    type: item.type,
    discount: item.discount,
    limit: item.limit,
    startDate: item.startDate,
    endDate: item.endDate,
    allProducts: item.allProducts,
    oncePerCustomer: item.oncePerCustomer,
    isActive: item.status === "Active",
  };
  showEditModal.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingId.value = null;
};

const formatDiscountDisplay = (val: number, type: "Fixed" | "Percentage") => {
  if (type === "Percentage") return `${val}%`;
  return `Rp${new Intl.NumberFormat("id-ID").format(val)}`;
};

const saveCoupon = () => {
  const newId = Math.max(0, ...coupons.value.map((c) => c.id)) + 1;
  coupons.value.unshift({
    id: newId,
    name: formData.value.name,
    code: formData.value.code,
    type: formData.value.type,
    discount: formData.value.discount,
    discountDisplay: formatDiscountDisplay(formData.value.discount, formData.value.type),
    limit: formData.value.limit,
    used: 0,
    validDate: formData.value.endDate || "Ongoing",
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    allProducts: formData.value.allProducts,
    oncePerCustomer: formData.value.oncePerCustomer,
    status: formData.value.isActive ? "Active" : "Inactive",
  });
  closeModal();
};

const updateCoupon = () => {
  if (editingId.value === null) return;
  const idx = coupons.value.findIndex((c) => c.id === editingId.value);
  if (idx !== -1) {
    coupons.value[idx] = {
      ...coupons.value[idx],
      name: formData.value.name,
      code: formData.value.code,
      type: formData.value.type,
      discount: formData.value.discount,
      discountDisplay: formatDiscountDisplay(formData.value.discount, formData.value.type),
      limit: formData.value.limit,
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      validDate: formData.value.endDate || coupons.value[idx].validDate,
      allProducts: formData.value.allProducts,
      oncePerCustomer: formData.value.oncePerCustomer,
      status: formData.value.isActive ? "Active" : "Inactive",
    };
  }
  closeModal();
};

const deleteItem = (id: number) => {
  if (confirm("Are you sure you want to delete this coupon?")) {
    coupons.value = coupons.value.filter((c) => c.id !== id);
  }
};

const resetFilters = () => {
  searchQuery.value = "";
  filterType.value = "";
  filterStatus.value = "";
  filterStore.value = "";
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  resetFilters();
};

const toggleCollapse = () => {
  // collapsible header
};
</script>
