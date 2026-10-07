<script setup lang="ts">
import type { MemberUser } from '#server/types/user-management'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  member: MemberUser | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: Partial<MemberUser>]
}>()

const form = ref<{
  id?: string
  customerId?: string
  name: string
  email: string
  phone: string
  verifiedEmail: boolean
  subscription: boolean
  status: 'Active Member' | 'Suspended'
  avatar: string
}>({
  name: '',
  email: '',
  phone: '',
  verifiedEmail: true,
  subscription: true,
  status: 'Active Member',
  avatar: '/assets/img/users/user-01.jpg',
})

watch(
  () => props.member,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        customerId: val.customerId,
        name: val.name,
        email: val.email,
        phone: val.phone || '',
        verifiedEmail: val.verifiedEmail,
        subscription: val.subscription,
        status: val.status,
        avatar: val.avatar || '/assets/img/users/user-01.jpg',
      }
    } else {
      form.value = {
        name: '',
        email: '',
        phone: '',
        verifiedEmail: true,
        subscription: true,
        status: 'Active Member',
        avatar: '/assets/img/users/user-01.jpg',
      }
    }
  },
  { immediate: true }
)

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
          {{ isEdit ? 'Edit User Member' : 'Add New User Member' }}
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
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Customer Name *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="e.g. Budi Santoso"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Email Address *</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="budi@example.com"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Phone</label>
              <input
                v-model="form.phone"
                type="text"
                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="08123456789"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
              <select
                v-model="form.status"
                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="Active Member">Active Member</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <!-- Boolean Flags -->
          <div class="flex items-center gap-6 pt-2">
            <label class="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                v-model="form.verifiedEmail"
                type="checkbox"
                class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43]"
              />
              <span>Verified Email</span>
            </label>

            <label class="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                v-model="form.subscription"
                type="checkbox"
                class="size-4 rounded border-gray-300 text-[#FE9F43] focus:ring-[#FE9F43]"
              />
              <span>Newsletter Subscription</span>
            </label>
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
            <span v-else>{{ isEdit ? 'Update Member' : 'Submit' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
