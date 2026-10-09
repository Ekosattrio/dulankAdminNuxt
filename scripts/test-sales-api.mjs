import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

// Production Nitro runs in a temporary working directory: mutations never touch
// the developer's data/ or the source JSON in server/data/.
const root = fileURLToPath(new URL('..', import.meta.url))
const cwd = await mkdtemp(join(tmpdir(), 'dulank-sales-api-'))
const probe = createServer()
await new Promise((resolve) => probe.listen(0, '127.0.0.1', resolve))
const port = probe.address().port
await new Promise((resolve) => probe.close(resolve))
const child = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], {
  cwd,
  windowsHide: true,
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let output = ''
child.stdout.on('data', (chunk) => {
  output += chunk
})
child.stderr.on('data', (chunk) => {
  output += chunk
})
const base = `http://127.0.0.1:${port}`
const checks = []
async function request(path, method = 'GET', body, status = 200) {
  const response = await fetch(base + path, {
    method,
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
  assert.equal(response.status, status, `${method} ${path}: ${await response.clone().text()}`)
  const json = await response.json()
  if (status === 200) assert.equal(json.success, true)
  return json.data
}
try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(output)
    try {
      ready = (await fetch(base + '/api/sales')).ok
    } catch {}
    if (ready) break
    await delay(100)
  }
  assert.ok(ready, `Nitro did not start: ${output}`)
  const cases = [
    [
      'sales',
      {
        customer: 'API Test Sale',
        subTotal: 100000,
        discount: 10000,
        deliveryFee: 5000,
        tax: 9000,
        status: 'Paid',
        channel: 'POS',
        method: 'Cash',
      },
      'saleNo',
    ],
    [
      'invoices',
      { customer: 'API Test Invoice', dueDate: '30/09/2026', amount: 100000, paid: 25000 },
      'invoiceNo',
    ],
    [
      'delivery-notes',
      {
        customer: 'API Test Delivery',
        noSales: 'PT001',
        shippingAddress: 'Test Address',
        status: 'Pending',
        po: 'PO-TEST',
        shippingBy: 'Motorcycle',
        reference: 'TEST',
        items: [{ description: 'Print order', qty: 10, unit: 'Pcs', packingQty: '1 Box', weight: '1' }],
      },
      'dnNo',
    ],
    [
      'quotations',
      {
        customer: 'API Test Quote',
        email: 'test@example.com',
        status: 'Pending',
        total: 123000,
        channel: 'Offline',
        dueDate: '30/09/2026',
      },
      'noQuotation',
    ],
  ]
  for (const [resource, payload, code] of cases) {
    const original = await request('/api/' + resource)
    assert.ok(original.length > 0, resource + ' source records should be available')
    const created = await request('/api/' + resource, 'POST', payload)
    assert.ok(created.id && created[code])
    if (resource === 'sales') assert.equal(created.total, 104000)
    if (resource === 'invoices') {
      assert.equal(created.amountDue, 75000)
      assert.equal(created.status, 'Partial')
    }
    const updated = await request('/api/' + resource, 'POST', {
      ...payload,
      id: created.id,
      customer: payload.customer + ' edited',
    })
    assert.equal(updated.customer, payload.customer + ' edited')
    assert.equal((await request('/api/' + resource)).length, original.length + 1)
    await request('/api/' + resource, 'POST', { ...payload, id: 'missing-record' }, 404)
    await request('/api/' + resource + '/' + created.id, 'DELETE')
    assert.equal((await request('/api/' + resource)).length, original.length)
    checks.push(resource + ': source data, create, update, missing ID, delete')
  }
  await request('/api/sales', 'POST', { customer: 'Invalid amount', subTotal: -1 }, 400)
  const item = {
    id: 'cart-test',
    productId: 'p1',
    code: 'PT0001',
    name: 'Printed brochure',
    category: 'cetak',
    price: 1000,
    qty: 2,
    specs: 'A4',
    jobTitle: 'Test print',
  }
  const order = await request('/api/sales', 'POST', {
    customer: 'POS Test',
    subTotal: 2000,
    channel: 'POS',
    status: 'Paid',
    items: [item],
  })
  assert.deepEqual(order.items, [item])
  checks.push('POS: line items and printing specifications persist')

  const rfqs = await request('/api/request-quotations')
  const rfq = await request('/api/request-quotations', 'POST', {
    ...rfqs[0],
    id: undefined,
    document: {
      to: 'RFQ Test',
      rfqNo: '',
      att: 'Test',
      date: '2026-09-27',
      telp: '123',
      email: 'test@example.com',
      dueDate: '',
      paymentTerm: '30 days',
      items: [{ description: 'Brochure', quantity: 10, unit: 'Pcs', eta: '' }],
    },
  })
  assert.notEqual(rfq.noRequest, rfqs[0].noRequest)
  assert.equal(
    (await request('/api/request-quotations')).find((item) => item.id === rfq.id).document.items[0].quantity,
    10,
  )
  await request('/api/request-quotations/' + rfq.id, 'DELETE')
  checks.push('RFQ: duplicate uses unique number; document and items persist')

  const contact = {
    name: 'Revision Customer',
    email: 'revision@example.com',
    phone: '081234',
    address: 'Revision Address',
  }
  const shipping = {
    method: 'Shipping',
    recipient: contact.name,
    phone: contact.phone,
    address: contact.address,
    pickup: '',
  }
  const sale = await request('/api/sales', 'POST', {
    customer: contact.name,
    subTotal: 2000,
    status: 'Unpaid',
    items: [{ ...item, unit: 'Ream' }],
    document: { contact, shipping, po: 'PO-REVISED', notes: 'Preserve notes', voucher: '', taxRate: 0 },
  })
  assert.equal(sale.document.po, 'PO-REVISED')
  await request(`/api/sales/${sale.id}/payments`, 'POST', { amount: 500, method: 'Cash', notes: 'Deposit' })
  await request(`/api/sales/${sale.id}/payments`, 'POST', { amount: 2000, method: 'Cash' }, 400)
  const paidSale = await request(`/api/sales/${sale.id}/payments`, 'POST', {
    amount: 1500,
    method: 'Bank Transfer',
  })
  assert.equal(paidSale.status, 'Paid')
  assert.equal(paidSale.payments.length, 2)
  await request(`/api/sales/${sale.id}/payments`, 'POST', { amount: 1, method: 'Cash' }, 409)
  await request(`/api/sales/${sale.id}`, 'DELETE')
  const history = await request('/api/sales/history')
  assert.ok(
    history.some(
      (entry) => entry.saleId === sale.id && entry.kind === 'deleted' && entry.total === sale.total,
    ),
  )
  checks.push('Sales: document, partial/full payments and deleted history persist')

  const delivery = await request('/api/delivery-notes', 'POST', {
    ...cases[2][1],
    date: '2026-10-01',
    receiveBy: 'Recipient',
    security: 'Security',
    driver: 'Driver',
    issuedBy: 'Issuer',
  })
  assert.equal(delivery.date, '01/10/2026')
  const deliveryEdit = await request('/api/delivery-notes', 'POST', {
    ...delivery,
    reference: '',
    items: [{ ...delivery.items[0], packingQty: '3 Boxes', weight: '5 Kg' }],
  })
  assert.equal(deliveryEdit.reference, '')
  assert.equal(deliveryEdit.issuedBy, 'Issuer')
  assert.equal(deliveryEdit.items[0].packingQty, '3 Boxes')
  checks.push('Delivery Note: dates, signature fields and edited packing details persist')

  const quotation = await request('/api/quotations', 'POST', {
    customer: contact.name,
    email: contact.email,
    total: 999,
    status: 'Send',
    channel: 'Sales Staff',
    dueDate: '01/11/2026',
    document: {
      contact,
      shipping,
      date: '2026-10-01',
      currency: 'IDR',
      top: '30 Days',
      att: 'Purchasing',
      items: [
        {
          productName: 'Brochure',
          description: 'A4',
          moq: 2,
          unitPrice: 1000,
          order: 3,
          unit: 'Ream',
          amount: 0,
        },
      ],
      terms: ['30 Days'],
      shippingCost: 1000,
      taxRate: 11,
      pricesIncludeTax: false,
      signature: 'Admin',
      position: 'Sales',
    },
  })
  assert.equal(quotation.total, 4440)
  assert.equal(quotation.document.items[0].amount, 3000)
  const quoteEdit = await request('/api/quotations', 'POST', {
    ...quotation,
    document: { ...quotation.document, pricesIncludeTax: true },
  })
  assert.equal(quoteEdit.total, 4000)
  assert.equal(quoteEdit.document.position, 'Sales')
  await request(
    '/api/quotations',
    'POST',
    {
      ...quotation,
      document: { ...quotation.document, items: [{ ...quotation.document.items[0], order: 1 }] },
    },
    400,
  )
  checks.push('Quotation: product document persists; totals and MOQ are validated')

  const originalRFQ = await request('/api/request-quotations', 'POST', {
    customer: contact.name,
    email: contact.email,
    telp: contact.phone,
    document: {
      to: contact.name,
      rfqNo: '',
      att: 'Purchasing',
      date: '2026-10-01',
      email: contact.email,
      telp: contact.phone,
      dueDate: '2026-11-01',
      paymentTerm: '15 Days',
      items: [{ description: 'Brochure', quantity: 10, unit: 'Ream', eta: '2026-11-01' }],
      requestedTo: [{ department: 'Finance', attn: 'Buyer', email: 'buyer@example.com', telp: '123' }],
      signature: 'Requester',
    },
  })
  const duplicate = await request('/api/request-quotations', 'POST', {
    ...originalRFQ,
    id: undefined,
    customer: 'Different Recipient',
    email: 'recipient@example.com',
    telp: '456',
  })
  assert.equal(duplicate.document.to, 'Different Recipient')
  assert.equal(duplicate.document.rfqNo, duplicate.noRequest)
  assert.equal(duplicate.document.email, 'recipient@example.com')
  assert.equal(duplicate.document.requestedTo[0].department, 'Finance')
  assert.equal(
    (await request('/api/request-quotations')).find((r) => r.id === originalRFQ.id).customer,
    contact.name,
  )
  checks.push('RFQ: duplication changes recipient and number, preserves items/contacts and source')

  const returned = await request('/api/sales-returns', 'POST', {
    customer: 'Refund Test',
    salesNo: order.saleNo,
    date: '27/09/2026',
    total: 1000,
    paymentStatus: 'Unpaid',
    items: [
      {
        name: 'Brochure',
        description: 'A4',
        qtyOrder: 2,
        qtyReturn: 1,
        unit: 'Pcs',
        price: 1000,
        returnAmount: 0,
        reason: 'Misprint',
      },
    ],
  })
  assert.equal(returned.items[0].returnAmount, 1000)
  const payment = {
    method: 'Cash',
    bankName: '',
    accountNumber: '',
    accountName: '',
    amount: 500,
    notes: 'Refund',
  }
  await request(`/api/sales-returns/${returned.id}/payment`, 'POST', payment, 400)
  const paid = await request(`/api/sales-returns/${returned.id}/payment`, 'POST', {
    ...payment,
    amount: 1000,
  })
  assert.equal(paid.paymentStatus, 'Paid')
  assert.equal(paid.payment.notes, 'Refund')
  await request(`/api/sales-returns/${returned.id}/payment`, 'POST', { ...payment, amount: 1000 }, 409)
  await request('/api/sales-returns/' + returned.id, 'DELETE')
  checks.push(
    'Sales Return: line calculation, refund amount validation, payment persistence, duplicate-payment prevention',
  )

  for (const route of [
    'sales',
    'invoice',
    'delivery-note',
    'sales-return',
    'quotation',
    'request-quotation',
    'pos',
  ]) {
    for (const suffix of ['', '.html'])
      assert.equal((await fetch(base + '/' + route + suffix)).status, 200, route + suffix)
  }
  const saved = JSON.parse(await readFile(join(cwd, 'data/sales.json'), 'utf8'))
  assert.ok(saved.some((item) => item.id === order.id))
  checks.push('Seven page routes and .html aliases render')
  const invoiceFile = join(cwd, 'data/invoices.json')
  await writeFile(invoiceFile, '[]')
  assert.deepEqual(await request('/api/invoices'), [])
  await writeFile(invoiceFile, 'invalid JSON kept for recovery')
  await request('/api/invoices', 'POST', { customer: 'Must not overwrite', amount: 100, paid: 0 }, 500)
  assert.equal(await readFile(invoiceFile, 'utf8'), 'invalid JSON kept for recovery')
  checks.push('Empty runtime data stays empty; invalid JSON is never overwritten')
  console.log(JSON.stringify({ checks, isolatedData: cwd }, null, 2))
} finally {
  child.kill()
}
