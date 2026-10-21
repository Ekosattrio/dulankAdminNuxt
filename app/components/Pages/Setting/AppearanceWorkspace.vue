<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAppearance } from '~/composables/useAppearance'

const { settings, pending, error, refresh, saveSettings } = useAppearance()

const selectedTheme = ref('Light')
const selectedAccent = ref('orange')
const expandSidebar = ref(true)
const sidebarSize = ref('Large - 250px')
const fontFamily = ref('Nunito')

const toastMessage = ref('')
const isSaving = ref(false)

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

watch(
  settings,
  (val) => {
    if (val) {
      selectedTheme.value = val.theme || 'Light'
      selectedAccent.value = val.accent || 'orange'
      expandSidebar.value = val.expandSidebar ?? true
      sidebarSize.value = val.sidebarSize || 'Large - 250px'
      fontFamily.value = val.fontFamily || 'Nunito'
    }
  },
  { immediate: true }
)

const accentColors = [
  { name: 'orange', hex: '#ff9f43' },
  { name: 'violet', hex: '#7367f0' },
  { name: 'blue', hex: '#00cfe8' },
  { name: 'green', hex: '#28c76f' },
  { name: 'brown', hex: '#a86544' },
]

const handleSaveAppearance = async () => {
  isSaving.value = true
  try {
    await saveSettings({
      theme: selectedTheme.value,
      accent: selectedAccent.value,
      expandSidebar: expandSidebar.value,
      sidebarSize: sidebarSize.value,
      fontFamily: fontFamily.value
    })
    showToast('Appearance settings saved successfully!')
  } catch (err) {
    console.error('Failed to save appearance:', err)
  } finally {
    isSaving.value = false
  }
}

const resetForm = () => {
  refresh()
}
</script>

<template>
  <div class="space-y-6">
    <div class="page-header settings-pg-header mt-3">
        <div class="add-item d-flex">
          <div class="page-title">
            <h4>Settings</h4>
            <h6>Manage your settings on portal</h6>
          </div>
        </div>
        <ul class="table-top-head">
          <li>
            <a title="Refresh" href="javascript:void(0);" @click="refresh()"><FeatherIcon name="rotate-cw" :size="14" /></a>
          </li>
        </ul>
      </div>

      <ActionToast :message="toastMessage" @dismiss="toastMessage = ''" />

      <div class="row">
        <div class="col-xl-12">
          <div class="settings-wrapper d-flex">
            <div class="settings-page-wrap w-100">
              <form @submit.prevent="handleSaveAppearance">
                <div class="setting-title mb-4">
                  <h4 class="fs-18 fw-bold">Appearance</h4>
                </div>

                <div class="card p-4 border shadow-sm mb-4">
                  <!-- Select Theme -->
                  <div class="row align-items-center mb-4 pb-3 border-bottom">
                    <div class="col-xl-4 col-md-4">
                      <h6 class="fw-semibold mb-1">Select Theme Mode</h6>
                      <p class="text-muted text-xs mb-0">Choose base appearance of admin panel</p>
                    </div>
                    <div class="col-xl-8 col-md-8">
                      <div class="d-flex align-items-center gap-4">
                        <div
                          v-for="mode in ['Light', 'Dark', 'Automatic']"
                          :key="mode"
                          class="border rounded p-2 text-center cursor-pointer"
                          :class="selectedTheme === mode ? 'border-primary shadow-sm bg-light-primary' : 'border-light'"
                          style="min-width: 110px"
                          @click="selectedTheme = mode"
                        >
                          <div class="py-3 fs-24">
                            <FeatherIcon name="sun" :size="16" v-if="mode === 'Light'" class="text-warning" />
                            <FeatherIcon name="moon" :size="16" v-else-if="mode === 'Dark'" class="text-dark" />
                            <FeatherIcon name="monitor" :size="16" v-else class="text-primary" />
                          </div>
                          <span class="text-sm font-semibold d-block">{{ mode }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Accent Color -->
                  <div class="row align-items-center mb-4 pb-3 border-bottom">
                    <div class="col-xl-4 col-md-4">
                      <h6 class="fw-semibold mb-1">Accent Color</h6>
                      <p class="text-muted text-xs mb-0">Choose primary highlight colour of system</p>
                    </div>
                    <div class="col-xl-8 col-md-8">
                      <div class="d-flex align-items-center gap-3">
                        <div
                          v-for="color in accentColors"
                          :key="color.name"
                          class="rounded-circle cursor-pointer border position-relative"
                          :style="{ width: '36px', height: '36px', backgroundColor: color.hex }"
                          @click="selectedAccent = color.name"
                        >
                          <FeatherIcon name="check" :size="16"
                            v-if="selectedAccent === color.name"
                            class="text-white position-absolute top-50 start-50 translate-middle"
                           />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Expand Sidebar -->
                  <div class="row align-items-center mb-4 pb-3 border-bottom">
                    <div class="col-xl-4 col-md-4">
                      <h6 class="fw-semibold mb-1">Expand Sidebar by Default</h6>
                      <p class="text-muted text-xs mb-0">Keep sidebar full width on page load</p>
                    </div>
                    <div class="col-xl-8 col-md-8">
                      <div class="form-check form-switch mb-0">
                        <input v-model="expandSidebar" class="form-check-input" type="checkbox" role="switch" />
                      </div>
                    </div>
                  </div>

                  <!-- Sidebar Size -->
                  <div class="row align-items-center mb-4 pb-3 border-bottom">
                    <div class="col-xl-4 col-md-4">
                      <h6 class="fw-semibold mb-1">Sidebar Size</h6>
                      <p class="text-muted text-xs mb-0">Select width of the sidebar navigation</p>
                    </div>
                    <div class="col-xl-4 col-md-6">
                      <select v-model="sidebarSize" class="form-select">
                        <option value="Small - 85px">Small - 85px</option>
                        <option value="Large - 250px">Large - 250px</option>
                      </select>
                    </div>
                  </div>

                  <!-- Font Family -->
                  <div class="row align-items-center mb-4">
                    <div class="col-xl-4 col-md-4">
                      <h6 class="fw-semibold mb-1">Font Family</h6>
                      <p class="text-muted text-xs mb-0">Select typography font for user interface</p>
                    </div>
                    <div class="col-xl-4 col-md-6">
                      <select v-model="fontFamily" class="form-select">
                        <option value="Nunito">Nunito</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Inter">Inter</option>
                      </select>
                    </div>
                  </div>

                  <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                    <button type="button" class="btn btn-light" @click="resetForm">Cancel</button>
                    <button type="submit" class="btn btn-warning text-white" :disabled="isSaving">
                      {{ isSaving ? 'Saving...' : 'Save Changes' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
