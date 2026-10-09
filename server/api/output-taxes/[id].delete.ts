import { createError, defineEventHandler, getRouterParam } from 'h3'
import { deleteOutputTax } from '#server/utils/taxDocumentData'
export default defineEventHandler((event) => { const id = getRouterParam(event, 'id'); if (!id) throw createError({ statusCode: 400, statusMessage: 'ID Output Tax wajib disertakan.' }); deleteOutputTax(id); return { success: true, message: 'Output Tax berhasil dibatalkan.' } })

