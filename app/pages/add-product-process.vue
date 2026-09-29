<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Product Process List</h4>
            <h6>Map specific manufacturing operations to catalog products</h6>
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
        </ul>
        <div class="page-btn">
          <button type="button" class="btn btn-primary" @click="openAddModal">
            <i class="ti ti-circle-plus me-1"></i>Add New Product Process
          </button>
        </div>
      </div>

      <!-- KPI Widgets -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
              <i class="ti ti-box fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Total Product</div>
              <h4 class="mb-0 fw-bold">307,144</h4>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card p-3 border-0 shadow-sm d-flex flex-row align-items-center gap-3">
            <div class="p-3 bg-success bg-opacity-10 text-success rounded-3">
              <i class="ti ti-git-branch fs-3"></i>
            </div>
            <div>
              <div class="text-muted small">Total Product Process</div>
              <h4 class="mb-0 fw-bold">4,385</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Table List Card -->
      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
            <div class="search-set d-flex align-items-center gap-2 flex-wrap">
              <div class="search-input">
                <span class="btn-searchset"><i class="ti ti-search"></i></span>
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search process code or product..." />
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <select v-model="filterProcess" class="form-select form-select-sm" style="width: auto">
                <option value="">All Process Names</option>
                <option value="Printing">Printing</option>
                <option value="Cutting">Cutting</option>
                <option value="Laminating">Laminating</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead class="thead-light">
                <tr>
                  <th># Process</th>
                  <th>Product</th>
                  <th>Name of Process</th>
                  <th>Create Date</th>
                  <th class="text-center" style="width: 100px">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredList" :key="item.id">
                  <td class="fw-bold text-primary">{{ item.code }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <img :src="item.image" alt="product" class="rounded" style="width: 36px; height: 36px; object-fit: cover" />
                      <span class="fw-bold text-dark">{{ item.product }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ item.processName }}</span>
                  </td>
                  <td class="small text-muted">{{ item.createDate }}</td>
                  <td class="text-center action-table-data">
                    <div class="edit-delete-action d-inline-flex gap-2">
                      <button class="btn btn-sm btn-icon text-primary" title="Edit" @click="openEditModal(item)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-icon text-danger" title="Delete" @click="deleteItem(item.id)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredList.length === 0">
                  <td colspan="5" class="text-center py-4 text-muted">No product processes found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="modalVisible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title font-bold">{{ isEditing ? "Edit Product Process" : "Add New Product Process" }}</h5>
            <button type="button" class="btn-close" @click="modalVisible = false"></button>
          </div>
          <form @submit.prevent="saveItem">
            <div class="modal-body pt-0">
              <div class="mb-3">
                <label class="form-label">Product Name <span class="text-danger">*</span></label>
                <input v-model="formData.product" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Name of Process <span class="text-danger">*</span></label>
                <select v-model="formData.processName" class="form-select" required>
                  <option value="Printing">Printing</option>
                  <option value="Cutting">Cutting</option>
                  <option value="Laminating">Laminating</option>
                  <option value="Die-Cut">Die-Cut</option>
                  <option value="Packaging">Packaging</option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-0 justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="modalVisible = false">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ isEditing ? "Update Process" : "Save Process" }}</button>
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
  title: "Product Process List - Kacetak System",
});

interface ProductProcess {
  id: number;
  code: string;
  product: string;
  image: string;
  processName: string;
  createDate: string;
}

const processes = ref<ProductProcess[]>([
  {
    id: 1,
    code: "PROPC-01",
    product: "Lenovo 3rd Generation",
    image: "/assets/img/products/stock-img-01.png",
    processName: "Printing",
    createDate: "2025-09-01",
  },
  {
    id: 2,
    code: "PROPC-02",
    product: "Bold V3.2",
    image: "/assets/img/products/stock-img-06.png",
    processName: "Cutting",
    createDate: "2025-09-02",
  },
  {
    id: 3,
    code: "PROPC-03",
    product: "Nike Jordan Packaging",
    image: "/assets/img/products/stock-img-02.png",
    processName: "Laminating",
    createDate: "2025-09-03",
  },
]);

const searchQuery = ref("");
const filterProcess = ref("");

const filteredList = computed(() => {
  return processes.value.filter((p) => {
    const matchSearch =
      p.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.product.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchProc = filterProcess.value ? p.processName === filterProcess.value : true;
    return matchSearch && matchProc;
  });
});

const modalVisible = ref(false);
const isEditing = ref(false);
const formData = reactive({
  id: 0,
  product: "",
  processName: "Printing",
});

function openAddModal() {
  isEditing.value = false;
  formData.id = 0;
  formData.product = "";
  formData.processName = "Printing";
  modalVisible.value = true;
}

function openEditModal(item: ProductProcess) {
  isEditing.value = true;
  formData.id = item.id;
  formData.product = item.product;
  formData.processName = item.processName;
  modalVisible.value = true;
}

function saveItem() {
  if (isEditing.value) {
    const idx = processes.value.findIndex((p) => p.id === formData.id);
    if (idx !== -1) {
      processes.value[idx].product = formData.product;
      processes.value[idx].processName = formData.processName;
    }
  } else {
    processes.value.push({
      id: Date.now(),
      code: "PROPC-0" + (processes.value.length + 1),
      product: formData.product,
      image: "/assets/img/products/stock-img-01.png",
      processName: formData.processName,
      createDate: new Date().toISOString().split("T")[0],
    });
  }
  modalVisible.value = false;
}

function deleteItem(id: number) {
  if (confirm("Delete this product process assignment?")) {
    processes.value = processes.value.filter((p) => p.id !== id);
  }
}

function exportPdf() {
  alert("Exporting PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
  filterProcess.value = "";
}
</script>
