<script setup lang="ts">
import type { SalesContact } from '#server/types/sales-document'
import type { CustomerFormData } from '#server/types/customer'
import CustomerFormModal from '~/components/Pages/Customers/CustomerFormModal.vue'
const model = defineModel<SalesContact>({ required: true })
withDefaults(defineProps<{ label?: string; allowNew?: boolean }>(), { label: 'Customer:', allowNew: true })
const emit = defineEmits<{ select: [contact: SalesContact] }>()
const { contacts } = useSalesContacts()
const { saveCustomer } = useCustomers()
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
async function createCustomer(form: CustomerFormData) {
  if (saving.value) return
  saving.value = true
  error.value = ''
  try {
    const result = await saveCustomer(form)
    if (!result.success || !result.data) throw new Error(result.message || 'Unable to add customer')
    model.value = {
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      address: '',
    }
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
    <p v-if="error" role="alert" class="text-red-600">{{ error }}</p>
    <div v-if="model.name" class="space-y-1 rounded-md bg-gray-50 p-3 leading-5 dark:bg-gray-800">
      <p class="font-medium">
        {{ model.name }} <span class="font-normal">{{ model.phone }}</span>
      </p>
      <p v-if="model.email">{{ model.email }}</p>
      <p v-if="model.address">{{ model.address }}</p>
    </div>
    <CustomerFormModal
      :open="adding"
      :is-edit="false"
      :customer-data="null"
      :busy="saving"
      @close="adding = false"
      @submit="createCustomer"
    />
  </div>
</template>
