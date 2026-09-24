import type { Quotation, QuotationFormData } from '~/types/quotation'

export default defineEventHandler(async (event) => {
  const body = await readBody<QuotationFormData>(event)

  if (!body || !body.customer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer name is required'
    })
  }

  const allQuotations = await readJSON<Quotation[]>('quotations.json', [])

  if (body.id) {
    // Update
    const idx = allQuotations.findIndex(q => q.id === body.id)
    if (idx !== -1) {
      allQuotations[idx] = {
        ...allQuotations[idx],
        customer: body.customer,
        email: body.email,
        status: body.status || 'Send',
        total: Number(body.total) || 0,
        channel: body.channel || 'Online',
        dueDate: body.dueDate || allQuotations[idx].dueDate
      }
      await writeJSON('quotations.json', allQuotations)
      return createResponse(allQuotations[idx], 'Quotation updated successfully')
    }
  }

  // Create
  const nextNum = String(allQuotations.length + 1).padStart(5, '0')
  const noQuotation = body.noQuotation || `QUO${nextNum}`
  const now = new Date()
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

  const newQuotation: Quotation = {
    id: String(Date.now()),
    noQuotation,
    date: dateStr,
    customer: body.customer,
    email: body.email,
    status: body.status || 'Send',
    dateStatus: dateStr,
    total: Number(body.total) || 0,
    channel: body.channel || 'Online',
    dueDate: body.dueDate || dateStr
  }

  allQuotations.unshift(newQuotation)
  await writeJSON('quotations.json', allQuotations)

  return createResponse(newQuotation, 'Quotation created successfully')
})

