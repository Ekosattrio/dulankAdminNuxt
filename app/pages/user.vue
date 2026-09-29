<template>
  <div class="page-wrapper">
    <div class="content container-fluid">
      <div class="page-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>User List</h4>
            <h6>Manage Your Users</h6>
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
          <button class="btn btn-added" @click="openAddModal"><i class="ti ti-plus me-1"></i> Add New User</button>
        </div>
      </div>

      <div class="card table-list-card">
        <div class="card-body">
          <div class="table-top d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div class="search-set d-block d-md-flex align-items-center gap-2">
              <div class="search-input position-relative">
                <input v-model="searchQuery" type="text" class="form-control" placeholder="Search Customer or Email..." />
              </div>
            </div>
            <div class="filters d-flex justify-content-end gap-2">
              <select v-model="selectedRole" class="form-select form-select-sm" style="min-width: 120px">
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
              </select>
              <select v-model="selectedStatus" class="form-select form-select-sm" style="min-width: 140px">
                <option value="">All Statuses</option>
                <option value="Active Member">Active Member</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table datanew">
              <thead>
                <tr>
                  <th>Customer Id</th>
                  <th>Email</th>
                  <th>Customer Name</th>
                  <th>Verified Email</th>
                  <th>Subscription</th>
                  <th>Status</th>
                  <th class="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, idx) in filteredUsers" :key="idx">
                  <td class="fw-semibold text-primary">{{ user.id }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.name }}</td>
                  <td>
                    <span :class="user.verified ? 'badge bg-outline-success' : 'badge bg-outline-danger'">
                      {{ user.verified ? "Active" : "No" }}
                    </span>
                  </td>
                  <td>
                    <span :class="user.subscription ? 'badge bg-outline-success' : 'badge bg-outline-danger'">
                      {{ user.subscription ? "Yes" : "No" }}
                    </span>
                  </td>
                  <td>
                    <select v-model="user.status" class="form-select form-select-sm" style="width: 140px">
                      <option value="Active Member">Active Member</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </td>
                  <td class="text-end">
                    <div class="d-inline-flex gap-2">
                      <button class="btn btn-sm btn-outline-primary p-1" title="Edit" @click="openEditModal(user)">
                        <i class="ti ti-edit"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger p-1" title="Delete" @click="deleteUser(idx)">
                        <i class="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="7" class="text-center py-4 text-muted">No users found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add/Edit User Modal -->
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>{{ isEditing ? "Edit User" : "Add User" }}</h4>
              </div>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="saveUser">
                <div class="row g-3">
                  <div class="col-lg-12">
                    <div class="new-employee-field">
                      <span class="fw-semibold d-block mb-1">Avatar</span>
                      <div class="profile-pic-upload mb-2 d-flex align-items-center gap-3">
                        <div class="profile-pic border rounded-circle overflow-hidden" style="width: 60px; height: 60px">
                          <img
                            :src="currentUser.avatar || '/assets/img/users/user-01.jpg'"
                            alt="User"
                            style="width: 100%; height: 100%; object-fit: cover"
                          />
                        </div>
                        <div>
                          <label class="btn btn-sm btn-outline-secondary mb-0">
                            Change Image
                            <input type="file" class="d-none" accept="image/*" @change="onAvatarChange" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">User Name</label>
                    <input v-model="currentUser.name" type="text" class="form-control" required />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Phone</label>
                    <input v-model="currentUser.phone" type="text" class="form-control" />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Email</label>
                    <input v-model="currentUser.email" type="email" class="form-control" required />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Role</label>
                    <select v-model="currentUser.role" class="form-select">
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Password</label>
                    <input v-model="currentUser.password" type="password" class="form-control" :required="!isEditing" />
                  </div>
                  <div class="col-lg-6">
                    <label class="form-label">Confirm Password</label>
                    <input v-model="currentUser.confirmPassword" type="password" class="form-control" :required="!isEditing" />
                  </div>
                  <div class="col-lg-12">
                    <label class="form-label">Descriptions</label>
                    <textarea
                      v-model="currentUser.descriptions"
                      class="form-control"
                      rows="3"
                      placeholder="Type message..."
                    ></textarea>
                  </div>
                </div>
                <div class="modal-footer modal-action-footer justify-content-end mt-4 pt-3 border-top">
                  <button type="button" class="btn btn-light" @click="showModal = false">Cancel</button>
                  <button type="submit" class="btn btn-warning text-white">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

useHead({
  title: "User List - Kacetak System",
});

const searchQuery = ref("");
const selectedRole = ref("");
const selectedStatus = ref("");
const showModal = ref(false);
const isEditing = ref(false);

