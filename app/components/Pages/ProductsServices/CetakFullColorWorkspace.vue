<script setup lang="ts">
import { ref } from 'vue'
import type { CetakFullColorConfig } from '~/types/cetak-full-color'
import CalculationLogTable from '~/components/Pages/ProductsServices/CalculationLogTable.vue'
import CetakFullColorProductSection from '~/components/Pages/ProductsServices/CetakFullColorProductSection.vue'
import GenericSettingTable from '~/components/Pages/ProductsServices/GenericSettingTable.vue'
import PaperGramatureSection from '~/components/Pages/ProductsServices/PaperGramatureSection.vue'
import ProfitSettingSection from '~/components/Pages/ProductsServices/ProfitSettingSection.vue'
import SettingSidebarNav from '~/components/Pages/ProductsServices/SettingSidebarNav.vue'
import {
  cetakFullColorTabs,
  cetakFullColorSizeColumns,
  cetakFullColorSizeFields,
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
  cetakFullColorWorkflowStepColumns,
  cetakFullColorWorkflowStepFields
} from '~/utils/cetakFullColorSchemas'

const props = defineProps<{
  draft: CetakFullColorConfig
  busy?: boolean
}>()

const emit = defineEmits<{
  'update:draft': [val: CetakFullColorConfig]
  save: []
}>()

const activeTab = ref('products')
</script>

<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
    <!-- Left Sidebar -->
    <SettingSidebarNav
      v-model="activeTab"
      :tabs="cetakFullColorTabs"
      title="Setting And Optional"
    />

    <!-- Right Tab Content Pane -->
    <main class="min-w-0">
      <CetakFullColorProductSection
        v-if="activeTab === 'products'"
        :products="draft.products"
        :busy="busy"
        @update:products="draft.products = $event"
        @save="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'productSizes'"
        :model-value="draft.sizes"
        title="Product Size"
        add-label="Add Size"
        :columns="cetakFullColorSizeColumns"
        :fields="cetakFullColorSizeFields"
        :busy="busy"
        @update:model-value="draft.sizes = $event as any"
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
        :columns="cetakFullColorMachineColumns"
        :fields="cetakFullColorMachineFields"
        :busy="busy"
        with-workflow
        workflow-title="Work Flow Setting"
        @update:model-value="draft.machines = $event as any"
        @change="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'laminates'"
        :model-value="draft.laminates"
        title="Laminate Option"
        add-label="Add Laminate"
        :columns="cetakFullColorLaminateColumns"
        :fields="cetakFullColorLaminateFields"
        :busy="busy"
        with-workflow
        workflow-title="Work Flow Setting"
        @update:model-value="draft.laminates = $event as any"
        @change="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'folds'"
        :model-value="draft.folds"
        title="Fold Option"
        add-label="Add Fold"
        :columns="cetakFullColorFoldColumns"
        :fields="cetakFullColorFoldFields"
        :busy="busy"
        with-workflow
        workflow-title="Work Flow Setting"
        @update:model-value="draft.folds = $event as any"
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
        workflow-title="Work Flow Setting"
        @update:model-value="draft.printSides = $event as any"
        @change="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'components'"
        :model-value="draft.components"
        title="Component"
        add-label="Add Component"
        :columns="cetakFullColorComponentColumns"
        :fields="cetakFullColorComponentFields"
        :busy="busy"
        @update:model-value="draft.components = $event as any"
        @change="emit('save')"
      />

      <GenericSettingTable
        v-else-if="activeTab === 'workflowSteps'"
        :model-value="draft.workflowSteps"
        title="Work Flow Step Option"
        add-label="Add Step"
        :columns="cetakFullColorWorkflowStepColumns"
        :fields="cetakFullColorWorkflowStepFields"
        :busy="busy"
        @update:model-value="draft.workflowSteps = $event as any"
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
        v-else-if="activeTab === 'calculationLogs'"
        :logs="draft.logTransactions"
        title="Log Transaction"
      />
    </main>
  </div>
</template>
