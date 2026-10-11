import { listSalesContacts } from '#server/utils/salesContact'

export default defineEventHandler(() => createResponse(listSalesContacts()))
