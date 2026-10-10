<script setup lang="ts">
import type { UserAdmin } from '#server/types/user-management'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  user: UserAdmin | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: Partial<UserAdmin>]
}>()

const form = ref<{
  id?: string
  userId?: string
  name: string
  email: string
  phone: string
  role: 'Admin' | 'Manager' | 'Supervisor' | 'Staff'
  stores: string[]
  status: 'Active' | 'Inactive'
  avatar: string
  descriptions: string
}>({
  name: '',
  email: '',
  phone: '',
  role: 'Admin',
  stores: ['Toko Pusat'],
  status: 'Active',
  avatar: '/assets/img/users/user-01.jpg',
  descriptions: '',
})

const availableStores = ['Toko Pusat', 'Toko Cabang 1', 'Toko Cabang 2', 'Toko Cabang 3']

watch(
  () => props.user,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        userId: val.userId,
        name: val.name,
        email: val.email,
        phone: val.phone || '',
        role: val.role,
        stores: [...val.stores],
        status: val.status,
        avatar: val.avatar || '/assets/img/users/user-01.jpg',
        descriptions: val.descriptions || '',
      }
    } else {
      form.value = {
        name: '',
        email: '',
        phone: '',
        role: 'Admin',
        stores: ['Toko Pusat'],
        status: 'Active',
        avatar: '/assets/img/users/user-01.jpg',
        descriptions: '',
      }
    }
  },
  { immediate: true }
)

const toggleStore = (st: string) => {
  const idx = form.value.stores.indexOf(st)
  if (idx !== -1) {
    if (form.value.stores.length > 1) {
      form.value.stores.splice(idx, 1)
    }
  } else {
    form.value.stores.push(st)
  }
}

const onAvatarChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.value.avatar = URL.createObjectURL(target.files[0])
  }
}

const handleSubmit = () => {
  emit('submit', { ...form.value })
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="emit('close')" />

    <!-- Modal Box -->
    <div class="relative w-full max-w-xl rounded-xl bg-white shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {{ isEdit ? 'Edit User Admin' : 'Add New User Admin' }}
        </h3>
        <button
          type="button"
          class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          <FeatherIcon name="x" size="18" />
        </button>
      </div>

      <!-- Modal Body -->
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4 px-6 py-5 max-h-[75vh] overflow-y-auto">
          <!-- Avatar Upload -->
          <div class="flex items-center gap-4">
            <img
              :src="form.avatar || '/assets/img/users/user-01.jpg'"
              alt="Avatar"
              class="size-16 rounded-full border-2 border-gray-200 object-cover dark:border-gray-700"
            />
            <div>
              <label class="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                <FeatherIcon name="upload" size="14" />
                <span>Change Image</span>
                <input type="file" class="hidden" accept="image/*" @change="onAvatarChange" />
              </label>
              <p class="mt-1 text-[11px] text-gray-400">JPG, GIF, or PNG. Max size 2MB</p>
            </div>
          </div>

          <!-- Form Fields Grid -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Name *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="e.g. Budi Santoso"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Email *</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="budi@email.com"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Role *</label>
              <select
                v-model="form.role"
                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
              <select
                v-model="form.status"
                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <!-- Store Assignment Checkboxes -->
          <div>
            <label class="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">Assigned Stores *</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="st in availableStores"
                :key="st"
                type="button"
                :class="[
                  'rounded-md px-2.5 py-1 text-xs font-medium border transition-colors',
                  form.stores.includes(st)
                    ? 'border-[#FE9F43] bg-[#FE9F43]/10 text-[#FE9F43]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                ]"
                @click="toggleStore(st)"
              >
                {{ st }}
              </button>
            </div>
          </div>

          <!-- Descriptions -->
          <div>
            <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Descriptions / Notes</label>
            <textarea
              v-model="form.descriptions"
              rows="3"
              class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Operational responsibilities, branch details, etc..."
            />
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
          <button
            type="button"
            class="rounded-md border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="busy"
            class="inline-flex items-center gap-1.5 rounded-md bg-[#FE9F43] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#e08933] disabled:opacity-50"
          >
            <span v-if="busy">Saving...</span>
            <span v-else>{{ isEdit ? 'Update Admin' : 'Submit' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
