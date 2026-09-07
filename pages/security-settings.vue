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
              <div class="setting-title mb-4">
                <h4 class="fs-18 fw-bold">Security</h4>
              </div>
              <div class="security-settings">
                <ul class="list-unstyled mb-0">
                  <!-- Password -->
                  <li class="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div class="security-type d-flex align-items-center gap-3">
                      <span class="security-icon fs-20 text-muted">
                        <i class="ti ti-eye-off"></i>
                      </span>
                      <div class="security-title">
                        <h5 class="fw-semibold mb-1">Password</h5>
                        <p class="text-muted text-sm mb-0">Last Changed {{ security.passwordLastChanged }}</p>
                      </div>
                    </div>
                    <div class="security-btn">
                      <button class="btn btn-primary" @click="showPasswordModal = true">Change Password</button>
                    </div>
                  </li>

                  <!-- Two Factor -->
                  <li class="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div class="security-type d-flex align-items-center gap-3">
                      <span class="security-icon fs-20 text-muted">
                        <i class="ti ti-shield"></i>
                      </span>
                      <div class="security-title">
                        <h5 class="fw-semibold mb-1">Two Factor</h5>
                        <p class="text-muted text-sm mb-0">Receive codes via SMS or email every time you login</p>
                      </div>
                    </div>
                    <div class="security-btn d-flex align-items-center gap-3">
                      <button
                        :class="security.twoFactor ? 'btn btn-outline-danger' : 'btn btn-outline-success'"
                        @click="security.twoFactor = !security.twoFactor"
                      >
                        {{ security.twoFactor ? "Disable" : "Enable" }}
                      </button>
                      <div class="form-check form-switch mb-0">
                        <input v-model="security.twoFactor" class="form-check-input" type="checkbox" role="switch" />
                      </div>
                    </div>
                  </li>

                  <!-- Google Authentication -->
                  <li class="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div class="security-type d-flex align-items-center gap-3">
                      <span class="security-icon fs-20 text-muted">
                        <i class="ti ti-shield-check"></i>
                      </span>
                      <div class="security-title">
                        <h5 class="fw-semibold mb-1">Google Authentication</h5>
                        <p class="text-muted text-sm mb-0">Connect to Google</p>
                      </div>
                    </div>
                    <div class="security-btn d-flex align-items-center gap-3">
                      <span :class="security.googleAuth ? 'badge bg-success' : 'badge bg-secondary'">
                        {{ security.googleAuth ? "Connected" : "Disconnected" }}
                      </span>
                      <div class="form-check form-switch mb-0">
                        <input v-model="security.googleAuth" class="form-check-input" type="checkbox" role="switch" />
                      </div>
                    </div>
                  </li>

                  <!-- Phone Number Verification -->
                  <li class="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div class="security-type d-flex align-items-center gap-3">
                      <span class="security-icon fs-20 text-muted">
                        <i class="ti ti-phone"></i>
                      </span>
                      <div class="security-title">
                        <h5 class="fw-semibold mb-1">Phone Number Verification</h5>
                        <p class="text-muted text-sm mb-0">Verified Mobile Number : {{ security.phone }}</p>
                      </div>
                    </div>
                    <div class="security-btn d-flex align-items-center gap-2">
                      <span class="text-success me-1"><i class="ti ti-circle-check fs-18"></i></span>
                      <button class="btn btn-sm btn-outline-primary" @click="showPhoneModal = true">Change</button>
                      <button class="btn btn-sm text-danger" @click="removePhone">Remove</button>
                    </div>
                  </li>

                  <!-- Email Verification -->
                  <li class="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div class="security-type d-flex align-items-center gap-3">
                      <span class="security-icon fs-20 text-muted">
                        <i class="ti ti-mail"></i>
                      </span>
                      <div class="security-title">
                        <h5 class="fw-semibold mb-1">Email Verification</h5>
                        <p class="text-muted text-sm mb-0">Verified Email : {{ security.email }}</p>
                      </div>
                    </div>
                    <div class="security-btn d-flex align-items-center gap-2">
                      <span class="text-success me-1"><i class="ti ti-circle-check fs-18"></i></span>
                      <button class="btn btn-sm btn-outline-primary" @click="showEmailModal = true">Change</button>
                      <button class="btn btn-sm text-danger" @click="removeEmail">Remove</button>
                    </div>
                  </li>

                  <!-- Device Management -->
                  <li class="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div class="security-type d-flex align-items-center gap-3">
                      <span class="security-icon fs-20 text-muted">
                        <i class="ti ti-devices"></i>
                      </span>
                      <div class="security-title">
                        <h5 class="fw-semibold mb-1">Device Management</h5>
                        <p class="text-muted text-sm mb-0">Last Changed 22 July 2023, 10:30 AM</p>
                      </div>
                    </div>
                    <div class="security-btn d-flex align-items-center">
                      <button class="btn btn-outline-secondary btn-sm" @click="alertAction('Device management list displayed')">
                        Manage
                      </button>
                    </div>
                  </li>

                  <!-- Account Activity -->
                  <li class="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div class="security-type d-flex align-items-center gap-3">
                      <span class="security-icon fs-20 text-muted">
                        <i class="ti ti-activity"></i>
                      </span>
                      <div class="security-title">
                        <h5 class="fw-semibold mb-1">Account Activity</h5>
                        <p class="text-muted text-sm mb-0">Last Changed 25 July 2023, 11:00 AM</p>
                      </div>
                    </div>
                    <div class="security-btn d-flex align-items-center">
                      <button
                        class="btn btn-outline-secondary btn-sm"
                        @click="alertAction('Recent account activities: 3 active logins')"
                      >
                        View
                      </button>
                    </div>
                  </li>

                  <!-- Deactivate Account -->
                  <li class="d-flex justify-content-between align-items-center py-3 border-bottom">
                    <div class="security-type d-flex align-items-center gap-3">
                      <span class="security-icon fs-20 text-muted">
                        <i class="ti ti-ban"></i>
                      </span>
                      <div class="security-title">
                        <h5 class="fw-semibold mb-1">Deactivate Account</h5>
                        <p class="text-muted text-sm mb-0">Last Changed 21 July 2023, 09:37 AM</p>
                      </div>
                    </div>
                    <div class="security-btn d-flex align-items-center">
                      <button class="btn btn-outline-warning btn-sm" @click="alertAction('Account deactivation requested')">
                        Deactivate
                      </button>
                    </div>
                  </li>

                  <!-- Delete Account -->
                  <li class="d-flex justify-content-between align-items-center py-3">
                    <div class="security-type d-flex align-items-center gap-3">
                      <span class="security-icon fs-20 text-danger">
                        <i class="ti ti-trash"></i>
                      </span>
                      <div class="security-title">
                        <h5 class="fw-semibold mb-1 text-danger">Delete Account</h5>
                        <p class="text-muted text-sm mb-0">Last Changed 26 July 2023, 11:40 AM</p>
                      </div>
                    </div>
                    <div class="security-btn d-flex align-items-center">
                      <NuxtLink to="/delete-account" class="btn btn-danger btn-sm">Delete</NuxtLink>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Password Change Modal -->
      <div v-if="showPasswordModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Change Password</h5>
              <button type="button" class="btn-close" @click="showPasswordModal = false"></button>
            </div>
            <form @submit.prevent="updatePassword">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Current Password <span class="text-danger">*</span></label>
                  <input v-model="passForm.current" type="password" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">New Password <span class="text-danger">*</span></label>
                  <input v-model="passForm.newPass" type="password" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Confirm New Password <span class="text-danger">*</span></label>
                  <input v-model="passForm.confirm" type="password" class="form-control" required />
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="showPasswordModal = false">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Phone Change Modal -->
      <div v-if="showPhoneModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Change Phone Number</h5>
              <button type="button" class="btn-close" @click="showPhoneModal = false"></button>
            </div>
            <form @submit.prevent="updatePhone">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Mobile Phone Number <span class="text-danger">*</span></label>
                  <input v-model="tempPhone" type="text" class="form-control" required />
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="showPhoneModal = false">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Phone</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Email Change Modal -->
      <div v-if="showEmailModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Change Email</h5>
              <button type="button" class="btn-close" @click="showEmailModal = false"></button>
            </div>
            <form @submit.prevent="updateEmail">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Email Address <span class="text-danger">*</span></label>
                  <input v-model="tempEmail" type="email" class="form-control" required />
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="showEmailModal = false">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Email</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

