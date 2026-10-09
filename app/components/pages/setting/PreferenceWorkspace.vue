<script setup lang="ts">
import { ref } from 'vue'
import type { PreferenceItem } from '#server/types/preference-setting'
import { usePreferences } from '~/composables/usePreferences'

const { preferences, pending, error, refresh, savePreferences } = usePreferences()
const toastMessage = ref('')

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 2500)
}

const onToggle = async (pref: PreferenceItem) => {
  try {
    await savePreferences(preferences.value)
    showToast(`${pref.label} updated.`)
  } catch (err) {
    console.error('Failed to update preference:', err)
  }
}
</script>

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
                <h4 class="fs-18 fw-bold">Preference</h4>
              </div>
              <div class="row g-4">
                <div v-for="pref in preferences" :key="pref.key" class="col-xl-4 col-lg-6 col-md-4 col-sm-6">
                  <div class="connected-app-card border p-3 rounded bg-white shadow-sm">
                    <ul class="list-unstyled mb-0">
                      <li class="d-flex justify-content-between align-items-center">
                        <div class="security-type d-flex align-items-center gap-2">
                          <i :class="[pref.icon, 'text-primary fs-20']"></i>
                          <div class="security-title">
                            <h5 class="fw-bold mb-0 fs-16">{{ pref.label }}</h5>
                          </div>
                        </div>
                        <div class="form-check form-switch mb-0">
                          <input
                            v-model="pref.enabled"
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            @change="onToggle(pref)"
                          />
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
    </div>
  </div>
</template>
