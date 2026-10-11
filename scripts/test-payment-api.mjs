import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
const cwd = await mkdtemp(join(tmpdir(), 'dulank-payment-api-'))
const probe = createServer()
await new Promise((done) => probe.listen(0, '127.0.0.1', done))
const port = probe.address().port
await new Promise((done) => probe.close(done))
const child = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], {
  cwd,
  windowsHide: true,
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let output = ''
child.stdout.on('data', (chunk) => { output += chunk })
child.stderr.on('data', (chunk) => { output += chunk })
const base = `http://127.0.0.1:${port}`

async function request(path, method = 'GET', body, expectedStatus = 200) {
  const response = await fetch(base + path, {
    method,
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
  assert.equal(response.status, expectedStatus, `${method} ${path}: ${await response.clone().text()}`)
  const json = await response.json()
  if (expectedStatus === 200) assert.equal(json.success, true)
  return json.data
}

const inflowDetails = [
  { refNo: 'INC-00002', source: 'Purchase', amount: 750000, status: 'Paid' },
  { refNo: 'INV-00524', source: 'Purchase', amount: 1250000, status: 'Paid' },
  { refNo: 'INV-00789', source: 'Purchase', amount: 250000, status: 'Partial' },
]
const outflowDetails = [
  { refNo: 'INC-00002', source: 'Purchase', amount: 3250000, status: 'Paid' },
  { refNo: 'INV-00524', source: 'Purchase', amount: 1250000, status: 'Paid' },
  { refNo: 'INV-00789', source: 'Purchase', amount: 750000, status: 'Partial' },
]

try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(output)
    try { ready = (await fetch(base + '/api/payments')).ok } catch {}
    if (ready) break
    await delay(100)
  }
  assert.ok(ready, `Nitro did not start: ${output}`)

  const payments = await request('/api/payments')
  assert.equal(payments.length, 20)
  assert.equal((await request('/api/payments?type=Payment-Out')).length, 5)
  assert.equal((await request('/api/payments?startDate=2026-02-18&endDate=2026-02-18')).length, 3)

  const originalInflows = await request('/api/payment-inflow')
  assert.equal(originalInflows.length, 20)
  const createdInflow = await request('/api/payment-inflow', 'POST', {
    date: '10/10/2026',
    name: 'Payment API Test',
    source: 'Sales',
    amount: 1,
    dueDate: '10/10/2026',
    method: 'Balance',
    paymentDate: '10/10/2026',
    paymentAmount: 2000000,
    note: 'Derived legacy transaction total',
    transactionDetails: inflowDetails,
  })
  assert.equal(createdInflow.amount, 2250000)
  assert.equal(createdInflow.status, 'Partial')
  assert.deepEqual(createdInflow.transactionDetails.map((item) => item.status), ['Paid', 'Paid', 'Partial'])

  const splitInflow = await request('/api/payment-inflow', 'POST', {
    date: '10/10/2026',
    name: 'Split Payment API Test',
    source: 'Sales',
    amount: 2250000,
    method: 'Cash',
    paymentDate: '10/10/2026',
    transactionDetails: inflowDetails,
    splitPayments: [
      { id: 'split-cash', method: 'Cash', amount: 500000 },
      { id: 'split-transfer', method: 'Transfer', amount: 250000 },
    ],
  })
  assert.equal(splitInflow.payments.length, 2)
  assert.equal(splitInflow.payments.reduce((sum, item) => sum + item.amount, 0), 750000)
  assert.equal(splitInflow.status, 'Partial')

  await request('/api/payment-inflow', 'POST', {
    date: '10/10/2026', name: 'Invalid', source: 'Sales', amount: 10, method: 'Cash', paymentAmount: 11,
  }, 400)
  await request('/api/payment-inflow', 'POST', {
    ...createdInflow, id: 'missing-payment-flow',
  }, 404)
  await request(`/api/payment-inflow/${createdInflow.id}`, 'DELETE')
  await request(`/api/payment-inflow/${splitInflow.id}`, 'DELETE')
  assert.equal((await request('/api/payment-inflow')).length, originalInflows.length)

  const originalOutflows = await request('/api/payment-outflow')
  const createdOutflow = await request('/api/payment-outflow', 'POST', {
    date: '10/10/2026',
    name: 'Outflow API Test',
    source: 'Purchase',
    amount: 1,
    method: 'Transfer',
    paymentDate: '10/10/2026',
    paymentAmount: 5250000,
    transactionDetails: outflowDetails,
    bankTransfer: {
      fromBankAccount: 'Cipta Kreasi PT / BRI / 1320009982282',
      toBankWallet: 'BCA',
      toAccountName: 'Supplier Test',
      toAccountNumber: '123456',
      reference: 'TEST-OUT',
    },
  })
  assert.equal(createdOutflow.amount, 5250000)
  assert.equal(createdOutflow.status, 'Paid')
  assert.match(createdOutflow.payments[0].toAccount, /Supplier Test/)
  await request(`/api/payment-outflow/${createdOutflow.id}`, 'DELETE')
  assert.equal((await request('/api/payment-outflow')).length, originalOutflows.length)

  await mkdir(join(cwd, 'data'), { recursive: true })
  await writeFile(join(cwd, 'data', 'payment-inflows.json'), '[]', 'utf8')
  assert.deepEqual(await request('/api/payment-inflow'), [])
  await writeFile(join(cwd, 'data', 'payment-inflows.json'), '{', 'utf8')
  await request('/api/payment-inflow', 'GET', undefined, 500)

  console.log('Payment API checks passed: legacy fixtures, filters, derived totals, reactive statuses, split payments, CRUD, empty data, invalid JSON')
} finally {
  child.kill()
}