interface UserItem {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  subscription: boolean;
  status: string;
  role?: string;
  phone?: string;
  avatar?: string;
  password?: string;
  confirmPassword?: string;
  descriptions?: string;
}

const users = ref<UserItem[]>([
  {
    id: "ID000001",
    email: "budi.santoso@email.com",
    name: "Budi Santoso",
    verified: true,
    subscription: true,
    status: "Active Member",
    role: "Admin",
  },
  {
    id: "ID000002",
    email: "info@majujaya.co.id",
    name: "PT Maju Jaya",
    verified: true,
    subscription: true,
    status: "Active Member",
    role: "Manager",
  },
  {
    id: "ID000003",
    email: "siti.aminah@email.com",
    name: "Siti Aminah",
    verified: true,
    subscription: false,
    status: "Active Member",
    role: "Sales",
  },
  {
    id: "ID000004",
    email: "toko.berkah@email.com",
    name: "Toko Berkah",
    verified: false,
    subscription: false,
    status: "Suspended",
    role: "Sales",
  },
  {
    id: "ID000005",
    email: "admin@creativedesign.com",
    name: "CV Creative Design",
    verified: true,
    subscription: true,
    status: "Active Member",
    role: "Manager",
  },
  {
    id: "ID000006",
    email: "ahmad.fauzi@email.com",
    name: "Ahmad Fauzi",
    verified: true,
    subscription: false,
    status: "Active Member",
    role: "Admin",
  },
  {
    id: "ID000007",
    email: "yayasan.pend@email.com",
    name: "Yayasan Pendidikan",
    verified: true,
    subscription: true,
    status: "Active Member",
    role: "Sales",
  },
  {
    id: "ID000008",
    email: "resto.sedap@email.com",
    name: "Resto Sedap Malam",
    verified: false,
    subscription: true,
    status: "Active Member",
    role: "Sales",
  },
  {
    id: "ID000009",
    email: "procurement@globaltech.com",
    name: "PT Global Tech",
    verified: true,
    subscription: true,
    status: "Active Member",
    role: "Admin",
  },
  {
    id: "ID000010",
    email: "indah.lestari@email.com",
    name: "Indah Lestari",
    verified: true,
    subscription: false,
    status: "Active Member",
    role: "Manager",
  },
  {
    id: "ID000011",
    email: "sinarterang@pt.com",
    name: "PT Sinar Terang",
    verified: true,
    subscription: true,
    status: "Active Member",
    role: "Admin",
  },
  {
    id: "ID000012",
    email: "admin@kliniksehat.com",
    name: "Klinik Sehat",
    verified: true,
    subscription: false,
    status: "Active Member",
    role: "Manager",
  },
]);

const currentUser = ref<UserItem>({
  id: "",
  email: "",
  name: "",
  verified: true,
  subscription: true,
  status: "Active Member",
  role: "Admin",
  phone: "",
  avatar: "",
  descriptions: "",
});

const filteredUsers = computed(() => {
  return users.value.filter((item) => {
    const q = searchQuery.value.toLowerCase();
    const matchQ =
      item.name.toLowerCase().includes(q) || item.email.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
    const matchRole = !selectedRole.value || item.role === selectedRole.value;
    const matchStatus = !selectedStatus.value || item.status === selectedStatus.value;
    return matchQ && matchRole && matchStatus;
  });
});

const openAddModal = () => {
  isEditing.value = false;
  const nextNum = users.value.length + 1;
  currentUser.value = {
    id: `ID${String(nextNum).padStart(6, "0")}`,
    email: "",
    name: "",
    verified: true,
    subscription: true,
    status: "Active Member",
    role: "Admin",
    phone: "",
    avatar: "/assets/img/users/user-01.jpg",
    descriptions: "",
  };
  showModal.value = true;
};

const openEditModal = (user: UserItem) => {
  isEditing.value = true;
  currentUser.value = { ...user };
  showModal.value = true;
};

const onAvatarChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    currentUser.value.avatar = URL.createObjectURL(target.files[0]);
  }
};

const saveUser = () => {
  if (isEditing.value) {
    const idx = users.value.findIndex((u) => u.id === currentUser.value.id);
    if (idx !== -1) {
      users.value[idx] = { ...currentUser.value };
    }
  } else {
    users.value.unshift({ ...currentUser.value });
  }
  showModal.value = false;
};

const deleteUser = (idx: number) => {
  if (confirm("Are you sure you want to delete this user?")) {
    users.value.splice(idx, 1);
  }
};

const exportPdf = () => {
  window.print();
};

const printTable = () => {
  window.print();
};

const refresh = () => {
  // refresh
};

const toggleCollapse = () => {
  // collapse
};
</script>
