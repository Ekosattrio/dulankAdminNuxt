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
              <form @submit.prevent="saveGdprSettings">
                <div class="setting-title mb-4">
                  <h4 class="fs-18 fw-bold">GDPR Cookies</h4>
                </div>
                <div class="company-info border-0 bg-white p-4 rounded shadow-sm">
                  <div class="localization-info">
                    <!-- Cookies Consent Text -->
                    <div class="row mb-4">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold">Cookies Consent Text</h6>
                          <p class="text-muted text-sm">Message displayed to visitors explaining cookies policy</p>
                        </div>
                      </div>
                      <div class="col-sm-8">
                        <textarea
                          v-model="form.consentText"
                          rows="4"
                          class="form-control"
                          placeholder="We use cookies to improve your experience on our site and show relevant content."
                        ></textarea>
                      </div>
                    </div>

                    <!-- Cookies Position -->
                    <div class="row align-items-center mb-4">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold">Cookies Position</h6>
                          <p class="text-muted text-sm">You can configure the popup position</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.position" class="form-select">
                          <option value="Left">Left</option>
                          <option value="Center">Center</option>
                          <option value="Right">Right</option>
                        </select>
                      </div>
                    </div>

                    <!-- Agree Button Text -->
                    <div class="row align-items-center mb-4">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold">Agree Button Text</h6>
                          <p class="text-muted text-sm">You can configure the button text here</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <input v-model="form.agreeText" type="text" class="form-control" />
                      </div>
                    </div>

                    <!-- Decline Button Text -->
                    <div class="row align-items-center mb-4">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold">Decline Button Text</h6>
                          <p class="text-muted text-sm">You can configure the decline text here</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <input v-model="form.declineText" type="text" class="form-control" />
                      </div>
                    </div>

                    <!-- Show Decline Button -->
                    <div class="row align-items-center mb-4">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold">Show Decline Button</h6>
                          <p class="text-muted text-sm">Allow users to reject non-essential cookies</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <div class="form-check form-switch mb-0">
                          <input v-model="form.showDecline" class="form-check-input" type="checkbox" role="switch" />
                        </div>
                      </div>
                    </div>

                    <!-- Link for Cookies Page -->
                    <div class="row align-items-center mb-4">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold">Link for Cookies Page</h6>
                          <p class="text-muted text-sm">URL to detailed cookie and privacy policy</p>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <input v-model="form.policyLink" type="text" class="form-control" placeholder="https://example.com/privacy-policy" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-footer-btn mt-4 pt-3 border-top d-flex justify-content-end">
                  <button type="button" class="btn btn-secondary me-2" @click="resetForm">Cancel</button>
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
import { ref } from 'vue'

useHead({
  title: 'GDPR Settings - Kacetak System'
})

const defaultSettings = {
  consentText: 'We use cookies to improve your user experience and analyze website traffic. By clicking Accept, you consent to our website cookie usage.',
  position: 'Right',
  agreeText: 'Agree',
  declineText: 'Decline',
  showDecline: true,
  policyLink: 'https://kacetak.com/privacy-policy'
}

const form = ref({ ...defaultSettings })

const saveGdprSettings = () => {
  alert('GDPR Cookie settings saved successfully!')
}

const resetForm = () => {
  form.value = { ...defaultSettings }
}

const refresh = () => {
  // refresh
}

const toggleCollapse = () => {
  // collapse
}
</script>
