<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header mb-4">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Add Sales</h4>
            <h6>Create new sales order with custom items & billing calculation</h6>
          </div>
        </div>
        <div class="page-btn">
          <NuxtLink to="/sales" class="btn btn-secondary"> <i class="ti ti-arrow-left me-1"></i>Back to Sales List </NuxtLink>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
          <!-- Customer & Shipping Header Section -->
          <div class="pb-4 border-bottom mb-4">
            <div class="row g-4">
              <!-- Customer Selection -->
              <div class="col-lg-6">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <label class="form-label fw-bold text-dark mb-0">Customer:</label>
                  <button
                    type="button"
                    class="btn btn-link text-primary p-0 small text-decoration-none"
                    @click="openCustomerModal"
                  >
                    <i class="ti ti-circle-plus me-1"></i>Add New
                  </button>
                </div>
                <div class="mb-3 position-relative">
                  <input
                    v-model="customerSearch"
                    type="text"
                    class="form-control"
                    placeholder="Search Customer by name or phone..."
                    @input="searchCustomer"
                  />
                  <div
                    v-if="filteredCustomers.length > 0 && customerSearch && !selectedCustomer"
                    class="dropdown-menu show w-100 shadow-sm mt-1"
                  >
                    <button
                      v-for="c in filteredCustomers"
                      :key="c.id"
                      type="button"
                      class="dropdown-item py-2"
                      @click="selectCustomer(c)"
                    >
                      <div class="fw-bold">{{ c.name }}</div>
                      <div class="small text-muted">{{ c.phone }} • {{ c.email }}</div>
                    </button>
                  </div>
                </div>

                <!-- Selected Customer Card -->
                <div v-if="selectedCustomer" class="p-3 bg-light rounded-3 border">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="fw-bold text-dark mb-1">{{ selectedCustomer.name }}</h6>
                      <div class="text-muted small"><i class="ti ti-mail me-1"></i>{{ selectedCustomer.email }}</div>
                      <div class="text-muted small"><i class="ti ti-phone me-1"></i>{{ selectedCustomer.phone }}</div>
                      <div class="text-muted small mt-1"><i class="ti ti-map-pin me-1"></i>{{ selectedCustomer.address }}</div>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="selectedCustomer = null">Change</button>
                  </div>
                </div>
              </div>

              <!-- Shipping Method -->
              <div class="col-lg-6">
                <div class="d-flex align-items-center mb-3">
                  <label class="form-label fw-bold text-dark mb-0 me-3">Shipping Method:</label>
                  <div class="form-check form-check-inline">
                    <input id="shipCourier" v-model="shippingMethod" type="radio" value="Shipping" class="form-check-input" />
                    <label for="shipCourier" class="form-check-label">Shipping / Delivery</label>
                  </div>
                  <div class="form-check form-check-inline ms-3">
                    <input id="shipPickup" v-model="shippingMethod" type="radio" value="Pickup" class="form-check-input" />
                    <label for="shipPickup" class="form-check-label">Self Pickup</label>
                  </div>
                </div>

                <div v-if="shippingMethod === 'Shipping'" class="p-3 bg-light rounded-3 border">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold text-dark">Ahmad Dhani <span class="badge bg-primary ms-1">Office</span></span>
                    <button type="button" class="btn btn-sm btn-outline-primary" @click="changeShippingAddress">
                      Ubah Alamat
                    </button>
                  </div>
                  <div class="text-muted small">
                    Toko Kelontong Depan Desa Teluk Jambe, 515 Sarah Shore Suite 828, Port Kennethstad (Depan Stasiun)<br />
                    KAB. KARAWANG - TELUK JAMBE TIMUR, JAWA BARAT, ID 41360
                  </div>
                </div>

                <div v-else class="p-3 bg-light rounded-3 border">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold text-dark">Dulank Workshop Branch #1</span>
                    <button type="button" class="btn btn-sm btn-outline-primary" @click="changePickupStore">Pilih Outlet</button>
                  </div>
                  <div class="text-muted small">
                    Kacetak Central Hub, Jl. Asia Afrika No. 45, Bandung, Jawa Barat (081906855554)
                  </div>
                </div>
              </div>
            </div>

            <!-- PO Number -->
            <div class="row mt-3">
              <div class="col-md-4 d-flex align-items-center gap-3">
                <label class="fw-bold text-dark mb-0 text-nowrap">PO / Invoice No:</label>
                <input v-model="poNumber" type="text" class="form-control form-control-sm" placeholder="Invoice No" />
              </div>
            </div>
          </div>

          <!-- Product Items Table -->
          <div class="mb-4">
            <h5 class="fw-bold text-dark mb-3">Order Items</h5>
            <div class="d-flex flex-column gap-3">
              <div
                v-for="(item, index) in items"
                :key="item.id"
                class="p-3 rounded-3 border position-relative"
                style="background-color: rgba(254, 159, 67, 0.05)"
              >
                <button
                  v-if="items.length > 1"
                  type="button"
                  class="btn btn-sm btn-icon text-danger position-absolute top-0 end-0 m-2"
                  title="Remove Item"
                  @click="removeItem(index)"
                >
                  <i class="ti ti-trash"></i>
                </button>

                <div class="row g-3 align-items-start">
                  <div class="col-md-4">
                    <label class="form-label small fw-semibold">Product Name</label>
                    <input
                      v-model="item.name"
                      type="text"
                      class="form-control form-control-sm mb-2"
                      placeholder="Item name or custom print title..."
                    />
                    <label class="form-label small text-muted mb-1">Description:</label>
                    <textarea
                      v-model="item.description"
                      class="form-control form-control-sm"
                      rows="2"
                      placeholder="Specifications, specs paper, finishing details..."
                    ></textarea>
                  </div>

                  <div class="col-md-2">
                    <label class="form-label small fw-semibold">Qty</label>
                    <div class="input-group input-group-sm">
                      <button class="btn btn-outline-secondary" type="button" @click="updateQty(item, -1)">-</button>
                      <input v-model.number="item.qty" type="number" min="1" class="form-control text-center" />
                      <button class="btn btn-outline-secondary" type="button" @click="updateQty(item, 1)">+</button>
                    </div>
                  </div>

                  <div class="col-md-2">
                    <label class="form-label small fw-semibold">Unit</label>
                    <select v-model="item.unit" class="form-select form-select-sm">
                      <option value="Ream">Ream</option>
                      <option value="Pcs">Pcs</option>
                      <option value="Box">Box</option>
                      <option value="Set">Set</option>
                      <option value="Lembar">Lembar</option>
                      <option value="Pack">Pack</option>
                    </select>
                  </div>

                  <div class="col-md-2">
                    <label class="form-label small fw-semibold">Price (IDR)</label>
                    <input v-model.number="item.price" type="number" min="0" class="form-control form-control-sm text-end" />
                  </div>

                  <div class="col-md-2">
                    <label class="form-label small fw-semibold">Amount (IDR)</label>
                    <input
                      :value="formatNumber(item.qty * item.price)"
                      type="text"
                      class="form-control form-control-sm text-end fw-bold bg-light"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <button type="button" class="btn btn-outline-primary btn-sm mt-3" @click="addNewItem">
              <i class="ti ti-circle-plus me-1"></i>Add New Blank Product
            </button>
          </div>

          <!-- Voucher & Totals Section -->
          <div class="row g-4 pt-3 border-top">
            <div class="col-lg-7">
              <!-- Voucher -->
              <div class="row align-items-center mb-3">
                <div class="col-md-4">
                  <label class="form-label fw-semibold mb-0">Voucher</label>
                </div>
                <div class="col-md-8">
                  <div class="input-group input-group-sm">
                    <input v-model="voucherCode" type="text" class="form-control" placeholder="Enter coupon code" />
                    <button class="btn btn-warning text-white fw-semibold" type="button" @click="applyVoucher">Apply</button>
                  </div>
                  <div v-if="voucherApplied" class="alert alert-success py-1 px-2 small mt-2 mb-0">
                    Voucher <strong>{{ voucherCode }}</strong> berhasil diterapkan (-Rp {{ formatNumber(voucherDiscount) }})
                  </div>
                </div>
              </div>

              <!-- Shipping Costs -->
              <div class="row align-items-center mb-3">
                <div class="col-md-4">
                  <label class="form-label fw-semibold mb-0">Shipping Costs (Rp)</label>
                </div>
                <div class="col-md-8">
                  <input v-model.number="shippingCost" type="number" min="0" class="form-control form-control-sm" />
                </div>
              </div>

              <!-- Discount -->
              <div class="row align-items-center mb-3">
                <div class="col-md-4">
                  <label class="form-label fw-semibold mb-0">Direct Discount (Rp)</label>
                </div>
                <div class="col-md-8">
                  <input v-model.number="directDiscount" type="number" min="0" class="form-control form-control-sm" />
                </div>
              </div>

              <!-- Tax & Transaction Code -->
              <div class="border rounded-3 p-3 mb-3 bg-light">
                <div class="row align-items-center mb-3">
                  <div class="col-md-4">
                    <label class="form-label fw-semibold mb-0">Tax</label>
                  </div>
                  <div class="col-md-8">
                    <select v-model="taxRate" class="form-select form-select-sm">
                      <option :value="0">Without Tax (Default)</option>
                      <option :value="0.11">PPN 11%</option>
                      <option :value="0.12">PPN 12%</option>
                    </select>
                  </div>
                </div>

                <div v-if="taxRate > 0" class="row align-items-center">
                  <div class="col-md-4">
                    <label class="form-label fw-semibold mb-0">Transaction Code</label>
                  </div>
                  <div class="col-md-8">
                    <select v-model="transactionCode" class="form-select form-select-sm">
                      <option value="01">01 - To Other party VAT Collector</option>
                      <option value="02">02 - To Government Institution as VAT Collector</option>
                      <option value="03">03 - To VAT Collector other than Government Institution</option>
                      <option value="04">04 - Other Tax Base</option>
                      <option value="05">05 - Certain Value Tax Base</option>
                      <option value="07">07 - VAT Uncollected</option>
                      <option value="08">08 - VAT Exempted</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div class="row align-items-center">
                <div class="col-md-4">
                  <label class="form-label fw-semibold mb-0">Notes</label>
                </div>
                <div class="col-md-8">
                  <input
                    v-model="orderNotes"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Order memo or instructions..."
                  />
                </div>
              </div>
            </div>

            <!-- Summary Calculations -->
            <div class="col-lg-5">
              <div class="card bg-light border-0 p-3 rounded-3">
                <h6 class="fw-bold mb-3 border-bottom pb-2">Order Calculation Summary</h6>
                <div class="d-flex justify-content-between mb-2 small text-muted">
                  <span>Sub Total</span>
                  <span class="fw-semibold text-dark">Rp {{ formatNumber(subTotal) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2 small text-muted">
                  <span>Voucher Discount</span>
                  <span class="text-danger">-Rp {{ formatNumber(voucherDiscount) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2 small text-muted">
                  <span>Shipping Cost</span>
                  <span class="text-dark">Rp {{ formatNumber(shippingCost) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2 small text-muted">
                  <span>Direct Discount</span>
                  <span class="text-danger">-Rp {{ formatNumber(directDiscount) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2 small text-muted border-top pt-2">
                  <span>Total Before Tax</span>
                  <span class="fw-semibold text-dark">Rp {{ formatNumber(totalBeforeTax) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2 small text-muted">
                  <span>Tax ({{ (taxRate * 100).toFixed(0) }}%)</span>
                  <span class="text-dark">Rp {{ formatNumber(taxAmount) }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
                  <span class="fw-bold fs-6">Grand Total</span>
                  <span class="fw-bold fs-5 text-primary">Rp {{ formatNumber(grandTotal) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer bg-white border-0 py-3 d-flex justify-content-end gap-2">
          <NuxtLink to="/sales" class="btn btn-secondary">Cancel</NuxtLink>
          <button type="button" class="btn btn-warning" @click="saveSales">Save Sales Order</button>
        </div>
      </div>
    </div>

    <!-- Add Customer Modal -->
    <div v-if="customerModalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">Add Customer</h5>
            <button type="button" class="btn-close" @click="customerModalVisible = false"></button>
          </div>
          <form @submit.prevent="saveCustomer">
            <div class="modal-body pt-0">
              <div class="mb-3">
                <label class="form-label">Customer Name <span class="text-danger">*</span></label>
                <input v-model="newCustomer.name" type="text" class="form-control" required />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="newCustomer.email" type="email" class="form-control" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Phone <span class="text-danger">*</span></label>
                  <input v-model="newCustomer.phone" type="text" class="form-control" required />
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Address</label>
                <textarea v-model="newCustomer.address" class="form-control" rows="2"></textarea>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="customerModalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Customer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useHead({
  title: "Add Sales - Kacetak System",
});

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "PT Makmur Abadi",
    email: "makmur@abadi.com",
    phone: "081234567890",
    address: "Jl. Riau No. 12, Bandung, Jawa Barat",
  },
  {
    id: 2,
    name: "Toko Digital Jaya",
    email: "digital@jaya.com",
    phone: "085678901234",
    address: "Jl. Sudirman No. 88, Jakarta Selatan",
  },
  {
    id: 3,
    name: "Klinik Sehat",
    email: "admin@kliniksehat.co.id",
    phone: "089876543210",
    address: "Jl. Ahmad Yani No. 102, Surabaya",
  },
];

const customerSearch = ref("");
const selectedCustomer = ref<Customer | null>(mockCustomers[0]);
const filteredCustomers = ref<Customer[]>([]);

function searchCustomer() {
  const q = customerSearch.value.toLowerCase();
  if (!q) {
    filteredCustomers.value = [];
    return;
  }
  filteredCustomers.value = mockCustomers.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
}

function selectCustomer(c: Customer) {
  selectedCustomer.value = c;
  customerSearch.value = c.name;
  filteredCustomers.value = [];
}

// Shipping method
const shippingMethod = ref("Shipping");
const poNumber = ref("2507000021");

function changeShippingAddress() {
  alert("Change address modal or picker");
}

function changePickupStore() {
  alert("Change pickup outlet branch");
}

// Items
interface OrderItem {
  id: number;
  name: string;
  description: string;
  qty: number;
  unit: string;
  price: number;
}

const items = ref<OrderItem[]>([
  {
    id: 1,
    name: "Brosur PPDB SMAN 1 Bandung",
    description: "Brosur Full Color A4 (210x297 mm), Art paper 150gr, Tanpa Laminasi, 1 Lipatan",
    qty: 2,
    unit: "Ream",
    price: 450000,
  },
]);

function updateQty(item: OrderItem, delta: number) {
  if (item.qty + delta >= 1) {
    item.qty += delta;
  }
}

function addNewItem() {
  items.value.push({
    id: Date.now(),
    name: "",
    description: "",
    qty: 1,
    unit: "Pcs",
    price: 0,
  });
}

function removeItem(index: number) {
  items.value.splice(index, 1);
}

// Financials
const voucherCode = ref("DUILANK12");
const voucherApplied = ref(false);
const voucherDiscount = ref(0);
const shippingCost = ref(125000);
const directDiscount = ref(0);
const taxRate = ref(0);
const transactionCode = ref("01");
const orderNotes = ref("");

function applyVoucher() {
  if (voucherCode.value.toUpperCase() === "DUILANK12") {
    voucherApplied.value = true;
    voucherDiscount.value = 50000;
  } else {
    alert("Invalid voucher code");
  }
}

const subTotal = computed(() => {
  return items.value.reduce((acc, curr) => acc + curr.qty * curr.price, 0);
});

const totalBeforeTax = computed(() => {
  const total = subTotal.value - voucherDiscount.value + shippingCost.value - directDiscount.value;
  return Math.max(0, total);
});

const taxAmount = computed(() => {
  return Math.round(totalBeforeTax.value * taxRate.value);
});

const grandTotal = computed(() => {
  return totalBeforeTax.value + taxAmount.value;
});

function formatNumber(val: number): string {
  return new Intl.NumberFormat("id-ID").format(val);
}

function saveSales() {
  alert("Sales order successfully created!");
  navigateTo("/sales");
}

// Customer Modal
const customerModalVisible = ref(false);
const newCustomer = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
});

function openCustomerModal() {
  newCustomer.name = "";
  newCustomer.email = "";
  newCustomer.phone = "";
  newCustomer.address = "";
  customerModalVisible.value = true;
}

function saveCustomer() {
  const created: Customer = {
    id: Date.now(),
    ...newCustomer,
  };
  selectedCustomer.value = created;
  customerSearch.value = created.name;
  customerModalVisible.value = false;
}
</script>
