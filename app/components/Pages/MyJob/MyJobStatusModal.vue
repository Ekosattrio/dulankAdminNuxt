<script setup lang="ts">
import type { MyJob, JobStatus } from '#server/types/my-job'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { modalFormRowClass, modalFormLabelClass, modalFormInputColClass, formControlClass } from '~/utils/salesUi'

interface Props {
  isOpen: boolean
  job: MyJob | null
  targetStatus: JobStatus | ''
  busy?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { status: JobStatus; qtyOk: string; qtyRusak: string }): void
}>()

const form = ref({
  qtyOk: '',
  qtyRusak: ''
})

watch(() => props.isOpen, (open) => {
  if (open) {
    form.value = {
      qtyOk: props.job?.qtyOk != null ? String(props.job.qtyOk) : '',
      qtyRusak: props.job?.qtyRusak != null ? String(props.job.qtyRusak) : ''
    }
  }
})

const handleClose = () => {
  if (!props.busy) {
    emit('close')
  }
}

const handleSubmit = () => {
  if (!props.targetStatus) return
  emit('submit', {
    status: props.targetStatus,
    qtyOk: form.value.qtyOk,
    qtyRusak: form.value.qtyRusak
  })
}
</script>

<template>
  <SalesDialog
    :open="isOpen"
    title="Konfirmasi Ubah Status"
    size="sm"
    :busy="busy"
    @close="handleClose"
  >
    <div v-if="job" class="space-y-4">
      <div class="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg text-xs text-amber-800 dark:text-amber-200">
        <p class="font-medium">Perubahan Status:</p>
        <p class="mt-0.5">
          <strong>{{ job.title }}</strong> &rarr; <span class="font-bold text-amber-900 dark:text-amber-100 uppercase">{{ targetStatus }}</span>
        </p>
      </div>

      <!-- 12-Column CSS Grid Form -->
      <div class="space-y-3">
        <!-- Qty Lembar OK -->
        <div :class="modalFormRowClass">
          <label for="qtyOk" :class="modalFormLabelClass">
            Qty Lembar OK ? <span class="text-red-500">*</span>
          </label>
          <div :class="modalFormInputColClass">
            <input
              id="qtyOk"
              v-model="form.qtyOk"
              type="number"
              min="0"
              placeholder="0"
              :class="formControlClass"
              :disabled="busy"
            />
          </div>
        </div>

        <!-- Lembar Rusak -->
        <div :class="modalFormRowClass">
          <label for="qtyRusak" :class="modalFormLabelClass">
            Lembar Rusak ? <span class="text-red-500">*</span>
          </label>
          <div :class="modalFormInputColClass">
            <input
              id="qtyRusak"
              v-model="form.qtyRusak"
              type="number"
              min="0"
              placeholder="0"
              :class="formControlClass"
              :disabled="busy"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          class="h-9 px-4 rounded-lg bg-[#212b36] hover:bg-gray-800 text-white text-xs font-medium transition-colors"
          :disabled="busy"
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          type="button"
          class="h-9 px-4 rounded-lg bg-[#ff9f43] hover:bg-[#e08933] text-white text-xs font-medium transition-colors disabled:opacity-50"
          :disabled="busy"
          @click="handleSubmit"
        >
          <span v-if="busy">Menyimpan...</span>
          <span v-else>Save</span>
        </button>
      </div>
    </template>
  </SalesDialog>
</template>
