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
              <form @submit.prevent="saveLocalization">
                <div class="setting-title mb-4">
                  <h4 class="fs-18 fw-bold">Localization</h4>
                </div>

                <!-- Basic Information -->
                <div class="company-info bg-white p-4 rounded shadow-sm mb-4 border">
                  <div class="card-title-head mb-3 pb-2 border-bottom">
                    <h6 class="fw-bold mb-0 d-flex align-items-center gap-2">
                      <i class="ti ti-list text-primary fs-18"></i> Basic Information
                    </h6>
                  </div>
                  <div class="localization-info">
                    <!-- Language -->
                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Language</h6>
                          <p class="text-muted text-sm mb-0">Select default language of the system</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.language" class="form-select">
                          <option value="English">English</option>
                          <option value="Indonesian">Indonesian</option>
                          <option value="Spanish">Spanish</option>
                        </select>
                      </div>
                    </div>

                    <!-- Language Switcher -->
                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Language Switcher</h6>
                          <p class="text-muted text-sm mb-0">To display switcher in all pages header</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <div class="form-check form-switch mb-0">
                          <input v-model="form.languageSwitcher" class="form-check-input" type="checkbox" role="switch" />
                        </div>
                      </div>
                    </div>

                    <!-- Timezone -->
                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Timezone</h6>
                          <p class="text-muted text-sm mb-0">Select Timezone for logs and dates</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.timezone" class="form-select">
                          <option value="Asia/Jakarta">Asia/Jakarta (UTC+07:00)</option>
                          <option value="UTC+5:30">UTC 5:30</option>
                          <option value="UTC+11:00">(UTC+11:00) INR</option>
                        </select>
                      </div>
                    </div>

                    <!-- Date Format -->
                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Date format</h6>
                          <p class="text-muted text-sm mb-0">Select date format to display</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.dateFormat" class="form-select">
                          <option value="DD/MM/YYYY">22/07/2023 (DD/MM/YYYY)</option>
                          <option value="DD MMM YYYY">22 Jul 2023</option>
                          <option value="MMM DD YYYY">Jul 22 2023</option>
                          <option value="YYYY-MM-DD">2023-07-22 (ISO)</option>
                        </select>
                      </div>
                    </div>

                    <!-- Time Format -->
                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Time Format</h6>
                          <p class="text-muted text-sm mb-0">Select 12 or 24 hour clock</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.timeFormat" class="form-select">
                          <option value="12 Hours">12 Hours (AM/PM)</option>
                          <option value="24 Hours">24 Hours</option>
                        </select>
                      </div>
                    </div>

                    <!-- Financial Year -->
                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Financial Year</h6>
                          <p class="text-muted text-sm mb-0">Select active financial fiscal year</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.financialYear" class="form-select">
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                        </select>
                      </div>
                    </div>

                    <!-- Starting Month -->
                    <div class="row align-items-center mb-0">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Starting Month</h6>
                          <p class="text-muted text-sm mb-0">Select financial year opening month</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.startingMonth" class="form-select">
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Currency Settings -->
                <div class="company-info bg-white p-4 rounded shadow-sm mb-4 border">
                  <div class="card-title-head mb-3 pb-2 border-bottom">
                    <h6 class="fw-bold mb-0 d-flex align-items-center gap-2">
                      <i class="ti ti-credit-card text-primary fs-18"></i> Currency Settings
                    </h6>
                  </div>
                  <div class="localization-info">
                    <!-- Currency -->
                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Currency</h6>
                          <p class="text-muted text-sm mb-0">Select default system currency</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.currency" class="form-select">
                          <option value="IDR">Indonesia (Rupiah - IDR)</option>
                          <option value="USD">United States of America (USD)</option>
                          <option value="INR">India (Rupee - INR)</option>
                        </select>
                      </div>
                    </div>

                    <!-- Currency Symbol -->
                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Currency Symbol</h6>
                          <p class="text-muted text-sm mb-0">Select currency representation prefix</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.currencySymbol" class="form-select">
                          <option value="Rp">Rp</option>
                          <option value="$">$</option>
                          <option value="€">€</option>
                          <option value="¥">¥</option>
                        </select>
                      </div>
                    </div>

                    <!-- Currency Position -->
                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Currency Position</h6>
                          <p class="text-muted text-sm mb-0">Select placement before or after number</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.currencyPosition" class="form-select">
                          <option value="before">$100 (Prefix)</option>
                          <option value="after">100$ (Suffix)</option>
                        </select>
                      </div>
                    </div>

                    <!-- Decimal Separator -->
                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Decimal Separator</h6>
                          <p class="text-muted text-sm mb-0">Select decimal character</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.decimalSeparator" class="form-select">
                          <option value=",">, (Comma)</option>
                          <option value=".">. (Dot)</option>
                        </select>
                      </div>
                    </div>

                    <!-- Thousand Separator -->
                    <div class="row align-items-center mb-0">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Thousand Separator</h6>
                          <p class="text-muted text-sm mb-0">Select thousand grouping character</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.thousandSeparator" class="form-select">
                          <option value=".">. (Dot)</option>
                          <option value=",">, (Comma)</option>
                          <option value=" ">Space</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Country Settings -->
                <div class="company-info bg-white p-4 rounded shadow-sm mb-4 border">
                  <div class="card-title-head mb-3 pb-2 border-bottom">
                    <h6 class="fw-bold mb-0 d-flex align-items-center gap-2">
                      <i class="ti ti-map-pin text-primary fs-18"></i> Country Settings
                    </h6>
                  </div>
                  <div class="localization-info">
                    <div class="row align-items-center">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Countries Restriction</h6>
                          <p class="text-muted text-sm mb-0">Define geographic restriction policy</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <select v-model="form.countriesRestriction" class="form-select">
                          <option value="Allow All Countries">Allow All Countries</option>
                          <option value="Deny All Countries">Deny All Countries</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- File Settings -->
                <div class="company-info bg-white p-4 rounded shadow-sm mb-4 border">
                  <div class="card-title-head mb-3 pb-2 border-bottom">
                    <h6 class="fw-bold mb-0 d-flex align-items-center gap-2">
                      <i class="ti ti-files text-primary fs-18"></i> File Settings
                    </h6>
                  </div>
                  <div class="localization-info">
                    <!-- Allowed Files -->
                    <div class="row align-items-center mb-3">
                      <div class="col-sm-4">
                        <div class="setting-info">
                          <h6 class="fw-semibold mb-1">Allowed File Extensions</h6>
                          <p class="text-muted text-sm mb-0">Comma-separated allowed attachment types</p>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <input v-model="form.allowedFiles" type="text" class="form-control" />
                      </div>
                    </div>

                    <!-- Max File Size -->
                    <div class="row align-items-center">
                      <div class="col-sm-4">
                        <div class="setting-info mb-sm-0">
                          <h6 class="fw-semibold mb-1">Max File Size</h6>
                          <p class="text-muted text-sm mb-0">Maximum upload size in megabytes</p>
                        </div>
                      </div>
                      <div class="col-sm-4">
                        <div class="input-group">
                          <input v-model="form.maxFileSize" type="number" class="form-control" />
                          <span class="input-group-text">MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-footer-btn pt-3 d-flex justify-content-end">
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
  title: 'Localization Settings - Kacetak System'
})

const defaultForm = {
  language: 'English',
  languageSwitcher: true,
  timezone: 'Asia/Jakarta',
  dateFormat: 'DD MMM YYYY',
  timeFormat: '24 Hours',
  financialYear: '2024',
  startingMonth: 'January',
  currency: 'IDR',
  currencySymbol: 'Rp',
  currencyPosition: 'before',
  decimalSeparator: ',',
  thousandSeparator: '.',
  countriesRestriction: 'Allow All Countries',
  allowedFiles: 'JPG, GIF, PNG, PDF, ZIP, SVG',
  maxFileSize: 5000
}

const form = ref({ ...defaultForm })

const saveLocalization = () => {
  alert('Localization settings updated successfully!')
}

const resetForm = () => {
  form.value = { ...defaultForm }
}

const refresh = () => {
  // refresh
}

const toggleCollapse = () => {
  // collapse
}
</script>
