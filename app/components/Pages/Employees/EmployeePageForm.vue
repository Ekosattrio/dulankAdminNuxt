<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import PageHeader from '~/components/Common/PageHeader.vue'
import AddressCascader from '~/components/Forms/AddressCascader.vue'
import { useEmployees } from '~/composables/useEmployees'

const props = withDefaults(
  defineProps<{
    mode?: 'add' | 'edit'
  }>(),
  {
    mode: 'add'
  }
)

const router = useRouter()

const isEdit = computed(() => props.mode === 'edit')

const { isLoading, selectPhoto, form, errorMessage, isSubmitting, departments, managers, submitForm } = useEmployeeEditor(computed(() => props.mode))
const showPassword = ref(false)
const showConfirmPassword = ref(false)
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <PageHeader
      :title="isEdit ? 'Edit Employee' : 'New Employee'"
      :subtitle="isEdit ? 'Update employee information' : 'Create new Employee'"
    >
      <template #actions>
        <NuxtLink
          to="/employees"
          class="inline-flex h-9 items-center gap-2 rounded-md bg-gray-800 px-4 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
        >
          <FeatherIcon name="arrow-left" size="16" />
          <span>Back to Employee List</span>
        </NuxtLink>
      </template>
    </PageHeader>

    <!-- Main Card Form -->
    <p v-if="errorMessage" role="alert" class="mb-4 text-sm text-red-600">{{ errorMessage }}</p>
    <p v-if="isLoading" class="text-sm" role="status">Memuat karyawan...</p>
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
                <input type="file" class="hidden" accept="image/jpeg,image/png,image/webp" @change="selectPhoto($event, 'avatar')" />
              </label>
            </div>

            <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-6 text-center hover:border-primary transition dark:border-gray-700">
              <div class="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <FeatherIcon name="credit-card" size="24" />
              </div>
              <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">Photo ID</span>
              <label class="mt-2 inline-block cursor-pointer text-xs font-medium text-blue-600 hover:underline">
                Upload Image
                <input type="file" class="hidden" accept="image/jpeg,image/png,image/webp" @change="selectPhoto($event, 'photoId')" />
              </label>
            </div>
          </div>

          <img v-if="form.avatar" :src="form.avatar" alt="Profile preview" class="h-20 w-20 rounded-lg object-cover" /><img v-if="form.photoId" :src="form.photoId" alt="Photo ID preview" class="h-20 w-32 rounded-lg object-cover" />
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
              <AddressCascader
                v-model="form.address"
                placeholder="Select Province, City, District"

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
              ><option value="">Pilih departemen</option><option v-for="department in departments" :key="department.id" :value="department.name">{{ department.name }}</option></select>
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

          <p class="text-xs">Password dan hak akses dikelola melalui <NuxtLink to="/user-admin" class="text-primary underline">User Admin</NuxtLink>. Pilih akun yang sudah dibuat untuk menghubungkannya ke karyawan.</p>
          <select v-model="form.userId" aria-label="Akun admin karyawan" class="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm">
            <option value="">Tanpa akun login</option><option v-for="manager in managers" :key="manager.id" :value="String(manager.id)">{{ manager.name }}</option>
          </select>
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
                  disabled
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
                  disabled
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
            class="inline-flex h-9 items-center rounded-md border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            :disabled="isSubmitting || isLoading"
            class="inline-flex h-9 items-center rounded-md bg-primary px-6 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
