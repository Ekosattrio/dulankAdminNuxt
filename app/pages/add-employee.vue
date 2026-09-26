<script setup lang="ts">
const router = useRouter()

const form = reactive({
  fullName: '',
  gender: '',
  dob: '1995-01-01',
  joinDate: new Date().toISOString().split('T')[0],
  address: '',
  detailAddress: '',
  department: '',
  contactPerson1: '',
  contactPhone1: '',
  contactPerson2: '',
  contactPhone2: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const handleAddressSelect = (addr: { province?: string; city?: string; district?: string }) => {
  const parts = [addr.province, addr.city, addr.district].filter(Boolean)
  form.address = parts.join(', ')
}

const submitForm = () => {
  alert('Employee created successfully!')
  router.push('/employees')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="New Employee" subtitle="Create new Employee">
      <template #actions>
        <NuxtLink
          to="/employees"
          class="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700"
        >
          <FeatherIcon name="arrow-left" size="18" />
          <span>Back to Employee List</span>
        </NuxtLink>
      </template>
    </CommonPageHeader>

    <!-- Main Card Form -->
    <form @submit.prevent="submitForm">
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-8">
        <!-- 1. Employee Information -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <FeatherIcon name="info" size="18" class="text-primary" />
            <h6 class="text-base font-bold text-gray-900 dark:text-gray-100">Employee Information</h6>
          </div>

          <!-- Photo Uploads -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-6 text-center hover:border-primary transition dark:border-gray-700">
              <div class="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-primary">
                <FeatherIcon name="plus-circle" size="24" />
              </div>
              <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">Profile Photo</span>
              <label class="mt-2 inline-block cursor-pointer text-xs font-medium text-primary hover:underline">
                Upload Image
                <input type="file" class="hidden" accept="image/*" />
              </label>
            </div>

            <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-6 text-center hover:border-primary transition dark:border-gray-700">
              <div class="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <FeatherIcon name="credit-card" size="24" />
              </div>
              <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">Photo ID</span>
              <label class="mt-2 inline-block cursor-pointer text-xs font-medium text-blue-600 hover:underline">
                Upload Image
                <input type="file" class="hidden" accept="image/*" />
              </label>
            </div>
          </div>

          <!-- Fields -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                v-model="form.fullName"
                type="text"
                required
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Enter employee full name"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Gender</label>
              <select
                v-model="form.gender"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="">Choose</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Date of Birth</label>
              <input
                v-model="form.dob"
                type="date"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Joining Date</label>
              <input
                v-model="form.joinDate"
                type="date"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div class="relative">
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Address (Provinsi, Kota, Kecamatan)</label>
              <FormsAddressCascader
                v-model="form.address"
                placeholder="Select Province, City, District"
                @select="handleAddressSelect"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Detail Address</label>
              <input
                v-model="form.detailAddress"
                type="text"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Street name, RT/RW, House No."
              />
            </div>
          </div>
        </div>

        <!-- 2. Designation -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <FeatherIcon name="briefcase" size="18" class="text-primary" />
            <h6 class="text-base font-bold text-gray-900 dark:text-gray-100">Designation</h6>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Department</label>
              <select
                v-model="form.department"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="">Choose</option>
                <option value="Produksi">Produksi</option>
                <option value="Administrasi & Keuangan">Administrasi & Keuangan</option>
                <option value="Desain Grafis">Desain Grafis</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 3. Emergency Information -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <FeatherIcon name="phone-call" size="18" class="text-primary" />
            <h6 class="text-base font-bold text-gray-900 dark:text-gray-100">Emergency Information</h6>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Name Contact Person 1</label>
              <input
                v-model="form.contactPerson1"
                type="text"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Phone</label>
              <input
                v-model="form.contactPhone1"
                type="text"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Name Contact Person 2</label>
              <input
                v-model="form.contactPerson2"
                type="text"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Phone</label>
              <input
                v-model="form.contactPhone2"
                type="text"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
        </div>

        <!-- 4. Account Manager -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
            <FeatherIcon name="lock" size="18" class="text-primary" />
            <h6 class="text-base font-bold text-gray-900 dark:text-gray-100">Account Manager</h6>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Phone</label>
              <input
                v-model="form.phone"
                type="text"
                class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Password</label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 pe-10 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600"
                  @click="showPassword = !showPassword"
                >
                  <FeatherIcon :name="showPassword ? 'eye' : 'eye-off'" size="16" />
                </button>
              </div>
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
              <div class="relative">
                <input
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 pe-10 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <FeatherIcon :name="showConfirmPassword ? 'eye' : 'eye-off'" size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <NuxtLink
            to="/employees"
            class="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 transition"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            class="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

