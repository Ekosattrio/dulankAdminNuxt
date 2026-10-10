<script setup lang="ts">
import type { Department, DepartmentFormData } from '#server/types/department'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  departmentData: Department | null
  availableMembers?: string[]
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: DepartmentFormData]
}>()

const form = ref<DepartmentFormData>({
  name: '',
  members: [],
  status: 'Active',
})

const selectedMembers = ref<string[]>([])
const newMemberInput = ref('')
const errorMessage = ref('')

watch(
  () => props.departmentData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        name: val.name,
        members: [...(val.members || [])],
        createdDate: val.createdDate,
        status: val.status,
      }
      selectedMembers.value = [...(val.members || [])]
    } else {
      form.value = {
        name: '',
        members: [],
        status: 'Active',
      }
      selectedMembers.value = []
    }
    newMemberInput.value = ''
    errorMessage.value = ''
  },
  { immediate: true }
)

function addMember(nameToAdd: string) {
  const trimmed = nameToAdd.trim()
  if (!trimmed) return
  if (!selectedMembers.value.includes(trimmed)) {
    selectedMembers.value.push(trimmed)
  }
  newMemberInput.value = ''
}

function removeMember(nameToRemove: string) {
  selectedMembers.value = selectedMembers.value.filter(m => m !== nameToRemove)
}

function handleAddKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addMember(newMemberInput.value)
  }
}

function handleSubmit() {
  if (!form.value.name?.trim()) {
    errorMessage.value = 'Department name is required'
    return
  }

  // Also include anything typed into input
  if (newMemberInput.value.trim()) {
    addMember(newMemberInput.value)
  }

  errorMessage.value = ''
  emit('submit', {
    ...form.value,
    name: form.value.name.trim(),
    members: selectedMembers.value,
    totalMembers: selectedMembers.value.length,
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Department' : 'Add New Department'"
    medium
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-lg bg-rose-50 p-3 text-xs text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- Department Name -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Department Name <span class="text-rose-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="e.g. Produksi, Administrasi, Desain, Marketing"
            :class="formControlClass"
          >
        </div>
      </div>

      <!-- Add / Select Members -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Members
        </label>
        <div :class="modalFormInputColClass">
          <!-- Member Chips -->
          <div class="mb-2 flex flex-wrap items-center gap-1.5 min-h-[34px] rounded-lg border border-gray-200 bg-gray-50/50 p-2 dark:border-gray-700 dark:bg-gray-800/40">
            <template v-if="selectedMembers.length > 0">
              <span
                v-for="member in selectedMembers"
                :key="member"
                class="inline-flex items-center gap-1 rounded-md bg-white border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-2xs dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                <span>{{ member }}</span>
                <button
                  type="button"
                  class="text-gray-400 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400"
                  title="Remove member"
                  @click="removeMember(member)"
                >
                  <FeatherIcon name="x" size="13" />
                </button>
              </span>
            </template>
            <span v-else class="text-xs text-gray-400">
              No members assigned yet. Type or pick below.
            </span>
          </div>

          <!-- Input to add custom member -->
          <div class="flex items-center gap-2">
            <input
              v-model="newMemberInput"
              type="text"
              placeholder="Type member name & press enter..."
              :class="formControlClass"
              @keydown="handleAddKeydown"
            >
            <button
              type="button"
              class="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              @click="addMember(newMemberInput)"
            >
              <FeatherIcon name="plus" size="14" />
              <span>Add</span>
            </button>
          </div>

          <!-- Quick pick suggestions if available -->
          <div v-if="availableMembers && availableMembers.length > 0" class="mt-2.5">
            <span class="text-[11px] font-medium text-gray-500 dark:text-gray-400">
              Quick pick from employee list:
            </span>
            <div class="mt-1 flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              <button
                v-for="candidate in availableMembers.filter(m => !selectedMembers.includes(m))"
                :key="candidate"
                type="button"
                class="inline-flex items-center rounded-md border border-dashed border-gray-300 bg-transparent px-2 py-0.5 text-[11px] text-gray-600 hover:border-primary hover:text-primary dark:border-gray-600 dark:text-gray-300 dark:hover:border-primary-400 dark:hover:text-primary-400"
                @click="addMember(candidate)"
              >
                + {{ candidate }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Toggle / Select -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Status
        </label>
        <div :class="modalFormInputColClass">
          <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800/40">
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ form.status === 'Active' ? 'Active' : 'Disable' }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ form.status === 'Active' ? 'Department is currently operational' : 'Department is disabled or non-active' }}
              </span>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                class="peer sr-only"
                :checked="form.status === 'Active'"
                @change="form.status = ($event.target as HTMLInputElement).checked ? 'Active' : 'Disable'"
              >
              <div class="h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700"></div>
            </label>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          :disabled="busy"
          @click="handleSubmit"
        >
          <span v-if="busy" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>{{ isEdit ? 'Update Department' : 'Save Department' }}</span>
        </button>
      </div>
    </template>
  </SalesDialog>
</template>
