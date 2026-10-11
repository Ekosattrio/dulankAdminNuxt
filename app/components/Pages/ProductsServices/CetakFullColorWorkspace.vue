<script setup lang="ts">
import { ref } from 'vue'
import type { CetakFullColorConfig } from '~/types/cetak-full-color'
import CetakFullColorLogTable from './CetakFullColorLogTable.vue'
import CetakFullColorProductSection from './CetakFullColorProductSection.vue'
import CetakFullColorProfitSection from './CetakFullColorProfitSection.vue'
import CetakFullColorSizeSection from './CetakFullColorSizeSection.vue'
import CetakFullColorWorkflowSequence from './CetakFullColorWorkflowSequence.vue'
import GenericSettingTable from './GenericSettingTable.vue'
import PaperGramatureSection from './PaperGramatureSection.vue'
import SettingSidebarNav from './SettingSidebarNav.vue'
import {
  cetakFullColorTabs,
  cetakFullColorMachineColumns,
  cetakFullColorMachineFields,
  cetakFullColorLaminateColumns,
  cetakFullColorLaminateFields,
  cetakFullColorFoldColumns,
  cetakFullColorFoldFields,
  cetakFullColorPrintSideColumns,
  cetakFullColorPrintSideFields,
  cetakFullColorComponentColumns,
  cetakFullColorComponentFields,
} from '~/utils/cetakFullColorSchemas'

defineProps<{ draft: CetakFullColorConfig; busy?: boolean }>()
const emit = defineEmits<{ 'update:draft': [value: CetakFullColorConfig]; save: [] }>()
const activeTab = ref('products')
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
    <SettingSidebarNav v-model="activeTab" :tabs="cetakFullColorTabs" title="Setting And Optional" />

    <main class="min-w-0">
      <CetakFullColorProductSection
        v-if="activeTab === 'products'"
        :products="draft.products"
        :busy="busy"
        @update:products="draft.products = $event"
        @save="emit('save')"
      />

      <CetakFullColorSizeSection
        v-else-if="activeTab === 'sizes'"
        :sizes="draft.sizes"
        :custom-size-enabled="draft.customSizeEnabled"
        :busy="busy"
        @update:sizes="draft.sizes = $event"
        @update:custom-size-enabled="draft.customSizeEnabled = $event; emit('save')"
        @save="emit('save')"
      />

      <PaperGramatureSection
        v-else-if="activeTab === 'papers'"
        :groups="draft.paperGroups"
        :workflow-items="draft.paperWorkflows"
        :busy="busy"
        @update:groups="draft.paperGroups = $event"
        @update:workflow-items="draft.paperWorkflows = $event"
        @save="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'machines'"
        :model-value="draft.machines"
        title="Machine Type Option"
        add-label="Add Offset Machine"
        :columns="cetakFullColorMachineColumns"
        :fields="cetakFullColorMachineFields"
        :busy="busy"
        with-workflow
        workflow-title="Work Flow Setting"
        workflow-target-label="Effective Printing Type"
        workflow-add-label="Add Flow Name"
        :workflow-items="draft.machineWorkflows"
        :workflow-options="['Ofsett', 'Digital A3']"
        @update:model-value="draft.machines = $event as any"
        @update:workflow-items="draft.machineWorkflows = $event"
        @change="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'laminates'"
        :model-value="draft.laminates"
        title="Laminate Option"
        add-label="Add Laminate Type"
        :columns="cetakFullColorLaminateColumns"
        :fields="cetakFullColorLaminateFields"
        :busy="busy"
        with-workflow
        workflow-title="Work Flow Setting"
        workflow-target-label="Effective Papper name"
        workflow-add-label="Add Process"
        :workflow-items="draft.laminateWorkflows"
        :workflow-options="draft.paperGroups.map(item => item.name)"
        @update:model-value="draft.laminates = $event as any"
        @update:workflow-items="draft.laminateWorkflows = $event"
        @change="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'folds'"
        :model-value="draft.folds"
        title="Fold Option"
        add-label="Add Fold Type"
        :columns="cetakFullColorFoldColumns"
        :fields="cetakFullColorFoldFields"
        :busy="busy"
        with-workflow
        workflow-title="Work Flow Setting"
        workflow-target-label="Effective Fold Type"
        workflow-add-label="Add Flow Name"
        :workflow-items="draft.foldWorkflows"
        :workflow-options="['1 lipatan', '2 lipatan']"
        @update:model-value="draft.folds = $event as any"
        @update:workflow-items="draft.foldWorkflows = $event"
        @change="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'printSides'"
        :model-value="draft.printSides"
        title="Print Side Option"
        add-label="Add Print Side"
        :columns="cetakFullColorPrintSideColumns"
        :fields="cetakFullColorPrintSideFields"
        :busy="busy"
        with-workflow
        workflow-title="Work Flow"
        workflow-target-label="Effective Print Side"
        workflow-add-label="Add Flow"
        :workflow-items="draft.printSideWorkflows"
        :workflow-options="['Cetak 1 Sisi', 'Cetak Bolak-Balik']"
        @update:model-value="draft.printSides = $event as any"
        @update:workflow-items="draft.printSideWorkflows = $event"
        @change="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'components'"
        :model-value="draft.components"
        title="Component Option"
        add-label="Add Component Type"
        :columns="cetakFullColorComponentColumns"
        :fields="cetakFullColorComponentFields"
        :busy="busy"
        with-workflow
        workflow-title="Work Flow Setting"
        workflow-target-label="Effective Component"
        workflow-add-label="Add Flow Name"
        :workflow-items="draft.componentWorkflows"
        :workflow-options="['1 lipatan', '2 lipatan']"
        @update:model-value="draft.components = $event as any"
        @update:workflow-items="draft.componentWorkflows = $event"
        @change="emit('save')"
      />

      <CetakFullColorWorkflowSequence
        v-else-if="activeTab === 'workflowSteps'"
        :items="draft.workflowSteps"
        @update:items="draft.workflowSteps = $event"
        @save="emit('save')"
      />

      <CetakFullColorProfitSection
        v-else-if="activeTab === 'profitSettings'"
        :settings="draft.profitSettings"
        :busy="busy"
        @update:settings="draft.profitSettings = $event"
        @save="emit('save')"
      />

      <CetakFullColorLogTable v-else-if="activeTab === 'logTransactions'" :logs="draft.logTransactions" />
    </main>
  </div>
</template>
