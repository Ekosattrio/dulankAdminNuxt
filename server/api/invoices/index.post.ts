import type { Invoice, InvoiceFormData } from '~/types/invoice'

export default defineEventHandler(async (event) => {
  const body = await readBody<InvoiceFormData>(event)

  if (!body || !body.customer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer name is required'
    })
  }

  const allInvoices = await readJSON<Invoice[]>('invoices.json', [])

  const amount = Number(body.amount) || 0
  const paid = Number(body.paid) || 0
  const amountDue = Math.max(0, amount - paid)

  let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid'
  if (paid >= amount && amount > 0) {
    status = 'Paid'
  } else if (paid > 0) {
    status = 'Partial'
  }

  if (body.id) {
    // Update
    const idx = allInvoices.findIndex(i => i.id === body.id)
    if (idx !== -1) {
      allInvoices[idx] = {
        ...allInvoices[idx],
        customer: body.customer,
        dueDate: body.dueDate || allInvoices[idx].dueDate,
        amount,
        paid,
        amountDue,
        status: (body.status as any) || status
      }
      await writeJSON('invoices.json', allInvoices)
      return createResponse(allInvoices[idx], 'Invoice updated successfully')
    }
  }

  // Create
  const nextNum = String(allInvoices.length + 1).padStart(5, '0')
  const invoiceNo = body.invoiceNo || `INV${nextNum}`
  const now = new Date()
  const due = new Date()
  due.setDate(due.getDate() + 30)
  const dueStr = `${String(due.getDate()).padStart(2, '0')}/${String(due.getMonth() + 1).padStart(2, '0')}/${due.getFullYear()}`

  const newInvoice: Invoice = {
    id: String(Date.now()),
    invoiceNo,
    customer: body.customer,
    dueDate: body.dueDate || dueStr,
    amount,
    paid,
    amountDue,
    status: (body.status as any) || status
  }

  allInvoices.unshift(newInvoice)
  await writeJSON('invoices.json', allInvoices)

  return createResponse(newInvoice, 'Invoice created successfully')
})

