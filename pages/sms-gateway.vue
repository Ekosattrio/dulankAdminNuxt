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
                <h4 class="fs-18 fw-bold">SMS Gateways</h4>
              </div>

              <!-- Gateways Grid -->
              <div class="row g-4">
                <div v-for="(gw, key) in gateways" :key="key" class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                  <div class="card p-4 border shadow-sm h-100 d-flex flex-column justify-content-between">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                      <div class="d-flex align-items-center gap-3">
                        <div
                          class="p-2 border rounded bg-light"
                          style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center"
                        >
                          <i class="ti ti-message-dots fs-24 text-primary"></i>
                        </div>
                        <div>
                          <h5 class="fw-bold mb-0">{{ gw.name }}</h5>
                          <span class="text-muted text-xs">{{ gw.desc }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex align-items-center justify-content-between pt-3 border-top">
                      <button class="btn btn-sm btn-outline-primary" @click="openConfigModal(key as GatewayKey)">
                        <i class="ti ti-settings me-1"></i> Configure
                      </button>
                      <div class="form-check form-switch mb-0">
                        <input v-model="gw.enabled" class="form-check-input" type="checkbox" role="switch" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Config Modal -->
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0 custom-modal-header pb-0">
              <div class="page-title">
                <h4>{{ selectedGw?.name }} Configuration</h4>
              </div>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="saveGateway">
                <div class="mb-3">
                  <label class="form-label">API Key / Account SID</label>
                  <input v-model="selectedGw!.apiKey" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">API Secret Key / Auth Token</label>
                  <input v-model="selectedGw!.apiSecret" type="password" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Sender ID / Phone Number</label>
                  <input v-model="selectedGw!.senderId" type="text" class="form-control" required placeholder="e.g. KACETAK" />
                </div>
                <div class="modal-footer modal-action-footer justify-content-end pt-3 border-top">
                  <button type="button" class="btn btn-light" @click="showModal = false">Cancel</button>
                  <button type="submit" class="btn btn-warning text-white">Save Changes</button>
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
  title: "SMS Gateways - Kacetak System",
});

type GatewayKey = "nexmo" | "twoFactor" | "twilio" | "zenziva";

interface GatewayConfig {
  name: string;
  desc: string;
  enabled: boolean;
  apiKey: string;
  apiSecret: string;
  senderId: string;
}

const gateways = ref<Record<GatewayKey, GatewayConfig>>({
  nexmo: {
    name: "Nexmo (Vonage)",
    desc: "Global SMS & OTP API provider",
    enabled: true,
    apiKey: "nx_live_89823472",
    apiSecret: "••••••••••••",
    senderId: "KACETAK",
  },
  twoFactor: {
    name: "2Factor SMS",
    desc: "High speed transactional SMS service",
    enabled: false,
    apiKey: "",
    apiSecret: "",
    senderId: "KACETAK",
  },
  twilio: {
    name: "Twilio SMS",
    desc: "Enterprise communications platform",
    enabled: false,
    apiKey: "",
    apiSecret: "",
    senderId: "+1234567890",
  },
  zenziva: {
    name: "Zenziva SMS / WhatsApp",
    desc: "Indonesian local SMS & WA Gateway",
    enabled: true,
    apiKey: "zen_live_091823",
    apiSecret: "••••••••••••",
    senderId: "KACETAK",
  },
});

const showModal = ref(false);
const activeKey = ref<GatewayKey>("nexmo");
const selectedGw = ref<GatewayConfig | null>(null);

const openConfigModal = (key: GatewayKey) => {
  activeKey.value = key;
  selectedGw.value = { ...gateways.value[key] };
  showModal.value = true;
};

const saveGateway = () => {
  if (selectedGw.value) {
    gateways.value[activeKey.value] = { ...selectedGw.value };
  }
  showModal.value = false;
  alert("SMS Gateway configuration updated successfully!");
};

const refresh = () => {
  // refresh
};

const toggleCollapse = () => {
  // collapse
};
</script>
