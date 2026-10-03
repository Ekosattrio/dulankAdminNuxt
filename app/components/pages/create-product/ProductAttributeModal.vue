<script setup lang="ts">
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: { name: string; values: string[] }]
}>()

const attributeName = ref('')
const attributeValue = ref('')

watch(
  () => props.open,
  (val) => {
    if (val) {
      attributeName.value = ''
      attributeValue.value = ''
    }
  },
)

function handleSubmit() {
  const name = attributeName.value.trim()
  const rawValues = attributeValue.value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)

  if (name) {
    emit('submit', { name, values: rawValues })
  }
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Add Variation Attribute"
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Attribute Name <span class="text-red-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="attributeName"
            type="text"
            required
            placeholder="e.g. Color, Size, Material"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Values (comma-separated)</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="attributeValue"
            type="text"
            placeholder="e.g. Red, Blue, Green"
            :class="formControlClass"
          />
        </div>
      </div>

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
          class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none disabled:opacity-50"
          :disabled="!attributeName.trim()"
        >
          Submit
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
