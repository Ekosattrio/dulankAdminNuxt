<template>
  <div class="page-wrapper">
    <div class="content settings-content">
      <div class="page-header settings-pg-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Settings</h4>
            <h6>Manage your settings on portal</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh"><i class="ti ti-rotate"></i></a>
          </li>
          <li>
            <a title="Collapse" href="javascript:void(0);" @click="toggleCollapse"><i class="ti ti-chevron-up"></i></a>
          </li>
        </ul>
      </div>

      <div class="row">
        <div class="col-xl-12">
          <div class="settings-wrapper d-flex">
            <div class="settings-page-wrap w-100">
              <form @submit.prevent="saveProfile">
                <div class="setting-title mb-4">
                  <h4 class="fs-18 fw-bold">Profile Settings</h4>
                </div>

                <div class="card p-4 border shadow-sm mb-4">
                  <div class="card-title-head mb-4 d-flex align-items-center">
                    <h6 class="fs-16 fw-semibold d-flex align-items-center gap-2 mb-0">
                      <span class="p-1 rounded bg-light-primary text-primary"><i class="ti ti-user"></i></span>
                      Employee Information
                    </h6>
                  </div>

                  <div class="profile-pic-upload d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
                    <div class="profile-pic position-relative">
                      <img
                        :src="profilePhotoUrl || '/assets/img/users/user-01.jpg'"
                        alt="Profile"
                        class="rounded-circle border"
                        style="width: 100px; height: 100px; object-fit: cover"
                      />
                    </div>
                    <div class="new-employee-field">
                      <div class="image-upload mb-2">
                        <label class="btn btn-sm btn-outline-primary cursor-pointer mb-0">
                          <i class="ti ti-upload me-1"></i> Change Image
                          <input type="file" class="d-none" accept="image/*" @change="onFileChange" />
                        </label>
                      </div>
                      <span class="text-muted text-xs d-block">
                        For better preview recommended size is 450px x 450px. Max size 5MB.
                      </span>
                    </div>
                  </div>

                  <div class="row g-3 mb-4">
                    <div class="col-md-4">
                      <label class="form-label">First Name</label>
                      <input v-model="form.firstName" type="text" class="form-control" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Last Name</label>
                      <input v-model="form.lastName" type="text" class="form-control" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">User Name</label>
                      <input v-model="form.userName" type="text" class="form-control" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Phone Number</label>
                      <input v-model="form.phoneNumber" type="text" class="form-control" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label">Email</label>
                      <input v-model="form.email" type="email" class="form-control" />
                    </div>
                  </div>

                  <div class="card-title-head mb-4 d-flex align-items-center pt-3 border-top">
                    <h6 class="fs-16 fw-semibold d-flex align-items-center gap-2 mb-0">
                      <span class="p-1 rounded bg-light-warning text-warning"><i class="ti ti-map-pin"></i></span>
                      Our Address
                    </h6>
                  </div>

                  <div class="row g-3 mb-4">
                    <div class="col-md-12">
                      <label class="form-label">Address</label>
                      <input v-model="form.address" type="text" class="form-control" />
                    </div>
                    <div class="col-xl-3 col-lg-4 col-md-6">
                      <label class="form-label">Country</label>
                      <input v-model="form.country" type="text" class="form-control" />
                    </div>
                    <div class="col-xl-3 col-lg-4 col-md-6">
                      <label class="form-label">State / Province</label>
                      <input v-model="form.province" type="text" class="form-control" />
                    </div>
                    <div class="col-xl-3 col-lg-4 col-md-6">
                      <label class="form-label">City</label>
                      <input v-model="form.city" type="text" class="form-control" />
                    </div>
                    <div class="col-xl-3 col-lg-4 col-md-6">
                      <label class="form-label">Postal Code</label>
                      <input v-model="form.postalCode" type="text" class="form-control" />
                    </div>
                  </div>

                  <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                    <button type="button" class="btn btn-light" @click="resetForm">Cancel</button>
                    <button type="submit" class="btn btn-warning text-white">Save Changes</button>
                  </div>
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
import { ref } from "vue";

useHead({
  title: "Profile Settings - Kacetak System",
});

const profilePhotoUrl = ref("");

const form = ref({
  firstName: "Admin",
  lastName: "User",
  userName: "admin",
  phoneNumber: "+62 812-3456-7890",
  email: "admin@example.com",
  address: "Jl. Merdeka No. 45",
  country: "Indonesia",
  province: "DKI Jakarta",
  city: "Jakarta Selatan",
  postalCode: "12190",
});

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    profilePhotoUrl.value = URL.createObjectURL(file);
  }
};

const saveProfile = () => {
  alert("Profile updated successfully!");
};

const resetForm = () => {
  form.value = {
    firstName: "Admin",
    lastName: "User",
    userName: "admin",
    phoneNumber: "+62 812-3456-7890",
    email: "admin@example.com",
    address: "Jl. Merdeka No. 45",
    country: "Indonesia",
    province: "DKI Jakarta",
    city: "Jakarta Selatan",
    postalCode: "12190",
  };
};

const refresh = () => {
  // Reload
};

const toggleCollapse = () => {
  // Toggle collapse
};
</script>
