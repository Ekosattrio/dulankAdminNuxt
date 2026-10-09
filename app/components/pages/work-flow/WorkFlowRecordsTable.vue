<script setup lang="ts">
import type { WorkFlow } from "#server/types/work-flow";
import type { DateRangeValue } from "~/composables/useDateRange";
import DateRangePicker from "~/components/common/DateRangePicker.vue";
import TableFilterSelect from "~/components/common/TableFilterSelect.vue";
import SalesActionButton from "~/components/sales/SalesActionButton.vue";
import SalesDataTable from "~/components/sales/SalesDataTable.vue";

const props = defineProps<{
  workFlows: WorkFlow[];
  searchQuery: string;
  filterCategory: string;
  filterDateRange: DateRangeValue | null;
}>();

const emit = defineEmits<{
  "update:searchQuery": [value: string];
  "update:filterCategory": [value: string];
  "update:filterDateRange": [value: DateRangeValue | null];
  edit: [item: WorkFlow];
  delete: [item: WorkFlow];
}>();

const categories = ["Offset", "Large Format", "Digital A3+", "Sablon"];
const selectedIds = ref<string[]>([]);

const allSelected = computed(() => {
  return (
    props.workFlows.length > 0 &&
    props.workFlows.every((w) => selectedIds.value.includes(w.id))
  );
});

function toggleSelectAll(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    selectedIds.value = props.workFlows.map((w) => w.id);
  } else {
    selectedIds.value = [];
  }
}

function toggleSelect(id: string) {
  const idx = selectedIds.value.indexOf(id);
  if (idx === -1) {
    selectedIds.value.push(id);
  } else {
    selectedIds.value.splice(idx, 1);
  }
}

const columns = [
  { key: "select", label: "", sortable: false, class: "w-10 text-center !px-3" },
  { key: "no", label: "No", sortable: true },
  { key: "category", label: "Product Category", sortable: true },
  { key: "product", label: "Product", sortable: true },
  { key: "workflowSteps", label: "Work Flow", sortable: false, class: "!whitespace-normal min-w-[260px]" },
  { key: "actions", label: "Action", sortable: false, align: "center", class: "w-28 text-center min-w-[100px] whitespace-nowrap" },
];
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="workFlows"
    :search="searchQuery"
    search-placeholder="Search..."
    @update:search="$emit('update:searchQuery', $event)"
  >
    <template #filters>
      <!-- Category Filter (Reusable TableFilterSelect) -->
      <TableFilterSelect
        :model-value="filterCategory"
        :options="categories"
        placeholder="All Categories"
        aria-label="Filter Category"
        @update:model-value="$emit('update:filterCategory', $event)"
      />

      <!-- Date Range Picker -->
      <DateRangePicker
        :model-value="filterDateRange"
        aria-label="Date"
        input-class="w-44 max-w-44"
        align="end"
        placeholder="Date"
        @update:model-value="$emit('update:filterDateRange', $event)"
      />
    </template>

    <template #header(select)>
      <div class="flex items-center justify-center">
        <input
          type="checkbox"
          :checked="allSelected"
          class="size-4 cursor-pointer rounded border-gray-300 text-primary accent-primary focus:ring-primary/20"
          aria-label="Select all rows"
          @change="toggleSelectAll"
        />
      </div>
    </template>

    <template #cell(select)="{ item }">
      <div class="flex items-center justify-center">
        <input
          type="checkbox"
          :checked="selectedIds.includes(item.id)"
          class="size-4 cursor-pointer rounded border-gray-300 text-primary accent-primary focus:ring-primary/20"
          :aria-label="`Select row ${item.no}`"
          @change="toggleSelect(item.id)"
        />
      </div>
    </template>

    <template #cell(no)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.no }}</span>
    </template>

    <template #cell(category)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">{{ item.category }}</span>
    </template>

    <template #cell(product)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.product }}</span>
    </template>

    <template #cell(workflowSteps)="{ item }">
      <div class="min-w-[260px] max-w-lg break-words text-xs leading-relaxed text-gray-700 dark:text-gray-300">
        {{ item.workflowSteps }}
      </div>
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5 whitespace-nowrap flex-nowrap shrink-0">
        <SalesActionButton icon="edit" label="Edit" :to="`/edit-work-flow?id=${item.id}`" />
        <SalesActionButton icon="trash-2" label="Delete" @click="$emit('delete', item)" />
      </div>
    </template>
  </SalesDataTable>
</template>
