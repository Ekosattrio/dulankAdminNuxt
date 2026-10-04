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

  function openPrintModal(action: 'print' | 'pdf' = 'print') {
    defaultPrintAction.value = action
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
    openPrintModal,
    closePrintModal,
    directPrint
  }
}
