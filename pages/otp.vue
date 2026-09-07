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
              <form @submit.prevent="saveSettings">
                <div class="setting-title mb-4">
                  <h4 class="fs-18 fw-bold">OTP Settings</h4>
                </div>
                <div class="card p-4 border shadow-sm">
                  <div class="localization-info">
                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">OTP Type</h6>
                          <p class="text-muted text-sm mb-0">You can configure the delivery channel</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <div class="localization-select">
                          <select v-model="form.otpType" class="form-select">
                            <option value="SMS">SMS</option>
                            <option value="Email">Email</option>
                            <option value="WhatsApp">WhatsApp</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">OTP Digit Limit</h6>
                          <p class="text-muted text-sm mb-0">Select size of the format</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <div class="localization-select">
                          <select v-model="form.digitLimit" class="form-select">
                            <option value="4">4 Digits</option>
                            <option value="5">5 Digits</option>
                            <option value="6">6 Digits</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="row align-items-center mb-4">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">OTP Expire Time</h6>
                          <p class="text-muted text-sm mb-0">Select expire time of OTP token</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <div class="localization-select">
                          <select v-model="form.expireTime" class="form-select">
                            <option value="5 Mins">5 Mins</option>
                            <option value="10 Mins">10 Mins</option>
                            <option value="15 Mins">15 Mins</option>
                          </select>
                        </div>
                      </div>
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
  title: "OTP Settings - Kacetak System",
});

const form = ref({
  otpType: "SMS",
  digitLimit: "4",
  expireTime: "5 Mins",
});

const saveSettings = () => {
  alert("OTP Settings updated successfully!");
};

const resetForm = () => {
  form.value = {
    otpType: "SMS",
    digitLimit: "4",
    expireTime: "5 Mins",
  };
};

const refresh = () => {
  // Reload settings
};

const toggleCollapse = () => {
  // Collapse action
};
</script>
