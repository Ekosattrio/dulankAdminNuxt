<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Purchase Item</h4>
          <h6>Manage your purchase catalog items</h6>
        </div>
      </div>
      <ul class="table-top-head">
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
      <div class="page-btn">
        <a href="#" class="btn btn-added" @click.prevent="openAddModal">
          <i class="feather-plus-circle me-2"></i>Add Purchase Item
        </a>
      </div>
    </div>

    <!-- Purchase Items Card -->
    <div class="card table-list-card">
      <div class="card-body">
        <!-- Filter -->
        <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="search-set d-block d-md-flex align-items-center gap-2">
            <div class="search-input">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search purchase item..."
                class="form-control form-control-sm"
              />
            </div>
            <div class="category-filter">
              <select class="form-select form-select-sm" v-model="categoryFilter">
                <option value="">All Categories</option>
                <option>Kertas & Bahan Baku Cetak</option>
                <option>Tinta & Toner</option>
                <option>Bahan Finishing & Jilid</option>
                <option>Sparepart Mesin</option>
              </select>
            </div>
          </div>
        </div>
        <!-- /Filter -->

        <div class="table-responsive">
          <table class="table datanew">
            <thead>
              <tr>
                <th>Category</th>
                <th>Product</th>
                <th>Description</th>
                <th>Merk</th>
                <th class="text-end">Price (IDR)</th>
                <th>Unit</th>
                <th>Created</th>
                <th class="no-sort">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id">
                <td>{{ item.category }}</td>
                <td class="fw-bold">{{ item.product }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.merk }}</td>
                <td class="text-end fw-semibold">{{ formatNumber(item.price) }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ item.created }}</td>
                <td class="action-table-data">
                  <div class="edit-delete-action d-flex align-items-center gap-1">
                    <a class="p-2 text-primary cursor-pointer" @click.prevent="viewItem(item)" title="View">
                      <i class="feather-eye"></i>
                    </a>
                    <a class="p-2 text-info cursor-pointer" @click.prevent="openEditModal(item)" title="Edit">
                      <i class="feather-edit"></i>
                    </a>
                    <a class="p-2 text-danger cursor-pointer" @click.prevent="deleteItem(item)" title="Delete">
                      <i class="feather-trash-2"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredItems.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">No purchase items found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- View Item Modal -->
    <div v-if="showViewModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">Purchase Item Detail</h4>
            <button type="button" class="btn-close" @click="showViewModal = false"></button>
          </div>
          <div class="modal-body p-4" v-if="selectedItem">
            <div class="mb-2"><strong>Category:</strong> {{ selectedItem.category }}</div>
            <div class="mb-2"><strong>Product Name:</strong> {{ selectedItem.product }}</div>
            <div class="mb-2"><strong>Merk:</strong> {{ selectedItem.merk }}</div>
            <div class="mb-2"><strong>Price:</strong> Rp {{ formatNumber(selectedItem.price) }} / {{ selectedItem.unit }}</div>
            <div class="mb-2"><strong>Description:</strong> {{ selectedItem.description }}</div>
            <div class="mb-2"><strong>Created:</strong> {{ selectedItem.created }}</div>
            <div class="modal-footer p-0 pt-3 border-top justify-content-end mt-4">
              <button type="button" class="btn btn-secondary" @click="showViewModal = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Purchase Item Modal -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h4 class="modal-title">{{ isEdit ? "Edit Purchase Item" : "Add Purchase Item" }}</h4>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="saveItem">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Category</label>
                  <select class="form-select" v-model="formData.category" required>
                    <option>Kertas & Bahan Baku Cetak</option>
                    <option>Tinta & Toner</option>
                    <option>Bahan Finishing & Jilid</option>
                    <option>Sparepart Mesin</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Product Name</label>
                  <input type="text" class="form-control" v-model="formData.product" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Merk</label>
                  <input type="text" class="form-control" v-model="formData.merk" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Unit</label>
                  <select class="form-select" v-model="formData.unit">
                    <option>Lembar</option>
                    <option>Botol</option>
                    <option>Pcs</option>
                    <option>Roll</option>
                    <option>Ream</option>
                    <option>Kg</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Price (IDR)</label>
                  <input type="number" class="form-control" v-model.number="formData.price" required />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">Description</label>
                  <textarea class="form-control" rows="3" v-model="formData.description"></textarea>
                </div>
              </div>
              <div class="modal-footer modal-action-footer justify-content-end p-0 pt-3 border-top gap-2 mt-4">
                <button type="button" class="btn btn-dark" @click="showModal = false">Cancel</button>
                <button type="submit" class="btn btn-warning text-white fw-bold">Submit</button>
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
import { formatNumber } from "~/composables/useFormatters";

