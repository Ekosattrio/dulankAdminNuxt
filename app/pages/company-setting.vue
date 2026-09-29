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
                  <h4 class="fs-18 fw-bold">Company Settings</h4>
                </div>

                <!-- Company Information -->
                <div class="card p-4 border shadow-sm mb-4">
                  <div class="card-title-head mb-3 d-flex align-items-center">
                    <h6 class="fs-16 fw-semibold d-flex align-items-center gap-2 mb-0">
                      <span class="p-1 rounded bg-light-primary text-primary"><i class="ti ti-bolt"></i></span>
                      Company Information
                    </h6>
                  </div>
                  <div class="row g-3">
                    <div class="col-xl-4 col-lg-6 col-md-6">
                      <label class="form-label">Company Name</label>
                      <input v-model="form.name" type="text" class="form-control" />
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6">
                      <label class="form-label">Company Email Address</label>
                      <input v-model="form.email" type="email" class="form-control" />
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6">
                      <label class="form-label">Phone Number</label>
                      <input v-model="form.phone" type="text" class="form-control" />
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6">
                      <label class="form-label">Fax</label>
                      <input v-model="form.fax" type="text" class="form-control" />
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6">
                      <label class="form-label">Website</label>
                      <input v-model="form.website" type="text" class="form-control" />
                    </div>
                  </div>
                </div>

                <!-- Company Images -->
                <div class="card p-4 border shadow-sm mb-4">
                  <div class="card-title-head mb-4 d-flex align-items-center">
                    <h6 class="fs-16 fw-semibold d-flex align-items-center gap-2 mb-0">
                      <span class="p-1 rounded bg-light-warning text-warning"><i class="ti ti-photo"></i></span>
                      Company Images
                    </h6>
                  </div>
                  <div class="row g-4">
                    <div
                      v-for="(imgItem, idx) in imageItems"
                      :key="idx"
                      class="col-md-6 col-12 d-flex align-items-center justify-content-between p-3 border rounded"
                    >
                      <div>
                        <h6 class="fw-semibold mb-1">{{ imgItem.title }}</h6>
                        <p class="text-muted text-xs mb-2">{{ imgItem.desc }}</p>
                        <label class="btn btn-sm btn-outline-primary cursor-pointer mb-0">
                          <i class="ti ti-upload me-1"></i> Upload
                          <input type="file" class="d-none" accept="image/*" @change="e => onImageUpload(e, imgItem.key)" />
                        </label>
                      </div>
                      <div class="border rounded p-1" style="width: 70px; height: 70px;">
                        <img
                          :src="images[imgItem.key] || '/assets/img/logo-small.png'"
                          alt="Logo"
                          class="w-100 h-100 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Address -->
                <div class="card p-4 border shadow-sm mb-4">
                  <div class="card-title-head mb-3 d-flex align-items-center">
                    <h6 class="fs-16 fw-semibold d-flex align-items-center gap-2 mb-0">
                      <span class="p-1 rounded bg-light-success text-success"><i class="ti ti-map-pin"></i></span>
                      Address
                    </h6>
                  </div>
                  <div class="row g-3">
                    <div class="col-md-12">
                      <label class="form-label">Address</label>
                      <input v-model="form.address" type="text" class="form-control" />
                    </div>
                    <div class="col-xl-3 col-lg-4 col-md-6">
                      <label class="form-label">Country</label>
                      <input v-model="form.country" type="text" class="form-control" />
                    </div>
                    <div class="col-xl-3 col-lg-4 col-md-6">
                      <label class="form-label">State / Province</label>
                      <input v-model="form.province" type="text" class="form-control" />
                    </div>
                    <div class="col-xl-3 col-lg-4 col-md-6">
                      <label class="form-label">City</label>
                      <input v-model="form.city" type="text" class="form-control" />
                    </div>
                    <div class="col-xl-3 col-lg-4 col-md-6">
                      <label class="form-label">Postal Code</label>
                      <input v-model="form.postalCode" type="text" class="form-control" />
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-end gap-2 pt-2">
                  <button type="button" class="btn btn-light" @click="resetForm">Cancel</button>
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
  title: 'Company Settings - Kacetak System'
})

const form = ref({
  name: 'Dulank Printing / Kacetak',
  email: 'support@kacetak.com',
  phone: '+62 21-8889999',
  fax: '+62 21-8889990',
  website: 'https://kacetak.com',
  address: 'Jl. Merdeka No. 45',
  country: 'Indonesia',
  province: 'DKI Jakarta',
  city: 'Jakarta Selatan',
  postalCode: '12190'
})

const images = ref<Record<string, string>>({
  logo: '/assets/img/logo-small.png',
  icon: '/assets/img/logo-small.png',
  favicon: '/assets/img/kacetak.jpeg',
  darkLogo: '/assets/img/logo-small.png'
})

const imageItems = [
  { key: 'logo', title: 'Company Logo', desc: 'Upload Logo of your Company to display in website' },
  { key: 'icon', title: 'Company Icon', desc: 'Upload Icon of your Company to display in website' },
  { key: 'favicon', title: 'Favicon', desc: 'Upload Favicon of your Company to display in browser tab' },
  { key: 'darkLogo', title: 'Company Dark Logo', desc: 'Upload Logo for dark mode presentation' }
]

const onImageUpload = (e: Event, key: string) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    images.value[key] = URL.createObjectURL(target.files[0])
  }
}

const saveSettings = () => {
  alert('Company settings saved successfully!')
}

const resetForm = () => {
  // reset
}

const refresh = () => {
  // refresh
}

const toggleCollapse = () => {
  // collapse
}
</script>

