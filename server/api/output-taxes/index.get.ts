import { defineEventHandler, getQuery } from 'h3'
import { getOutputTaxes } from '#server/utils/taxDocumentData'
export default defineEventHandler((event) => { const q = getQuery(event); return { success: true, data: getOutputTaxes({ search: typeof q.search === 'string' ? q.search : undefined, txCode: typeof q.txCode === 'string' ? q.txCode : undefined, startDate: typeof q.startDate === 'string' ? q.startDate : undefined, endDate: typeof q.endDate === 'string' ? q.endDate : undefined }) } })
