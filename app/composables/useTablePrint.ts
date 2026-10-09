import { ref } from 'vue'
import type { PrintColumn, PrintDocumentConfig } from '~/utils/documentPrinter'
import { printDocument } from '~/utils/documentPrinter'

export interface TablePrintOptions {
  title: string
  subtitle?: string
  columns: PrintColumn[]
  getItems: () => Record<string, any>[]
  getCurrentPageItems?: () => Record<string, any>[]
  dateField?: string
  getDateRange?: () => any
}

export function useTablePrint(options?: TablePrintOptions) {
  const isPrintModalOpen = ref(false)
  const defaultPrintAction = ref<'print' | 'pdf'>('print')
  const printTitle = ref(options?.title ?? '')
  const printSubtitle = ref(options?.subtitle ?? '')
  const printColumns = ref<PrintColumn[]>(options?.columns ?? [])
  const printRows = ref<Record<string, any>[]>(options?.getItems?.() ?? [])

  function openPrintModal(
    actionOrConfig: 'print' | 'pdf' | {
      title: string
      subtitle?: string
      columns: PrintColumn[]
      rows: Record<string, any>[]
      action?: 'print' | 'pdf'
    } = 'print',
  ) {
    if (typeof actionOrConfig === 'string') {
      defaultPrintAction.value = actionOrConfig
      if (options) {
        printTitle.value = options.title
        printSubtitle.value = options.subtitle ?? ''
        printColumns.value = options.columns
        printRows.value = options.getItems()
      }
    } else {
      defaultPrintAction.value = actionOrConfig.action ?? 'print'
      printTitle.value = actionOrConfig.title
      printSubtitle.value = actionOrConfig.subtitle ?? ''
      printColumns.value = actionOrConfig.columns
      printRows.value = actionOrConfig.rows
    }
    isPrintModalOpen.value = true
  }

  function closePrintModal() {
    isPrintModalOpen.value = false
  }

  function directPrint(config: PrintDocumentConfig) {
    printDocument(config)
  }

  return {
    isPrintModalOpen,
    defaultPrintAction,
    /** Compatibility alias retained for report workspaces. */
    printMode: defaultPrintAction,
    printTitle,
    printSubtitle,
    printColumns,
    printRows,
    openPrintModal,
    closePrintModal,
    directPrint
  }
}
