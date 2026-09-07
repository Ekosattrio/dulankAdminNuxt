<template>
  <div class="page-wrapper mt-3">
    <div class="content settings-content">
      <div class="page-header settings-pg-header">
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
              <div class="setting-title">
                <h4>Storage</h4>
              </div>
              <div class="page-header text-end justify-content-end mb-4">
                <a href="javascript:void(0);" class="btn btn-primary" @click="sendTestEmail">
                  <i class="ti ti-mail me-2"></i>Send test email
                </a>
              </div>
              <div class="row">
                <!-- Local Storage -->
                <div class="col-xxl-4 col-lg-6 col-md-4 col-sm-6 d-flex mb-4">
                  <div class="connected-app-card d-flex w-100 border p-3 rounded bg-white shadow-sm">
                    <ul class="w-100 d-flex justify-content-between align-items-center list-unstyled mb-0">
                      <li class="storage-icon mb-0 d-flex align-items-center gap-3">
                        <span class="system-app-icon">
                          <img
                            src="/assets/img/icons/storage-icon-01.svg"
                            alt="Local Storage"
                            style="width: 40px; height: 40px"
                          />
                        </span>
                        <h6 class="mb-0 fw-semibold">Local Storage</h6>
                      </li>
                      <li class="setting-gateway d-flex align-items-center">
                        <a href="javascript:void(0);" class="me-2 text-muted" @click="openConfig('local')">
                          <i class="ti ti-settings fs-18"></i>
                        </a>
                        <div class="form-check form-switch mb-0">
                          <input v-model="storage.local.enabled" class="form-check-input" type="checkbox" role="switch" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- AWS -->
                <div class="col-xl-4 col-lg-6 col-md-4 col-sm-6 d-flex mb-4">
                  <div class="connected-app-card d-flex w-100 border p-3 rounded bg-white shadow-sm">
                    <ul class="w-100 d-flex justify-content-between align-items-center list-unstyled mb-0">
                      <li class="storage-icon mb-0 d-flex align-items-center gap-3">
                        <span class="system-app-icon">
                          <img src="/assets/img/icons/storage-icon-02.svg" alt="AWS" style="width: 40px; height: 40px" />
                        </span>
                        <h6 class="mb-0 fw-semibold">AWS</h6>
                      </li>
                      <li class="setting-gateway d-flex align-items-center">
                        <a href="javascript:void(0);" class="me-2 text-muted" @click="showAwsModal = true">
                          <i class="ti ti-settings fs-18"></i>
                        </a>
                        <div class="form-check form-switch mb-0">
                          <input v-model="storage.aws.enabled" class="form-check-input" type="checkbox" role="switch" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AWS Config Modal -->
      <div v-if="showAwsModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="page-wrapper-new p-0">
              <div class="content p-4">
                <div class="modal-header border-0 custom-modal-header p-0 mb-3">
                  <div class="page-title">
                    <h4 class="fw-bold">AWS Settings</h4>
                  </div>
                  <div class="form-check form-switch ms-auto me-3 mb-0">
                    <input v-model="storage.aws.enabled" class="form-check-input" type="checkbox" role="switch" />
                  </div>
                  <button type="button" class="btn-close" @click="showAwsModal = false"></button>
                </div>
                <div class="modal-body custom-modal-body p-0">
                  <form @submit.prevent="saveAwsConfig">
                    <div class="row">
                      <div class="col-lg-12 mb-3">
                        <label class="form-label">AWS Access Key <span class="text-danger">*</span></label>
                        <input v-model="storage.aws.accessKey" type="text" class="form-control" required />
                      </div>
                      <div class="col-lg-12 mb-3">
                        <label class="form-label">Secret Key <span class="text-danger">*</span></label>
                        <input v-model="storage.aws.secretKey" type="password" class="form-control" required />
                      </div>
                      <div class="col-lg-12 mb-3">
                        <label class="form-label">Bucket Name <span class="text-danger">*</span></label>
                        <input v-model="storage.aws.bucketName" type="text" class="form-control" required />
                      </div>
                      <div class="col-lg-12 mb-3">
                        <label class="form-label">Region <span class="text-danger">*</span></label>
                        <input v-model="storage.aws.region" type="text" class="form-control" required />
                      </div>
                      <div class="col-lg-12 mb-4">
                        <label class="form-label">Base URL <span class="text-danger">*</span></label>
                        <input v-model="storage.aws.baseUrl" type="text" class="form-control" required />
                      </div>
                    </div>
                    <div class="modal-footer modal-action-footer justify-content-end p-0 pt-3 border-top">
                      <button type="button" class="btn btn-secondary me-2" @click="showAwsModal = false">Cancel</button>
                      <button type="submit" class="btn btn-warning text-white">Submit</button>
                    </div>
                  </form>
                </div>
              </div>
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
  title: "Storage Settings - Kacetak System",
});

const showAwsModal = ref(false);

const storage = ref({
  local: {
    enabled: true,
  },
  aws: {
    enabled: true,
    accessKey: "AKIAIOSFODNN7EXAMPLE",
    secretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    bucketName: "kacetak-storage",
    region: "ap-southeast-1",
    baseUrl: "https://s3.ap-southeast-1.amazonaws.com/kacetak-storage",
  },
});

const openConfig = (type: string) => {
  if (type === "aws") {
    showAwsModal.value = true;
  } else {
    alert("Local storage is managed by internal server path.");
  }
};

const saveAwsConfig = () => {
  showAwsModal.value = false;
  alert("AWS Storage configuration saved successfully!");
};

const sendTestEmail = () => {
  alert("Test notification sent!");
};

const refresh = () => {
  // refresh
};

const toggleCollapse = () => {
  // collapse
};
</script>
