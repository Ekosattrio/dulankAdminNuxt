<script setup lang="ts">
import type { LanguageFormData, LanguageItem } from '#server/types/system-settings'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  language: LanguageItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: LanguageFormData]
}>()

const emptyForm = (): LanguageFormData => ({
  code: '',
  name: '',
  flag: '',
  rtl: false,
  totalKeys: 2145,
  doneKeys: 0,
  status: 'active',
  isDefault: false,
})

const form = ref<LanguageFormData>(emptyForm())
const errorMessage = ref('')

watch(
  [() => props.open, () => props.language],
  ([open, language]) => {
    if (!open) return
    form.value = language
      ? {
          id: language.id,
          code: language.code,
          name: language.name,
          flag: language.flag || '',
          rtl: language.rtl,
          totalKeys: language.totalKeys,
          doneKeys: language.doneKeys,
          status: language.status,
          isDefault: language.isDefault,
        }
      : emptyForm()
    errorMessage.value = ''
  },
  { immediate: true },
)

function submit() {
  const totalKeys = Number(form.value.totalKeys || 0)
  const doneKeys = Number(form.value.doneKeys || 0)
  if (!form.value.name.trim() || !form.value.code.trim()) {
    errorMessage.value = 'Language name and code are required.'
    return
  }
  if (totalKeys < 0 || doneKeys < 0 || doneKeys > totalKeys) {
    errorMessage.value = 'Done keys must be between 0 and total keys.'
    return
  }
  emit('submit', {
    ...form.value,
    code: form.value.code.trim().toLowerCase(),
    name: form.value.name.trim(),
    totalKeys,
    doneKeys,
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Language Settings' : 'Add Translation'"
    medium
    :busy="busy"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="errorMessage" class="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
        {{ errorMessage }}
      </p>

      <div :class="modalFormRowClass">
        <label for="language-name" :class="modalFormLabelClass">Language <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input id="language-name" v-model="form.name" :class="formControlClass" required placeholder="Bahasa Indonesia" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="language-code" :class="modalFormLabelClass">Code <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input id="language-code" v-model="form.code" :class="formControlClass" required maxlength="10" placeholder="id" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="language-flag" :class="modalFormLabelClass">Flag Asset</label>
        <div :class="modalFormInputColClass">
          <input id="language-flag" v-model="form.flag" :class="formControlClass" placeholder="/assets/img/icons/flag-04.svg" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="language-total" :class="modalFormLabelClass">Total Keys</label>
        <div :class="modalFormInputColClass">
          <input id="language-total" v-model.number="form.totalKeys" :class="formControlClass" type="number" min="0" step="1" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="language-done" :class="modalFormLabelClass">Done Keys</label>
        <div :class="modalFormInputColClass">
          <input id="language-done" v-model.number="form.doneKeys" :class="formControlClass" type="number" min="0" :max="form.totalKeys" step="1" />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="language-status" :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <select id="language-status" v-model="form.status" :class="formControlClass">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <span :class="modalFormLabelClass">Options</span>
        <div :class="[modalFormInputColClass, 'flex flex-wrap gap-4']">
          <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input v-model="form.rtl" type="checkbox" class="size-4 rounded border-gray-300 text-primary focus:ring-primary" />
            Right-to-left (RTL)
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input v-model="form.isDefault" type="checkbox" class="size-4 rounded border-gray-300 text-primary focus:ring-primary" />
            Default language
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button type="button" class="h-9 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" :disabled="busy" @click="emit('close')">
          Cancel
        </button>
        <button type="submit" class="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50" :disabled="busy">
          {{ busy ? 'Saving...' : 'Save Language' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
