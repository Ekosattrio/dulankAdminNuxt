<script setup lang="ts">
import type { OrderProductItem } from './JobOrderProductSelector.vue'

const props = defineProps<{
  product: OrderProductItem
}>()

const emit = defineEmits<{
  (e: 'moveStep', idx: number, delta: number): void
  (e: 'removeStep', idx: number): void
  (e: 'addStep'): void
  (e: 'save'): void
}>()
</script>

<template>
  <div class="rounded-xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-800">
      <div>
        <h5 class="text-base font-bold text-gray-900 dark:text-white">
          Manage Job Order: {{ product.name }}
        </h5>
        <p class="text-xs text-gray-500 dark:text-gray-400">Job Title: {{ product.jobTitle }}</p>
      </div>
      <span class="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
        {{ product.priority }}
      </span>
    </div>

    <div class="p-5 md:p-6 space-y-6">
      <!-- Specs Overview -->
      <div class="grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60 md:grid-cols-12">
        <div class="md:col-span-3">
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Quantity</label>
          <div class="mt-1 text-sm font-bold text-gray-900 dark:text-white">{{ product.qty }}</div>
        </div>
        <div class="md:col-span-5">
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Description</label>
          <div class="mt-1 text-xs text-gray-700 dark:text-gray-300">{{ product.description || '-' }}</div>
        </div>
        <div class="md:col-span-4">
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Priority</label>
          <select
            v-model="product.priority"
            class="mt-1 h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-xs focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <!-- Workflow Steps List Header -->
      <div class="flex items-center justify-between">
        <h6 class="text-sm font-bold text-gray-900 dark:text-white">Sequential Workflow Steps</h6>
        <button
          type="button"
          class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/5 px-3 text-xs font-medium text-primary hover:bg-primary/10 transition"
          @click="emit('addStep')"
        >
          <i class="feather-plus text-xs"></i>
          Add Flow Step
        </button>
      </div>

      <!-- Steps cards -->
      <div class="space-y-3">
        <div
          v-for="(step, sIdx) in product.workflow"
          :key="step.id"
          class="rounded-xl border border-gray-200 bg-white p-4 transition shadow-xs dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-2.5">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white dark:bg-gray-100 dark:text-gray-900">
                {{ sIdx + 1 }}
              </span>
              <h6 class="text-sm font-bold text-primary">{{ step.flowName }}</h6>
            </div>
            <div class="flex items-center gap-1">
              <button
                v-if="sIdx > 0"
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                title="Move Up"
                @click="emit('moveStep', sIdx, -1)"
              >
                <i class="feather-arrow-up text-xs"></i>
              </button>
              <button
                v-if="sIdx < product.workflow.length - 1"
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                title="Move Down"
                @click="emit('moveStep', sIdx, 1)"
              >
                <i class="feather-arrow-down text-xs"></i>
              </button>
              <button
                type="button"
                class="ms-1 flex h-7 w-7 items-center justify-center rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/40"
                title="Remove Step"
                @click="emit('removeStep', sIdx)"
              >
                <i class="feather-trash-2 text-xs"></i>
              </button>
            </div>
          </div>

          <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Branch Destination</label>
              <select
                v-model="step.branch"
                class="mt-1 h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-xs focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="Dulank Karawang">Dulank Karawang</option>
                <option value="Dulank Jakarta">Dulank Jakarta</option>
                <option value="Dulank Cirebon">Dulank Cirebon</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Assigned Operator</label>
              <input
                v-model="step.assignee"
                type="text"
                class="mt-1 h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-xs focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Operator name"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400">Incentive (Rp)</label>
              <input
                v-model.number="step.incentive"
                type="number"
                class="mt-1 h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-xs focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <NuxtLink
          to="/orders"
          class="inline-flex h-9 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          Cancel
        </NuxtLink>
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-lg bg-amber-500 px-5 text-sm font-semibold text-white shadow-xs hover:bg-amber-600 transition"
          @click="emit('save')"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

