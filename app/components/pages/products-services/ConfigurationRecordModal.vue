<script setup lang="ts">
import type { ConfigurationField } from '~/types/configuration'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'

const props = defineProps<{ open: boolean; title: string; fields: ConfigurationField[]; record?: Record<string, any> | null; busy?: boolean; error?: string }>()
const emit = defineEmits<{ close: []; submit: [record: Record<string, any>] }>()
const draft = reactive<Record<string, any>>({})

watch(() => [props.open, props.record, props.fields] as const, () => {
  if (!props.open) return
  for (const key of Object.keys(draft)) delete draft[key]
  for (const field of props.fields) draft[field.key] = props.record?.[field.key] ?? (field.type === 'boolean' ? true : field.type === 'number' || field.type === 'currency' ? 0 : '')
}, { immediate: true })

function submit() {
  const identity = props.record?.id ? { id: props.record.id } : props.record?.step ? { step: props.record.step } : {}
  emit('submit', { ...identity, ...draft })
}
</script>

<template>
  <SalesDialog :open="open" :title="title" medium :busy="busy" @close="$emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="error" role="alert" class="rounded-md bg-red-50 p-3 text-xs text-red-700">{{ error }}</p>
      <div v-for="field in fields" :key="field.key" :class="modalFormRowClass">
        <label :class="modalFormLabelClass">{{ field.label }}</label>
        <div :class="modalFormInputColClass">
          <label v-if="field.type === 'boolean'" class="flex min-h-9 items-center gap-2 text-sm"><input v-model="draft[field.key]" type="checkbox" class="size-4 rounded border-gray-300 text-primary" />{{ draft[field.key] ? 'Active' : 'Inactive' }}</label>
          <CurrencyInput v-else-if="field.type === 'currency'" v-model="draft[field.key]" prefix="Rp" :min="field.min ?? 0" />
          <input v-else v-model="draft[field.key]" :type="field.type === 'number' ? 'number' : 'text'" :min="field.min" :required="field.required" :class="formControlClass" />
        </div>
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4"><button type="button" class="h-9 rounded-md bg-gray-800 px-4 text-sm font-semibold text-white" :disabled="busy" @click="$emit('close')">Cancel</button><button type="submit" class="h-9 rounded-md bg-amber-500 px-4 text-sm font-semibold text-white disabled:opacity-50" :disabled="busy">{{ busy ? 'Saving...' : 'Save' }}</button></div>
    </form>
  </SalesDialog>
</template>
