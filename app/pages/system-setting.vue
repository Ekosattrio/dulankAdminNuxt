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
                <h4 class="fs-18 fw-bold">System Settings</h4>
              </div>

              <div class="row g-4">
                <!-- Google Captcha -->
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6 d-flex">
                  <div
                    class="connected-app-card d-flex w-100 border p-3 rounded bg-white shadow-sm flex-column justify-content-between"
                  >
                    <ul class="w-100 list-unstyled mb-0">
                      <li class="flex-column align-items-start mb-3">
                        <div class="d-flex align-items-center justify-content-between w-100 mb-2">
                          <div class="security-type d-flex align-items-center gap-2">
                            <span class="system-app-icon">
                              <img
                                src="/assets/img/icons/app-icon-07.svg"
                                alt="Google Captcha"
                                style="width: 36px; height: 36px"
                              />
                            </span>
                            <div class="security-title">
                              <h5 class="fw-bold mb-0">Google Captcha</h5>
                            </div>
                          </div>
                          <div class="form-check form-switch mb-0">
                            <input
                              v-model="integrations.captcha.enabled"
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                            />
                          </div>
                        </div>
                        <p class="text-muted text-sm mb-0">Captcha helps protect you from spam and password decryption</p>
                      </li>
                      <li class="pt-2 border-top">
                        <button class="btn btn-sm btn-outline-primary" @click="openModal('captcha')">
                          <i class="ti ti-tool me-1"></i>View Integration
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Google Analytics -->
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6 d-flex">
                  <div
                    class="connected-app-card d-flex w-100 border p-3 rounded bg-white shadow-sm flex-column justify-content-between"
                  >
                    <ul class="w-100 list-unstyled mb-0">
                      <li class="flex-column align-items-start mb-3">
                        <div class="d-flex align-items-center justify-content-between w-100 mb-2">
                          <div class="security-type d-flex align-items-center gap-2">
                            <span class="system-app-icon">
                              <img
                                src="/assets/img/icons/app-icon-08.svg"
                                alt="Google Analytics"
                                style="width: 36px; height: 36px"
                              />
                            </span>
                            <div class="security-title">
                              <h5 class="fw-bold mb-0">Google Analytics</h5>
                            </div>
                          </div>
                          <div class="form-check form-switch mb-0">
                            <input
                              v-model="integrations.analytics.enabled"
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                            />
                          </div>
                        </div>
                        <p class="text-muted text-sm mb-0">
                          Provides statistics and basic analytical tools for SEO and marketing purposes.
                        </p>
                      </li>
                      <li class="pt-2 border-top">
                        <button class="btn btn-sm btn-outline-primary" @click="openModal('analytics')">
                          <i class="ti ti-tool me-1"></i>View Integration
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Google Adsense Code -->
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6 d-flex">
                  <div
                    class="connected-app-card d-flex w-100 border p-3 rounded bg-white shadow-sm flex-column justify-content-between"
                  >
                    <ul class="w-100 list-unstyled mb-0">
                      <li class="flex-column align-items-start mb-3">
                        <div class="d-flex align-items-center justify-content-between w-100 mb-2">
                          <div class="security-type d-flex align-items-center gap-2">
                            <span class="system-app-icon">
                              <img
                                src="/assets/img/icons/app-icon-09.svg"
                                alt="Google Adsense"
                                style="width: 36px; height: 36px"
                              />
                            </span>
                            <div class="security-title">
                              <h5 class="fw-bold mb-0">Google Adsense Code</h5>
                            </div>
                          </div>
                          <div class="form-check form-switch mb-0">
                            <input
                              v-model="integrations.adsense.enabled"
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                            />
                          </div>
                        </div>
                        <p class="text-muted text-sm mb-0">
                          Provides a way for publishers to earn money from their online content.
                        </p>
                      </li>
                      <li class="pt-2 border-top">
                        <button class="btn btn-sm btn-outline-primary" @click="openModal('adsense')">
                          <i class="ti ti-tool me-1"></i>View Integration
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Google Map -->
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6 d-flex">
                  <div
                    class="connected-app-card d-flex w-100 border p-3 rounded bg-white shadow-sm flex-column justify-content-between"
                  >
                    <ul class="w-100 list-unstyled mb-0">
                      <li class="flex-column align-items-start mb-3">
                        <div class="d-flex align-items-center justify-content-between w-100 mb-2">
                          <div class="security-type d-flex align-items-center gap-2">
                            <span class="system-app-icon">
                              <img src="/assets/img/icons/app-icon-10.svg" alt="Google Map" style="width: 36px; height: 36px" />
                            </span>
                            <div class="security-title">
                              <h5 class="fw-bold mb-0">Google Map</h5>
                            </div>
                          </div>
                          <div class="form-check form-switch mb-0">
                            <input v-model="integrations.map.enabled" class="form-check-input" type="checkbox" role="switch" />
                          </div>
                        </div>
                        <p class="text-muted text-sm mb-0">
                          Provides detailed information about geographical regions and sites worldwide.
                        </p>
                      </li>
                      <li class="pt-2 border-top">
                        <button class="btn btn-sm btn-outline-primary" @click="openModal('map')">
                          <i class="ti ti-tool me-1"></i>View Integration
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Config Modal -->
      <div v-if="activeKey" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered custom-modal-two">
          <div class="modal-content">
            <div class="page-wrapper-new p-0">
              <div class="content p-4">
                <div class="modal-header border-0 custom-modal-header p-0 mb-3">
                  <div class="page-title">
                    <h4 class="fw-bold">{{ modalTitle }}</h4>
                  </div>
                  <button type="button" class="btn-close" @click="activeKey = null"></button>
                </div>
                <div class="modal-body custom-modal-body p-0">
                  <!-- Google Captcha Form -->
                  <form v-if="activeKey === 'captcha'" @submit.prevent="saveConfig">
                    <div class="row">
                      <div class="col-lg-12 mb-3">
                        <label class="form-label">Google Recaptcha Site Key <span class="text-danger">*</span></label>
                        <input v-model="integrations.captcha.siteKey" type="text" class="form-control" required />
                      </div>
                      <div class="col-lg-12 mb-4">
                        <label class="form-label">Google Recaptcha Secret Key <span class="text-danger">*</span></label>
                        <input v-model="integrations.captcha.secretKey" type="password" class="form-control" required />
                      </div>
                    </div>
                    <div class="modal-footer modal-action-footer justify-content-end p-0 pt-3 border-top">
                      <button type="button" class="btn btn-secondary me-2" @click="activeKey = null">Cancel</button>
                      <button type="submit" class="btn btn-warning text-white">Submit</button>
                    </div>
                  </form>

                  <!-- Google Analytics Form -->
                  <form v-else-if="activeKey === 'analytics'" @submit.prevent="saveConfig">
                    <div class="row">
                      <div class="col-lg-12 mb-4">
                        <label class="form-label">Google Analytics Measurement ID <span class="text-danger">*</span></label>
                        <input
                          v-model="integrations.analytics.trackingId"
                          type="text"
                          placeholder="G-XXXXXXXXXX"
                          class="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div class="modal-footer modal-action-footer justify-content-end p-0 pt-3 border-top">
                      <button type="button" class="btn btn-secondary me-2" @click="activeKey = null">Cancel</button>
                      <button type="submit" class="btn btn-warning text-white">Submit</button>
                    </div>
                  </form>

                  <!-- Google Adsense Form -->
                  <form v-else-if="activeKey === 'adsense'" @submit.prevent="saveConfig">
                    <div class="row">
                      <div class="col-lg-12 mb-4">
                        <label class="form-label">Google Adsense Publisher ID / Code <span class="text-danger">*</span></label>
                        <input
                          v-model="integrations.adsense.code"
                          type="text"
                          placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                          class="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div class="modal-footer modal-action-footer justify-content-end p-0 pt-3 border-top">
                      <button type="button" class="btn btn-secondary me-2" @click="activeKey = null">Cancel</button>
                      <button type="submit" class="btn btn-warning text-white">Submit</button>
                    </div>
                  </form>

                  <!-- Google Map Form -->
                  <form v-else-if="activeKey === 'map'" @submit.prevent="saveConfig">
                    <div class="row">
                      <div class="col-lg-12 mb-4">
                        <label class="form-label">Google Maps API Key / Map ID <span class="text-danger">*</span></label>
                        <input v-model="integrations.map.mapId" type="text" class="form-control" required />
                      </div>
                    </div>
                    <div class="modal-footer modal-action-footer justify-content-end p-0 pt-3 border-top">
                      <button type="button" class="btn btn-secondary me-2" @click="activeKey = null">Cancel</button>
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
  title: "System Settings - Kacetak System",
});

type IntegrationKey = "captcha" | "analytics" | "adsense" | "map";

const activeKey = ref<IntegrationKey | null>(null);

const integrations = ref({
  captcha: {
    enabled: true,
    siteKey: "6LceW14mAAAAAFx_98321049381204",
    secretKey: "••••••••••••••••••••••••",
  },
  analytics: {
    enabled: true,
    trackingId: "G-7489320194",
  },
  adsense: {
    enabled: false,
    code: "ca-pub-9840293810293849",
  },
  map: {
    enabled: true,
    mapId: "AIzaSyA89489210_map_kacetak",
  },
});

const modalTitle = computed(() => {
  switch (activeKey.value) {
    case "captcha":
      return "Configure Google Captcha";
    case "analytics":
      return "Configure Google Analytics";
    case "adsense":
      return "Configure Google Adsense Code";
    case "map":
      return "Configure Google Map ID";
    default:
      return "";
  }
});

const openModal = (key: IntegrationKey) => {
  activeKey.value = key;
};

const saveConfig = () => {
  alert(`${modalTitle.value} updated successfully!`);
  activeKey.value = null;
};

const refresh = () => {
  // refresh
};

const toggleCollapse = () => {
  // collapse
};
</script>
