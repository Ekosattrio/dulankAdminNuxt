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
              <div class="setting-title mb-4">
                <h4 class="fs-18 fw-bold">Social Authentication</h4>
              </div>
              <div class="row social-authent-settings g-4">
                <!-- Facebook -->
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6 d-flex">
                  <div
                    class="connected-app-card d-flex w-100 border p-3 rounded bg-white shadow-sm flex-column justify-content-between"
                  >
                    <ul class="w-100 list-unstyled mb-0">
                      <li class="flex-column align-items-start mb-3">
                        <div class="d-flex align-items-center justify-content-between w-100 mb-2">
                          <div class="security-type d-flex align-items-center gap-2">
                            <span class="system-app-icon">
                              <img src="/assets/img/icons/fb-icon.svg" alt="Facebook" style="width: 36px; height: 36px" />
                            </span>
                            <div class="security-title">
                              <h5 class="fw-bold mb-0">Facebook</h5>
                            </div>
                          </div>
                          <div class="connect-btn">
                            <span :class="providers.facebook.enabled ? 'badge bg-success' : 'badge bg-secondary'">
                              {{ providers.facebook.enabled ? "Connected" : "Not connected" }}
                            </span>
                          </div>
                        </div>
                        <p class="text-muted text-sm mb-0">Connect with friends, family and other people you know.</p>
                      </li>
                      <li class="d-flex justify-content-between align-items-center pt-2 border-top">
                        <div class="integration-btn">
                          <button class="btn btn-sm btn-outline-primary" @click="openModal('facebook')">
                            <i class="ti ti-tool me-1"></i>{{ providers.facebook.enabled ? "View Integration" : "Connect Now" }}
                          </button>
                        </div>
                        <div class="form-check form-switch mb-0">
                          <input v-model="providers.facebook.enabled" class="form-check-input" type="checkbox" role="switch" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Twitter -->
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6 d-flex">
                  <div
                    class="connected-app-card d-flex w-100 border p-3 rounded bg-white shadow-sm flex-column justify-content-between"
                  >
                    <ul class="w-100 list-unstyled mb-0">
                      <li class="flex-column align-items-start mb-3">
                        <div class="d-flex align-items-center justify-content-between w-100 mb-2">
                          <div class="security-type d-flex align-items-center gap-2">
                            <span class="system-app-icon">
                              <img src="/assets/img/icons/twitter-icon.svg" alt="Twitter" style="width: 36px; height: 36px" />
                            </span>
                            <div class="security-title">
                              <h5 class="fw-bold mb-0">Twitter</h5>
                            </div>
                          </div>
                          <div class="connect-btn">
                            <span :class="providers.twitter.enabled ? 'badge bg-success' : 'badge bg-secondary'">
                              {{ providers.twitter.enabled ? "Connected" : "Not connected" }}
                            </span>
                          </div>
                        </div>
                        <p class="text-muted text-sm mb-0">
                          Communicate and stay connected through the exchange of quick, frequent messages
                        </p>
                      </li>
                      <li class="d-flex justify-content-between align-items-center pt-2 border-top">
                        <div class="integration-btn">
                          <button class="btn btn-sm btn-outline-primary" @click="openModal('twitter')">
                            <i class="ti ti-tool me-1"></i>{{ providers.twitter.enabled ? "View Integration" : "Connect Now" }}
                          </button>
                        </div>
                        <div class="form-check form-switch mb-0">
                          <input v-model="providers.twitter.enabled" class="form-check-input" type="checkbox" role="switch" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Google -->
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6 d-flex">
                  <div
                    class="connected-app-card d-flex w-100 border p-3 rounded bg-white shadow-sm flex-column justify-content-between"
                  >
                    <ul class="w-100 list-unstyled mb-0">
                      <li class="flex-column align-items-start mb-3">
                        <div class="d-flex align-items-center justify-content-between w-100 mb-2">
                          <div class="security-type d-flex align-items-center gap-2">
                            <span class="system-app-icon">
                              <img src="/assets/img/icons/google-icon.svg" alt="Google" style="width: 36px; height: 36px" />
                            </span>
                            <div class="security-title">
                              <h5 class="fw-bold mb-0">Google</h5>
                            </div>
                          </div>
                          <div class="connect-btn">
                            <span :class="providers.google.enabled ? 'badge bg-success' : 'badge bg-secondary'">
                              {{ providers.google.enabled ? "Connected" : "Not connected" }}
                            </span>
                          </div>
                        </div>
                        <p class="text-muted text-sm mb-0">
                          Google has many special features to help you find exactly what you're looking for.
                        </p>
                      </li>
                      <li class="d-flex justify-content-between align-items-center pt-2 border-top">
                        <div class="integration-btn">
                          <button class="btn btn-sm btn-outline-primary" @click="openModal('google')">
                            <i class="ti ti-tool me-1"></i>{{ providers.google.enabled ? "View Integration" : "Connect Now" }}
                          </button>
                        </div>
                        <div class="form-check form-switch mb-0">
                          <input v-model="providers.google.enabled" class="form-check-input" type="checkbox" role="switch" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- LinkedIn -->
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6 d-flex">
                  <div
                    class="connected-app-card d-flex w-100 border p-3 rounded bg-white shadow-sm flex-column justify-content-between"
                  >
                    <ul class="w-100 list-unstyled mb-0">
                      <li class="flex-column align-items-start mb-3">
                        <div class="d-flex align-items-center justify-content-between w-100 mb-2">
                          <div class="security-type d-flex align-items-center gap-2">
                            <span class="system-app-icon">
                              <img src="/assets/img/icons/linkedin-icon.svg" alt="LinkedIn" style="width: 36px; height: 36px" />
                            </span>
                            <div class="security-title">
                              <h5 class="fw-bold mb-0">Linkedin</h5>
                            </div>
                          </div>
                          <div class="connect-btn">
                            <span :class="providers.linkedin.enabled ? 'badge bg-success' : 'badge bg-secondary'">
                              {{ providers.linkedin.enabled ? "Connected" : "Not connected" }}
                            </span>
                          </div>
                        </div>
                        <p class="text-muted text-sm mb-0">
                          Network with people and professional organizations in your industry.
                        </p>
                      </li>
                      <li class="d-flex justify-content-between align-items-center pt-2 border-top">
                        <div class="integration-btn">
                          <button class="btn btn-sm btn-outline-primary" @click="openModal('linkedin')">
                            <i class="ti ti-tool me-1"></i>{{ providers.linkedin.enabled ? "View Integration" : "Connect Now" }}
                          </button>
                        </div>
                        <div class="form-check form-switch mb-0">
                          <input v-model="providers.linkedin.enabled" class="form-check-input" type="checkbox" role="switch" />
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

      <!-- Unified Config Modal -->
      <div v-if="activeModal" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="page-wrapper-new p-0">
              <div class="content p-4">
                <div class="modal-header border-0 custom-modal-header p-0 mb-3">
                  <div class="page-title">
                    <h4 class="fw-bold">{{ modalTitle }}</h4>
                  </div>
                  <button type="button" class="btn-close" @click="activeModal = null"></button>
                </div>
                <div class="modal-body custom-modal-body p-0">
                  <form @submit.prevent="saveProviderConfig">
                    <div class="row">
                      <div class="col-lg-12 mb-3">
                        <label class="form-label"
                          >{{
                            activeModal === "twitter"
                              ? "Consumer Key (API Key)"
                              : activeModal === "facebook"
                                ? "App ID"
                                : "Client ID"
                          }}
                          <span class="text-danger">*</span></label
                        >
                        <input v-model="currentForm.clientId" type="text" class="form-control" required />
                        <p v-if="activeModal !== 'facebook'" class="form-text text-muted mb-0">
                          If you are not sure what is your App ID, please check documentation.
                        </p>
                      </div>
                      <div class="col-lg-12 mb-3">
                        <label class="form-label"
                          >{{
                            activeModal === "twitter"
                              ? "Consumer Secret (Secret Key)"
                              : activeModal === "facebook"
                                ? "App Secret"
                                : "Client Secret Key"
                          }}
                          <span class="text-danger">*</span></label
                        >
                        <input v-model="currentForm.clientSecret" type="password" class="form-control" required />
                      </div>
                      <div class="col-lg-12 mb-4">
                        <label class="form-label">Login Redirect URL <span class="text-danger">*</span></label>
                        <input v-model="currentForm.redirectUrl" type="text" class="form-control" required />
                      </div>
                    </div>
                    <div class="modal-footer modal-action-footer justify-content-end p-0 pt-3 border-top">
                      <button type="button" class="btn btn-secondary me-2" @click="activeModal = null">Cancel</button>
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
import { ref, computed } from "vue";

