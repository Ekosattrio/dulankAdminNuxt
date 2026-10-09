import { defineEventHandler, readBody } from 'h3'
import { saveInputTax } from '#server/utils/taxDocumentData'
import type { InputTaxFormData } from '#server/types/tax-document'
export default defineEventHandler(async (event) => { const body = await readBody<InputTaxFormData>(event); return { success: true, data: saveInputTax(body), message: 'Input Tax berhasil diperbarui.' } })
