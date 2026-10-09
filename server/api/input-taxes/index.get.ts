import { defineEventHandler, getQuery } from 'h3'
import { getInputTaxes } from '#server/utils/taxDocumentData'
export default defineEventHandler((event) => { const q = getQuery(event); return { success: true, data: getInputTaxes({ search: typeof q.search === 'string' ? q.search : undefined, credited: typeof q.credited === 'string' ? q.credited : undefined, startDate: typeof q.startDate === 'string' ? q.startDate : undefined, endDate: typeof q.endDate === 'string' ? q.endDate : undefined }) } })
