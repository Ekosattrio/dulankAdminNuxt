<script setup lang="ts">
import { ref } from 'vue'
import type { PaymentGatewayKey, PaymentGatewayConfig } from '#server/types/payment-gateway'
import { usePaymentGateways } from '~/composables/usePaymentGateways'

const { gateways, pending, error, refresh, saveGateways } = usePaymentGateways()

const showModal = ref(false)
const activeKey = ref<PaymentGatewayKey>('midtrans')
const selectedGw = ref<PaymentGatewayConfig | null>(null)
const toastMessage = ref('')
const isSaving = ref(false)

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const openConfig = (key: PaymentGatewayKey) => {
  activeKey.value = key
  selectedGw.value = { ...gateways.value[key] }
  showModal.value = true
}

const handleSaveGateway = async () => {
  if (selectedGw.value) {
    selectedGw.value.enabled = true
    gateways.value[activeKey.value] = { ...selectedGw.value }
  }
  isSaving.value = true
  try {
    await saveGateways(gateways.value)
    showModal.value = false
    showToast('Payment gateway settings updated successfully!')
  } catch (err) {
    console.error('Failed to update payment gateway:', err)
  } finally {
    isSaving.value = false
  }
}

const handleToggleSwitch = async () => {
  try {
    await saveGateways(gateways.value)
    showToast('Payment gateway status updated.')
  } catch (err) {
    console.error('Failed to toggle payment gateway:', err)
  }
}
</script>

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
            <a title="Refresh" href="javascript:void(0);" @click="refresh()"><i class="ti ti-rotate"></i></a>
          </li>
        </ul>
      </div>

      <div v-if="toastMessage" class="alert alert-success alert-dismissible fade show" role="alert">
        {{ toastMessage }}
        <button type="button" class="btn-close" @click="toastMessage = ''"></button>
      </div>

      <div class="row">
        <div class="col-xl-12">
          <div class="settings-wrapper d-flex">
            <div class="settings-page-wrap w-100">
              <div class="setting-title mb-4">
                <h4 class="fs-18 fw-bold">Payment Gateway</h4>
              </div>

              <!-- Gateways Grid -->
              <div class="row g-4">
                <div v-for="(gw, key) in gateways" :key="key" class="col-xxl-4 col-xl-6 col-lg-12 col-md-6 d-flex">
                  <div class="card p-4 border shadow-sm w-100 d-flex flex-column justify-content-between">
                    <div>
                      <div class="d-flex align-items-center justify-content-between mb-3">
                        <div class="d-flex align-items-center gap-2">
                          <span class="fs-20 fw-bold text-dark">{{ gw.name }}</span>
                        </div>
                        <span :class="gw.enabled ? 'badge bg-success' : 'badge bg-secondary'">
                          {{ gw.enabled ? 'Connected' : 'Not Connected' }}
                        </span>
                      </div>
                      <p class="text-muted text-sm mb-4">{{ gw.desc }}</p>
                    </div>

                    <div class="d-flex align-items-center justify-content-between pt-3 border-top">
                      <button class="btn btn-sm btn-outline-primary" @click="openConfig(key as PaymentGatewayKey)">
                        <i class="ti ti-settings me-1"></i> {{ gw.enabled ? 'View Integration' : 'Connect Now' }}
                      </button>
                      <div class="form-check form-switch mb-0">
                        <input v-model="gw.enabled" class="form-check-input" type="checkbox" role="switch" @change="handleToggleSwitch" />
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
                <h4>{{ selectedGw?.name }} Integration</h4>
              </div>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body custom-modal-body">
              <form @submit.prevent="handleSaveGateway">
                <div class="mb-3">
                  <label class="form-label">Client ID / Server Key</label>
                  <input v-model="selectedGw!.clientKey" type="text" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Secret Key</label>
                  <input v-model="selectedGw!.secretKey" type="password" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Environment</label>
                  <select v-model="selectedGw!.mode" class="form-select">
                    <option value="sandbox">Sandbox / Testing</option>
                    <option value="production">Production / Live</option>
                  </select>
                </div>
                <div class="modal-footer modal-action-footer justify-content-end pt-3 border-top">
                  <button type="button" class="btn btn-light" @click="showModal = false">Cancel</button>
                  <button type="submit" class="btn btn-warning text-white" :disabled="isSaving">
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