const items = ref([
  {
    id: 1,
    category: "Kertas & Bahan Baku Cetak",
    product: "Art Paper 150gr",
    description: "Kertas brosur glossy A3+",
    merk: "Paperline",
    price: 1250,
    unit: "Lembar",
    created: "Admin, 02/01/2026, 09:15",
  },
  {
    id: 2,
    category: "Tinta & Toner",
    product: "Tinta Cyan Eco-Solvent",
    description: "Tinta printer outdoor 1L",
    merk: "Roland",
    price: 450000,
    unit: "Botol",
    created: "Admin, 02/01/2026, 10:00",
  },
  {
    id: 3,
    category: "Tinta & Toner",
    product: "Tinta Magenta Eco-Solvent",
    description: "Tinta printer outdoor 1L",
    merk: "Roland",
    price: 450000,
    unit: "Botol",
    created: "Admin, 02/01/2026, 10:05",
  },
  {
    id: 4,
    category: "Tinta & Toner",
    product: "Tinta Yellow Eco-Solvent",
    description: "Tinta printer outdoor 1L",
    merk: "Roland",
    price: 450000,
    unit: "Botol",
    created: "Admin, 02/01/2026, 10:10",
  },
  {
    id: 5,
    category: "Bahan Finishing & Jilid",
    product: "Plastik Laminasi Glossy",
    description: "Ketebalan 32 micron roll 1000m",
    merk: "D&K",
    price: 380000,
    unit: "Roll",
    created: "Admin, 02/01/2026, 10:20",
  },
]);

const searchQuery = ref("");
const categoryFilter = ref("");

const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q ||
      item.product.toLowerCase().includes(q) ||
      item.merk.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);

    const matchesCategory = !categoryFilter.value || item.category === categoryFilter.value;
    return matchesSearch && matchesCategory;
  });
});

const showModal = ref(false);
const isEdit = ref(false);
const formData = ref<any>({});

const showViewModal = ref(false);
const selectedItem = ref<any>(null);

const openAddModal = () => {
  isEdit.value = false;
  formData.value = {
    category: "Kertas & Bahan Baku Cetak",
    product: "",
    merk: "",
    unit: "Pcs",
    price: 0,
    description: "",
  };
  showModal.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  formData.value = { ...item };
  showModal.value = true;
};

const viewItem = (item: any) => {
  selectedItem.value = item;
  showViewModal.value = true;
};

const saveItem = () => {
  if (isEdit.value) {
    const idx = items.value.findIndex((i) => i.id === formData.value.id);
    if (idx !== -1) {
      items.value[idx] = { ...formData.value };
    }
  } else {
    items.value.unshift({
      id: Date.now(),
      ...formData.value,
      created: `Admin, ${new Date().toLocaleDateString("id-ID")}`,
    });
  }
  showModal.value = false;
};

const deleteItem = (item: any) => {
  if (confirm(`Are you sure you want to delete ${item.product}?`)) {
    items.value = items.value.filter((i) => i.id !== item.id);
  }
};

const printList = () => {
  window.print();
};

const refreshList = () => {
  searchQuery.value = "";
  categoryFilter.value = "";
};

const toggleHeader = () => {
  // toggle header
};
</script>
