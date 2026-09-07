<template>
  <div class="content">
    <div class="page-header transfer">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Purchase List</h4>
          <h6>Manage your purchases</h6>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" @click.prevent="exportPdf">
            <img src="/assets/img/icons/pdf.svg" alt="img" />
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="print" @click.prevent="printList">
            <img src="/assets/img/icons/printer.svg" alt="img" />
          </a>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header" @click.prevent="toggleHeader">
            <i class="feather-chevron-up"></i>
          </a>
        </li>
      </ul>
      <div class="d-flex purchase-pg-btn">
        <div class="page-btn">
          <NuxtLink to="/add-purchase" class="btn btn-added"> <i class="feather-plus-circle me-2"></i>Add New Purchase </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Purchase List Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <!-- Filter -->
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <!-- Search Input -->
          <div class="search-set d-block d-md-flex align-items-center gap-2">
            <div class="search-input">
              <input v-model="searchQuery" type="text" placeholder="Search..." class="form-control form-control-sm" />
            </div>
            <!-- Date Range -->
            <div class="my-2">
              <div class="pemilihrentang-container position-relative">
                <input
                  type="text"
                  class="pemilihrentang-input form-control form-control-sm cursor-pointer"
                  readonly
                  placeholder="Date"
                  :value="selectedDateRangeLabel"
                  @click="showDateDropdown = !showDateDropdown"
                  style="height: fit-content !important; width: 100% !important"
                />
                <div
                  v-if="showDateDropdown"
                  class="pemilihrentang-panel position-absolute bg-white border rounded shadow p-2 mt-1 z-3"
                >
                  <div class="opsi-cepat">
                    <div class="p-1 hover:bg-gray-100 cursor-pointer" @click="setDateRange('kemarin')">Kemarin</div>
                    <div class="p-1 hover:bg-gray-100 cursor-pointer" @click="setDateRange('7hari')">7 Hari Terakhir</div>
                    <div class="p-1 hover:bg-gray-100 cursor-pointer" @click="setDateRange('bulanIni')">Bulan Ini</div>
                    <div class="p-1 hover:bg-gray-100 cursor-pointer" @click="setDateRange('bulanLalu')">Bulan Lalu</div>
                    <div class="p-1 hover:bg-gray-100 cursor-pointer" @click="setDateRange('tahunLalu')">Tahun Lalu</div>
                    <div class="p-1 hover:bg-gray-100 cursor-pointer text-muted" @click="setDateRange('semua')">Semua</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="filters d-flex justify-content-end gap-2">
            <div class="dropdown">
              <button
                class="btn btn-outline-primary dropdown-toggle btn-sm"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ statusFilter || "Status" }}
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = ''">All Status</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Complete'">Complete</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Pending'">Pending</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Ordered'">Ordered</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="statusFilter = 'Received'">Received</a></li>
              </ul>
            </div>
            <div class="dropdown">
              <button
                class="btn btn-outline-primary dropdown-toggle btn-sm"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ paymentFilter || "Payment Status" }}
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item cursor-pointer" @click="paymentFilter = ''">All Payment</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="paymentFilter = 'Paid'">Paid</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="paymentFilter = 'Unpaid'">Unpaid</a></li>
                <li><a class="dropdown-item cursor-pointer" @click="paymentFilter = 'Partial'">Partial</a></li>
              </ul>
            </div>
          </div>
        </div>
        <!-- /Filter -->

        <div class="table-responsive">
          <table class="table datanew">
            <thead>
              <tr>
                <th class="no-sort"></th>
                <th>No Purchase</th>
                <th>Date</th>
                <th>Created</th>
                <th>Supplier</th>
                <th>Product</th>
                <th>Status</th>
                <th>Amount (IDR)</th>
                <th>Paid (IDR)</th>
                <th>Due (IDR)</th>
                <th>Payment</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredPurchases" :key="item.id">
                <td>
                  <div class="dropdown">
                    <button type="button" class="btn btn-light btn-sm p-1" data-bs-toggle="dropdown">
                      <i class="feather-more-vertical text-muted"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-right shadow-sm p-1">
                      <li>
                        <button
                          class="dropdown-item d-flex align-items-center small py-1"
                          type="button"
                          @click="viewPurchase(item)"
                        >
                          <i class="feather-eye me-2"></i> Purchase Detail
                        </button>
                      </li>
                      <li>
                        <button
                          class="dropdown-item d-flex align-items-center small py-1"
                          type="button"
                          @click="editPurchase(item)"
                        >
                          <i class="feather-edit me-2"></i> Edit
                        </button>
                      </li>
                      <li>
                        <button
                          class="dropdown-item d-flex align-items-center small py-1 text-danger"
                          type="button"
                          @click="deletePurchase(item)"
                        >
                          <i class="feather-trash-2 me-2"></i> Delete
                        </button>
                      </li>
                      <li>
                        <NuxtLink to="/purchase-order" class="dropdown-item d-flex align-items-center small py-1">
                          <i class="feather-plus-circle me-2"></i> Create Purchase Order
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </td>
                <td class="fw-bold">{{ item.noPurchase }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.created }}</td>
                <td>{{ item.supplier }}</td>
                <td>{{ item.product }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-outline-success': item.status === 'Received' || item.status === 'Complete',
                      'bg-outline-warning': item.status === 'Ordered',
                      'bg-outline-danger': item.status === 'Pending',
                    }"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="fw-semibold">{{ formatNumber(item.amount) }}</td>
                <td class="text-success">{{ formatNumber(item.paid) }}</td>
                <td :class="item.due > 0 ? 'text-danger' : 'text-muted'">{{ formatNumber(item.due) }}</td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-outline-success': item.paymentStatus === 'Paid',
                      'bg-outline-warning': item.paymentStatus === 'Partial',
                      'bg-outline-danger': item.paymentStatus === 'Unpaid',
                    }"
                  >
                    {{ item.paymentStatus }}
                  </span>
                </td>
                <td class="text-muted small">{{ item.notes || "-" }}</td>
              </tr>
              <tr v-if="filteredPurchases.length === 0">
                <td colspan="12" class="text-center py-4 text-muted">No purchase records found.</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td class="text-start fw-bold">Total</td>
                <td colspan="5"></td>
                <td class="fw-bold text-dark">{{ formatNumber(totalAmount) }}</td>
                <td class="fw-bold text-success">{{ formatNumber(totalPaid) }}</td>
                <td class="fw-bold text-danger">{{ formatNumber(totalDue) }}</td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- View Purchase Modal -->
    <div v-if="showViewModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog sales-details-modal modal-lg">
        <div class="modal-content" style="border-radius: 10px; overflow: hidden; position: relative">
          <div class="page-wrapper details-blk">
            <div class="content p-4" id="section-to-print">
              <!-- Header -->
              <div class="modal-header d-flex justify-content-between align-items-start border-0 pb-0">
                <div class="page-title">
                  <h4>Purchase</h4>
                </div>
                <button type="button" class="btn-close ms-3 mt-1" @click="showViewModal = false"></button>
              </div>
              <ul class="table-top-head d-flex gap-3 mt-2 me-5 mb-0 justify-content-end pe-4">
                <li>
                  <a href="#" @click.prevent="openEditFromView" title="Edit">
                    <i class="feather-edit action-edit sales-action"></i>
                  </a>
                </li>
                <li>
                  <a href="#" title="PDF" @click.prevent="exportPdf">
                    <img src="/assets/img/icons/pdf.svg" alt="pdf" />
                  </a>
                </li>
                <li>
                  <a href="#" title="Print" @click.prevent="printModal">
                    <i class="feather-printer"></i>
                  </a>
                </li>
              </ul>

              <!-- Body -->
              <div class="mt-4 mb-3 px-3">
                <div class="invoice-box" style="font-size: 14px; line-height: 22px; color: #555">
                  <!-- Top Info -->
                  <div class="row mb-4 d-flex justify-content-between">
                    <div class="col-8">
                      <h6 class="fw-bold mb-1">Supplier :</h6>
                      <p class="mb-0">
                        {{ activePurchase?.supplier || "PT Cipta Kreasi" }}<br />
                        ciptakreasi@gmail.com<br />
                        62819 0685 5554<br />
                        Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said,<br />
                        X5 No. 13, Jakarta Selatan, 12950
                      </p>
                    </div>
                    <div class="col-4">
                      <div class="row my-1">
                        <div class="offset-4 col-4 text-start fw-bold">Purchase Info</div>
                      </div>
                      <div class="row my-1">
                        <div class="offset-4 col-4 text-start small">No. Purchase</div>
                        <div class="col-4 small">: {{ activePurchase?.noPurchase }}</div>
                      </div>
                      <div class="row my-1">
                        <div class="offset-4 col-4 text-start small">Date</div>
                        <div class="col-4 small">: {{ activePurchase?.date }}</div>
                      </div>
                      <div class="row my-1">
                        <div class="offset-4 col-4 text-start small">Created</div>
                        <div class="col-4 small">: {{ activePurchase?.created }}</div>
                      </div>
                      <div class="row my-1">
                        <div class="offset-4 col-4 text-start small">Payment Status</div>
                        <div class="col-4 small">: {{ activePurchase?.paymentStatus }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Order Summary -->
                  <h6 class="fw-bold mb-2">Order Summary</h6>
                  <div class="table-responsive">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th style="width: 40%">Product Name</th>
                          <th>Qty</th>
                          <th>Unit</th>
                          <th>Price (IDR)</th>
                          <th>Amount (IDR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(p, idx) in viewOrderItems" :key="idx">
                          <td>
                            <strong>{{ p.name }}</strong>
                          </td>
                          <td>{{ p.qty }}</td>
                          <td>{{ p.unit }}</td>
                          <td>{{ formatNumber(p.price) }}</td>
                          <td>{{ formatNumber(p.qty * p.price) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Notes & Summary -->
                  <div class="row mt-4">
                    <div class="col-md-6">
                      <p><strong>Notes :</strong></p>
                      <p>{{ activePurchase?.notes || "Pembelian Rutin Bulanan" }}</p>
                    </div>
                    <div class="col-md-6">
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>Sub Total</td>
                            <td class="text-end">{{ formatNumber(viewSubTotal) }}</td>
                          </tr>
                          <tr>
                            <td>Tax (Ppn 11%)</td>
                            <td class="text-end">{{ formatNumber(viewTax) }}</td>
                          </tr>
                          <tr class="table-active fw-bold">
                            <td>Total (IDR)</td>
                            <td class="text-end">{{ formatNumber(viewSubTotal + viewTax) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer modal-action-footer justify-content-end p-3 border-top">
            <button type="button" class="btn btn-dark modal-action-cancel" @click="showViewModal = false">Cancel</button>
            <button type="button" class="btn btn-warning modal-action-submit" @click="showViewModal = false">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Purchase Modal -->
    <div v-if="showEditModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog sales-details-modal modal-lg">
        <div class="modal-content" style="border-radius: 10px; overflow: hidden; position: relative">
          <div class="page-wrapper details-blk">
            <div class="content p-4">
              <!-- Header -->
              <div class="modal-header d-flex justify-content-between align-items-start border-0 pb-0">
                <div class="flex-grow-1">
                  <h4>Edit Purchase</h4>
                </div>
                <button type="button" class="btn-close ms-3 mt-1" @click="showEditModal = false"></button>
              </div>

              <!-- Body -->
              <div class="mt-4 mb-3 px-3">
                <div class="invoice-box" style="font-size: 14px; line-height: 22px; color: #555">
                  <!-- Top Info -->
                  <div class="row mb-4 d-flex justify-content-between">
                    <div class="col-md-6">
                      <h6 class="fw-bold mb-1">Customer / Supplier :</h6>
                      <p class="mb-0">
                        {{ editData.supplier }}<br />
                        ciptakreasi@gmail.com<br />
                        62819 0685 5554<br />
                        Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said,<br />
                        X5 No. 13, Jakarta Selatan, 12950
                      </p>
                    </div>
                    <div class="col-md-6">
                      <div class="row my-1">
                        <div class="offset-4 col-4 text-start fw-bold">Purchase Info</div>
                      </div>
                      <div class="row my-1 align-items-center">
                        <div class="offset-4 col-3 text-start small">No. Purchase</div>
                        <div class="col-5 small">
                          <input type="text" class="form-control form-control-sm" v-model="editData.noPurchase" />
                        </div>
                      </div>
                      <div class="row my-1 align-items-center">
                        <div class="offset-4 col-3 text-start small">Date</div>
                        <div class="col-5 small">
                          <input type="text" class="form-control form-control-sm" v-model="editData.date" />
                        </div>
                      </div>
                      <div class="row my-1 align-items-center">
                        <div class="offset-4 col-3 text-start small">Created</div>
                        <div class="col-5 small">
                          <input type="text" class="form-control form-control-sm" v-model="editData.created" />
                        </div>
                      </div>
                      <div class="row my-1 align-items-center">
                        <div class="offset-4 col-3 text-start small">Payment Status</div>
                        <div class="col-5 small">
                          <select class="form-select form-select-sm" v-model="editData.paymentStatus">
                            <option>Paid</option>
                            <option>Unpaid</option>
                            <option>Partial</option>
                            <option>Refunded</option>
                            <option>Pending</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Order Summary -->
                  <h6 class="fw-bold mb-2">Order Summary</h6>
                  <div class="table-responsive">
                    <table class="table table-bordered align-middle">
                      <thead>
                        <tr>
                          <th style="width: 40%">Product Name</th>
                          <th>Qty</th>
                          <th>Unit</th>
                          <th>Price (IDR)</th>
                          <th>Amount (IDR)</th>
                          <th style="width: 40px"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, idx) in editItems" :key="idx">
                          <td>
                            <input type="text" class="form-control form-control-sm" v-model="item.name" />
                          </td>
                          <td>
                            <div class="d-flex align-items-center gap-1">
                              <button
                                type="button"
                                class="btn btn-outline-secondary btn-sm px-2"
                                @click="item.qty > 1 ? item.qty-- : 1"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                class="form-control form-control-sm text-center"
                                style="width: 60px"
                                v-model.number="item.qty"
                              />
                              <button type="button" class="btn btn-outline-secondary btn-sm px-2" @click="item.qty++">+</button>
                            </div>
                          </td>
                          <td>
                            <select class="form-select form-select-sm" v-model="item.unit">
                              <option>Ream</option>
                              <option>Pcs</option>
                              <option>Box</option>
                              <option>Kg</option>
                            </select>
                          </td>
                          <td>
                            <input type="number" class="form-control form-control-sm text-end" v-model.number="item.price" />
                          </td>
                          <td class="text-end fw-bold">
                            {{ formatNumber(item.qty * item.price) }}
                          </td>
                          <td>
                            <button class="btn btn-sm text-danger p-1" type="button" @click="removeEditItem(idx)">
                              <i class="feather-trash-2"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="d-flex justify-content-start my-2">
                    <button type="button" class="btn btn-sm btn-outline-primary" @click="addEditItem">
                      <i class="feather-plus-circle me-1"></i> Add Product
                    </button>
                  </div>

                  <!-- Notes & Summary -->
                  <div class="row mt-4">
                    <div class="col-md-6">
                      <label class="form-label fw-bold">Notes :</label>
                      <textarea class="form-control" rows="3" v-model="editData.notes"></textarea>
                    </div>
                    <div class="col-md-6">
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>Sub Total</td>
                            <td class="text-end">{{ formatNumber(editSubTotal) }}</td>
                          </tr>
                          <tr>
                            <td>Shipping Costs</td>
                            <td class="text-end" style="width: 120px">
                              <input type="number" class="form-control form-control-sm text-end" v-model.number="editShipping" />
                            </td>
                          </tr>
                          <tr>
                            <td>Tax (Ppn 11%)</td>
                            <td class="text-end">{{ formatNumber(editTax) }}</td>
                          </tr>
                          <tr class="table-active fw-bold">
                            <td>Grand Total (IDR)</td>
                            <td class="text-end">{{ formatNumber(editGrandTotal) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end p-3 border-top">
                <button type="button" class="btn btn-dark modal-action-cancel" @click="showEditModal = false">Cancel</button>
                <button type="button" class="btn btn-warning modal-action-submit" @click="saveEditPurchase">Save Changes</button>
              </div>
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

// Sample Purchases Data
const purchases = ref([
  {
    id: 1,
    noPurchase: "PR-2512000001",
    date: "01/10/2025",
    created: "Sales Staff",
    supplier: "PT Kertas Jaya",
    product: "Kertas Art Paper 150gr, Tinta Offset Merah",
    status: "Ordered",
    amount: 1500000,
    paid: 750000,
    due: 750000,
    paymentStatus: "Partial",
    notes: "Pembelian rutin bulanan",
  },
  {
    id: 2,
    noPurchase: "PR-2512000002",
    date: "03/10/2025",
    created: "Sales Staff",
    supplier: "CV Kimia Prima",
    product: "Plastisol T-shirt Putih, Emulsion",
    status: "Received",
    amount: 2800000,
    paid: 2800000,
    due: 0,
    paymentStatus: "Paid",
    notes: "-",
  },
  {
    id: 3,
    noPurchase: "PR-2512000003",
    date: "05/10/2025",
    created: "Sales Staff",
    supplier: "Global Inkindo",
    product: "Tinta UV LED, Cleaner Roll",
    status: "Pending",
    amount: 850000,
    paid: 0,
    due: 850000,
    paymentStatus: "Unpaid",
    notes: "Menunggu konfirmasi stok",
  },
  {
    id: 4,
    noPurchase: "PR-2512000004",
    date: "07/10/2025",
    created: "Sales Staff",
    supplier: "UD Sukses Makmur",
    product: "NCR TP, NCR BM, Lem Fox 5kg",
    status: "Received",
    amount: 3100000,
    paid: 3100000,
    due: 0,
    paymentStatus: "Paid",
    notes: "Stok kantor Karawang",
  },
  {
    id: 5,
    noPurchase: "PR-2512000005",
    date: "10/10/2025",
    created: "Sales Staff",
    supplier: "PT Duta Grafika",
    product: "Plat CTP Thermal, Developer",
    status: "Ordered",
    amount: 4500000,
    paid: 2000000,
    due: 2500000,
    paymentStatus: "Partial",
    notes: "Pesanan plat cetak massal",
  },
  {
    id: 6,
    noPurchase: "PR-2512000006",
    date: "14/10/2025",
    created: "Sales Staff",
    supplier: "CV Warna Warni",
    product: "Tinta Offset Cyan, Magenta, Yellow",
    status: "Received",
    amount: 1900000,
    paid: 1900000,
    due: 0,
    paymentStatus: "Paid",
    notes: "-",
  },
]);

// Filter & Search
const searchQuery = ref("");
const statusFilter = ref("");
const paymentFilter = ref("");
const selectedDateRangeLabel = ref("");
const showDateDropdown = ref(false);

const setDateRange = (range: string) => {
  if (range === "kemarin") selectedDateRangeLabel.value = "Kemarin";
  else if (range === "7hari") selectedDateRangeLabel.value = "7 Hari Terakhir";
  else if (range === "bulanIni") selectedDateRangeLabel.value = "Bulan Ini";
  else if (range === "bulanLalu") selectedDateRangeLabel.value = "Bulan Lalu";
  else if (range === "tahunLalu") selectedDateRangeLabel.value = "Tahun Lalu";
  else selectedDateRangeLabel.value = "";
  showDateDropdown.value = false;
};

const filteredPurchases = computed(() => {
  return purchases.value.filter((p) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q ||
      p.noPurchase.toLowerCase().includes(q) ||
      p.supplier.toLowerCase().includes(q) ||
      p.product.toLowerCase().includes(q) ||
      p.created.toLowerCase().includes(q);

    const matchesStatus = !statusFilter.value || p.status.toLowerCase() === statusFilter.value.toLowerCase();
    const matchesPayment = !paymentFilter.value || p.paymentStatus.toLowerCase() === paymentFilter.value.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });
});

const totalAmount = computed(() => filteredPurchases.value.reduce((acc, curr) => acc + curr.amount, 0));
const totalPaid = computed(() => filteredPurchases.value.reduce((acc, curr) => acc + curr.paid, 0));
const totalDue = computed(() => filteredPurchases.value.reduce((acc, curr) => acc + curr.due, 0));

// View Modal
const showViewModal = ref(false);
const activePurchase = ref<any>(null);
const viewOrderItems = ref([
  { name: "Tinta Neotex 1Kg Cyan", qty: 2, unit: "Ream", price: 450000 },
  { name: "Kertas Art Paper 150gr", qty: 1, unit: "Ream", price: 600000 },
]);
const viewSubTotal = computed(() => viewOrderItems.value.reduce((acc, item) => acc + item.qty * item.price, 0));
const viewTax = computed(() => Math.round(viewSubTotal.value * 0.11));

const viewPurchase = (item: any) => {
  activePurchase.value = item;
  showViewModal.value = true;
};

// Edit Modal
const showEditModal = ref(false);
const editData = ref<any>({});
const editItems = ref<any[]>([]);
const editShipping = ref(125000);

const editSubTotal = computed(() => editItems.value.reduce((acc, item) => acc + (item.qty || 0) * (item.price || 0), 0));
const editTax = computed(() => Math.round((editSubTotal.value + editShipping.value) * 0.11));
const editGrandTotal = computed(() => editSubTotal.value + editShipping.value + editTax.value);

const editPurchase = (item: any) => {
  activePurchase.value = item;
  editData.value = { ...item };
  editItems.value = [{ name: "Brosur PPDB SMAN 1 Bandung", qty: 2, unit: "Ream", price: 450000 }];
  showEditModal.value = true;
};

const openEditFromView = () => {
  showViewModal.value = false;
  if (activePurchase.value) editPurchase(activePurchase.value);
};

const addEditItem = () => {
  editItems.value.push({ name: "", qty: 1, unit: "Pcs", price: 0 });
};

const removeEditItem = (idx: number) => {
  editItems.value.splice(idx, 1);
};

const saveEditPurchase = () => {
  if (!editData.value.id) return;
  const idx = purchases.value.findIndex((p) => p.id === editData.value.id);
  if (idx !== -1) {
    purchases.value[idx] = {
      ...purchases.value[idx],
      noPurchase: editData.value.noPurchase,
      date: editData.value.date,
      created: editData.value.created,
      paymentStatus: editData.value.paymentStatus,
      notes: editData.value.notes,
      amount: editGrandTotal.value,
    };
  }
  showEditModal.value = false;
};

const deletePurchase = (item: any) => {
  if (confirm(`Are you sure you want to delete purchase ${item.noPurchase}?`)) {
    purchases.value = purchases.value.filter((p) => p.id !== item.id);
  }
};

const printModal = () => {
  window.print();
};

const printList = () => {
  window.print();
};

const exportPdf = () => {
  window.print();
};

const toggleHeader = () => {
  // collapse header utility
};
</script>
