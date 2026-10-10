<script setup lang="ts">
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  informationLabel: string
  options: string[]
}>()

const emit = defineEmits<{
  close: []
  submit: [options: string[]]
}>()

const newOptionInput = ref('')
const localOptions = ref<string[]>([])

watch(
  () => props.open,
  (val) => {
    if (val) {
      localOptions.value = [...(props.options || [])]
      newOptionInput.value = ''
    }
  },
  { immediate: true },
)

function addOption() {
  const trimmed = newOptionInput.value.trim()
  if (!trimmed) return
  if (!localOptions.value.includes(trimmed)) {
    localOptions.value.push(trimmed)
  }
  newOptionInput.value = ''
}

function removeOption(index: number) {
  localOptions.value.splice(index, 1)
}

function handleSubmit() {
  emit('submit', [...localOptions.value])
  emit('close')
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Add Data Select"
    medium
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Information (Read-only) -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Information</label>
        <div :class="modalFormInputColClass">
          <input
            type="text"
            :value="informationLabel"
            readonly
            class="h-9 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          />
        </div>
      </div>

      <!-- Add Data Select Input -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Add Data Select</label>
        <div :class="modalFormInputColClass">
          <div class="flex items-center gap-2">
            <input
              v-model="newOptionInput"
              type="text"
              placeholder="e.g. Option name"
              :class="formControlClass"
              @keydown.enter.prevent="addOption"
            />
            <button
              type="button"
              class="h-9 shrink-0 rounded-md bg-[#ff9f43] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none"
              @click="addOption"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <!-- Data Select Saved Container -->
      <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <h6 class="mb-3 text-xs font-bold text-gray-800 dark:text-gray-200">Data Select Saved</h6>
        <div class="divide-y divide-gray-100 border-t border-gray-100 dark:divide-gray-800 dark:border-gray-800">
          <div
            v-for="(item, idx) in localOptions"
            :key="idx"
            class="flex items-center justify-between py-2.5 text-xs transition hover:bg-gray-50/50 dark:hover:bg-gray-800/40"
          >
            <span class="font-medium text-gray-700 dark:text-gray-300">{{ item }}</span>
            <button
              type="button"
              class="font-semibold text-[#ff9f43] hover:underline"
              @click="removeOption(idx)"
            >
              Hapus
            </button>
          </div>
          <div v-if="localOptions.length === 0" class="py-4 text-center text-xs text-gray-400">
            Belum ada data select.
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c] focus:outline-none"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none"
        >
          Submit
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