useHead({
  title: "Security Settings - Kacetak System",
});

const security = ref({
  passwordLastChanged: "22 July 2023, 10:30 AM",
  twoFactor: true,
  googleAuth: true,
  phone: "+81699799974",
  email: "info@example.com",
});

const showPasswordModal = ref(false);
const showPhoneModal = ref(false);
const showEmailModal = ref(false);

const passForm = ref({
  current: "",
  newPass: "",
  confirm: "",
});

const tempPhone = ref("+81699799974");
const tempEmail = ref("info@example.com");

const updatePassword = () => {
  if (passForm.value.newPass !== passForm.value.confirm) {
    alert("Passwords do not match!");
    return;
  }
  security.value.passwordLastChanged = "Just now";
  showPasswordModal.value = false;
  alert("Password changed successfully!");
  passForm.value = { current: "", newPass: "", confirm: "" };
};

const updatePhone = () => {
  security.value.phone = tempPhone.value;
  showPhoneModal.value = false;
  alert("Phone number updated!");
};

const removePhone = () => {
  if (confirm("Are you sure you want to remove this phone number?")) {
    security.value.phone = "Not configured";
  }
};

const updateEmail = () => {
  security.value.email = tempEmail.value;
  showEmailModal.value = false;
  alert("Email updated!");
};

const removeEmail = () => {
  if (confirm("Are you sure you want to remove this email?")) {
    security.value.email = "Not configured";
  }
};

const alertAction = (msg: string) => {
  alert(msg);
};

const refresh = () => {
  // refresh
};

const toggleCollapse = () => {
  // collapse
};
</script>
