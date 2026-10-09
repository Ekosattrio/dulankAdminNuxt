<script setup lang="ts">
import { ref } from 'vue'
import type { CalendarConfig } from '#server/types/calendar-setting'
import CalculationLogTable from '~/components/pages/products-services/CalculationLogTable.vue'
import CalendarProductSection from '~/components/pages/products-services/CalendarProductSection.vue'
import GenericSettingTable from '~/components/pages/products-services/GenericSettingTable.vue'
import PaperGramatureSection from '~/components/pages/products-services/PaperGramatureSection.vue'
import ProfitSettingSection from '~/components/pages/products-services/ProfitSettingSection.vue'
import SheetOptionsSection from '~/components/pages/products-services/SheetOptionsSection.vue'
import SettingSidebarNav from '~/components/pages/products-services/SettingSidebarNav.vue'
import {
  calendarTabs,
  calendarSizeColumns,
  calendarSizeFields,
  calendarMachineColumns,
  calendarMachineFields,
  calendarPrintTypeColumns,
  calendarPrintTypeFields,
  calendarLaminateColumns,
  calendarLaminateFields,
  calendarHangerColumns,
  calendarHangerFields,
  calendarComponentColumns,
  calendarComponentFields,
  machineWorkflowItems,
  hangerWorkflowItems
} from '~/utils/calendarSchemas'

const props = defineProps<{
  draft: CalendarConfig
  busy?: boolean
}>()

const emit = defineEmits<{
  'update:draft': [val: CalendarConfig]
  save: []
}>()

const activeTab = ref('calendarProducts')
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
    <!-- Left Sidebar -->
    <SettingSidebarNav
      v-model="activeTab"
      :tabs="calendarTabs"
      title="Setting And Optional"
    />

    <!-- Right Tab Content Pane -->
    <main class="min-w-0">
      <CalendarProductSection
        v-if="activeTab === 'calendarProducts'"
        :products="draft.calendarProducts"
        :busy="busy"
        @update:products="draft.calendarProducts = $event"
        @save="emit('save')"
      />

      <SheetOptionsSection
        v-else-if="activeTab === 'sheetOptions'"
        :options="draft.sheetOptions"
        :busy="busy"
        @update:options="draft.sheetOptions = $event"
        @save="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'calendarSizes'"
        :model-value="draft.calendarSizes"
        title="Product Size"
        add-label="Add Size"
        :columns="calendarSizeColumns"
        :fields="calendarSizeFields"
        :busy="busy"
        @update:model-value="draft.calendarSizes = $event as any"
        @change="emit('save')"
      />

      <PaperGramatureSection
        v-else-if="activeTab === 'papers'"
        :busy="busy"
        @save="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'machines'"
        :model-value="draft.machines"
        title="Machine Type Option"
        add-label="Add Machine"
        :columns="calendarMachineColumns"
        :fields="calendarMachineFields"
        :busy="busy"
        with-workflow
        workflow-title="Work Flow Setting"
        :default-workflow-items="machineWorkflowItems"
        @update:model-value="draft.machines = $event as any"
        @change="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'printTypes'"
        :model-value="draft.printTypes"
        title="Print Type Option"
        add-label="Add Print Type"
        :columns="calendarPrintTypeColumns"
        :fields="calendarPrintTypeFields"
        :busy="busy"
        with-workflow
        workflow-title="Work Flow Setting"
        @update:model-value="draft.printTypes = $event as any"
        @change="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'laminates'"
        :model-value="draft.laminates"
        title="Laminate Option"
        add-label="Add Laminate"
        :columns="calendarLaminateColumns"
        :fields="calendarLaminateFields"
        :busy="busy"
        with-workflow
        workflow-title="Work Flow Setting"
        @update:model-value="draft.laminates = $event as any"
        @change="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'hangers'"
        :model-value="draft.hangers"
        title="Hanger Option"
        add-label="Add Hanger"
        :columns="calendarHangerColumns"
        :fields="calendarHangerFields"
        :busy="busy"
        with-workflow
        workflow-title="Work Flow Setting"
        :default-workflow-items="hangerWorkflowItems"
        @update:model-value="draft.hangers = $event as any"
        @change="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'components'"
        :model-value="draft.components"
        title="Component"
        add-label="Add Component"
        :columns="calendarComponentColumns"
        :fields="calendarComponentFields"
        :busy="busy"
        @update:model-value="draft.components = $event as any"
        @change="emit('save')"
      />

      <ProfitSettingSection
        v-else-if="activeTab === 'profitTiers'"
        :tiers="draft.profitTiers"
        :busy="busy"
        @update:tiers="draft.profitTiers = $event"
        @save="emit('save')"
      />

      <CalculationLogTable
        v-else-if="activeTab === 'calendarLogs'"
        :logs="draft.calendarLogs"
        title="Log Transaction"
      />
    </main>
  </div>
</template>
