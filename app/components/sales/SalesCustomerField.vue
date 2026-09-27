<script setup lang="ts">
import type { SalesContact } from '#server/types/sales-document'
const model = defineModel<SalesContact>({ required: true })
withDefaults(defineProps<{ label?: string; allowNew?: boolean }>(), { label: 'Customer:', allowNew: true })
const emit = defineEmits<{ select: [contact: SalesContact] }>()
const { contacts, refresh } = useSalesContacts()
const fieldId = useId()
const adding = ref(false)
const saving = ref(false)
const error = ref('')
function select() {
  const selected = contacts.value.find((c) => c.name === model.value.name)
  if (selected) {
    model.value = { ...selected }
    emit('select', model.value)
  }
}
async function createCustomer() {
  if (saving.value) return
  if (!model.value.name.trim() || !model.value.email.trim()) {
    error.value = 'Name and email are required.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    const result = await $fetch<{ success: boolean; message?: string }>('/api/customers', {
      method: 'POST',
      body: { ...model.value, type: 'General', channel: 'Website' },
    })
    if (!result.success) throw new Error(result.message || 'Unable to add customer')
    await refresh()
    adding.value = false
    emit('select', model.value)
  } catch (e) {
    error.value = salesErrorMessage(e)
  } finally {
    saving.value = false
  }
}
</script>
<template>
  <div class="space-y-3 text-xs text-gray-700 dark:text-gray-300">
    <div class="flex items-center justify-between gap-3">
      <label :for="fieldId" class="font-medium">{{ label }}</label
      ><button
        v-if="allowNew"
        type="button"
        class="inline-flex items-center gap-1 text-primary"
        @click="adding = !adding"
      >
        <FeatherIcon name="plus-circle" :size="14" />Add New
      </button>
    </div>
    <input
      :id="fieldId"
      v-model="model.name"
      :list="fieldId + '-options'"
      :class="salesField"
      placeholder="Search Customer"
      required
      @input="select"
      @change="select"
    />
    <datalist :id="fieldId + '-options'">
      <option v-for="contact in contacts" :key="contact.name" :value="contact.name">
        {{ contact.phone }}
      </option>
    </datalist>
    <div v-if="adding" class="space-y-3 rounded-md border border-gray-200 p-3 dark:border-gray-700">
      <label :class="salesLabel">Email<input v-model="model.email" type="email" :class="salesField" /></label>
      <label :class="salesLabel">Phone<input v-model="model.phone" :class="salesField" /></label>
      <label :class="salesLabel"
        >Address<textarea v-model="model.address" :class="salesField" rows="2" />
      </label>
      <p v-if="error" role="alert" class="text-red-600">{{ error }}</p>
      <button type="button" :disabled="saving" :class="salesPrimaryButton" @click="createCustomer">
        {{ saving ? 'Saving...' : 'Save Customer' }}
      </button>
    </div>
    <div v-else-if="model.name" class="space-y-1 rounded-md bg-gray-50 p-3 leading-5 dark:bg-gray-800">
      <p class="font-medium">
        {{ model.name }} <span class="font-normal">{{ model.phone }}</span>
      </p>
      <p v-if="model.email">{{ model.email }}</p>
      <p v-if="model.address">{{ model.address }}</p>
    </div>
  </div>
</template>
