import { defineEventHandler, readBody } from 'h3'
import { saveOutputTax } from '#server/utils/taxDocumentData'
import type { OutputTaxFormData } from '#server/types/tax-document'
export default defineEventHandler(async (event) => { const body = await readBody<OutputTaxFormData>(event); return { success: true, data: saveOutputTax(body), message: 'Output Tax berhasil diperbarui.' } })
