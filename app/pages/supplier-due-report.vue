<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Supplier Due Report</h4>
          <h6>Manage supplier accounts payable and due aging</h6>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" @click.prevent="printReport">
            <img src="/assets/img/icons/pdf.svg" alt="img" />
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print" @click.prevent="printReport">
            <i class="feather-printer"></i>
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh" @click.prevent="refreshReport">
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

    <!-- Table Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="search-set d-block d-md-flex align-items-center gap-2">
            <div class="search-input">
              <input v-model="searchQuery" type="text" placeholder="Search supplier..." class="form-control form-control-sm" />
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table datanew">
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th class="text-center">Purchases Due</th>
                <th class="text-end">Amount Due (IDR)</th>
                <th class="text-center">Days Due</th>
                <th class="no-sort text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredDues" :key="item.name">
                <td class="fw-bold">{{ item.name }}</td>
                <td class="text-center">{{ item.purchasesDue }}</td>
                <td class="text-end fw-bold text-danger">{{ formatNumber(item.amountDue) }}</td>
                <td class="text-center">
                  <span class="badge" :class="parseInt(item.daysDue) > 10 ? 'bg-outline-danger' : 'bg-outline-warning'">
                    {{ item.daysDue }}
                  </span>
                </td>
                <td class="action-table-data text-center">
                  <div class="edit-delete-action justify-content-center">
                    <a class="p-2 text-primary cursor-pointer" @click.prevent="viewDetail(item)" title="View Details">
                      <i class="feather-eye"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredDues.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">No records found.</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="fw-bold table-light">
                <td>Total</td>
                <td class="text-center">{{ totalPurchasesDue }}</td>
                <td class="text-end text-danger">{{ formatNumber(totalAmountDue) }}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">Supplier Payable Summary - {{ activeItem?.name }}</h4>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4" v-if="activeItem">
            <p><strong>Supplier:</strong> {{ activeItem.name }}</p>
            <p><strong>Pending Bills:</strong> {{ activeItem.purchasesDue }}</p>
            <p><strong>Total Amount Due:</strong> Rp {{ formatNumber(activeItem.amountDue) }}</p>
            <p><strong>Due Aging:</strong> {{ activeItem.daysDue }}</p>
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

const dues = ref([
  { name: "PT Kertas Jaya", purchasesDue: 2, amountDue: 7500000, daysDue: "14 Days" },
  { name: "Global Inkindo", purchasesDue: 1, amountDue: 850000, daysDue: "4 Days" },
  { name: "PT Duta Grafika", purchasesDue: 3, amountDue: 2500000, daysDue: "8 Days" },
  { name: "Indo Material", purchasesDue: 1, amountDue: 1950000, daysDue: "1 Day" },
]);

const searchQuery = ref("");

const filteredDues = computed(() => {
  return dues.value.filter((d) => !searchQuery.value || d.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const totalPurchasesDue = computed(() => filteredDues.value.reduce((acc, d) => acc + d.purchasesDue, 0));
const totalAmountDue = computed(() => filteredDues.value.reduce((acc, d) => acc + d.amountDue, 0));

const showModal = ref(false);
const activeItem = ref<any>(null);

const viewDetail = (item: any) => {
  activeItem.value = item;
  showModal.value = true;
};

const printReport = () => {
  window.print();
};

const refreshReport = () => {
  searchQuery.value = "";
};

const toggleHeader = () => {
  // toggle
};
</script>