useHead({
  title: "Social Authentication - Kacetak System",
});

type ProviderKey = "facebook" | "twitter" | "google" | "linkedin";

const activeModal = ref<ProviderKey | null>(null);

const providers = ref<Record<ProviderKey, { enabled: boolean; clientId: string; clientSecret: string; redirectUrl: string }>>({
  facebook: {
    enabled: true,
    clientId: "5391823901923",
    clientSecret: "••••••••••••••••••••••••",
    redirectUrl: "https://kacetak.com/auth/facebook/callback",
  },
  twitter: {
    enabled: false,
    clientId: "",
    clientSecret: "",
    redirectUrl: "https://kacetak.com/auth/twitter/callback",
  },
  google: {
    enabled: false,
    clientId: "",
    clientSecret: "",
    redirectUrl: "https://kacetak.com/auth/google/callback",
  },
  linkedin: {
    enabled: true,
    clientId: "78akdjq912k3",
    clientSecret: "••••••••••••••••••••••••",
    redirectUrl: "https://kacetak.com/auth/linkedin/callback",
  },
});

const currentForm = ref({
  clientId: "",
  clientSecret: "",
  redirectUrl: "",
});

const modalTitle = computed(() => {
  switch (activeModal.value) {
    case "facebook":
      return "Facebook Login Settings";
    case "twitter":
      return "Twitter Login Settings";
    case "google":
      return "Google Login Settings";
    case "linkedin":
      return "LinkedIn Login Settings";
    default:
      return "";
  }
});

const openModal = (key: ProviderKey) => {
  activeModal.value = key;
  currentForm.value = { ...providers.value[key] };
};

const saveProviderConfig = () => {
  if (activeModal.value) {
    providers.value[activeModal.value].clientId = currentForm.value.clientId;
    providers.value[activeModal.value].clientSecret = currentForm.value.clientSecret;
    providers.value[activeModal.value].redirectUrl = currentForm.value.redirectUrl;
    providers.value[activeModal.value].enabled = true;
    alert(`${modalTitle.value} updated successfully!`);
    activeModal.value = null;
  }
};

const refresh = () => {
  // refresh
};

const toggleCollapse = () => {
  // collapse
};
</script>
