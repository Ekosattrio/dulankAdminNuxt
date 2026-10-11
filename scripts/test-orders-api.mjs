import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
const cwd = await mkdtemp(join(tmpdir(), 'dulank-orders-api-'))
const probe = createServer()
await new Promise(done => probe.listen(0, '127.0.0.1', done))
const port = probe.address().port
await new Promise(done => probe.close(done))
const child = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], {
  cwd, windowsHide: true, env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'],
})
let output = ''
child.stdout.on('data', chunk => { output += chunk })
child.stderr.on('data', chunk => { output += chunk })
const base = `http://127.0.0.1:${port}`

async function request(path, method = 'GET', body, expectedStatus = 200) {
  const response = await fetch(base + path, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined })
  const text = await response.text()
  assert.equal(response.status, expectedStatus, `${method} ${path}: ${text}`)
  const json = JSON.parse(text)
  if (expectedStatus === 200) assert.equal(json.success, true)
  return json
}

try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(output)
    try { ready = (await fetch(base + '/api/orders')).ok } catch {}
    if (ready) break
    await delay(100)
  }
  assert.ok(ready, `Nitro did not start: ${output}`)

  const orders = await request('/api/orders')
  assert.ok(orders.data.length >= 5)
  assert.ok((await request('/api/orders?shipping=Pickup')).data.every(item => item.shipping === 'Pickup'))
  assert.equal(typeof (await request('/api/orders/stats')).data.totalOrders, 'number')
  const orderId = orders.data[0].id
  await request(`/api/orders/${orderId}`, 'PUT', { status: 'Processing', statusBy: 'API Test' })
  assert.equal((await request('/api/orders?status=Processing')).data.some(item => item.id === orderId), true)
  await request(`/api/orders/${orderId}`, 'PUT', { status: 'Unknown' }, 400)
  await request('/api/orders/missing', 'PUT', { status: 'Waiting' }, 404)

  const jobOrders = await request('/api/job-orders')
  assert.ok(jobOrders.data.length >= 5)
  assert.ok(jobOrders.meta.workflowCounts.design >= 1)
  const selectedJob = jobOrders.data[0]
  const selectedContext = (await request(`/api/job-order-context?orderId=${encodeURIComponent(orderId)}`)).data
  assert.equal(selectedContext.order.id, orderId)
  assert.equal(selectedContext.jobOrder.orderId, selectedContext.order.no)
  assert.equal((await request(`/api/orders/${orderId}`)).data.id, orderId)
  const editedJob = (await request('/api/job-orders', 'POST', {
    id: selectedJob.id, customer: selectedJob.customer, product: selectedJob.product,
    jobTitle: `${selectedJob.jobTitle} API`, qty: 777, dueDate: selectedJob.dueDate,
    priority: selectedJob.priority, status: selectedJob.status,
    workflowCategory: selectedJob.workflowCategory, workflowType: selectedJob.workflowType,
  })).data
  assert.equal(editedJob.qty, 777)
  assert.equal((await request(`/api/job-orders/${selectedJob.id}`)).data.jobTitle.endsWith(' API'), true)
  await request('/api/job-orders', 'POST', { ...selectedJob, id: 'missing' }, 404)
  await request('/api/job-orders', 'POST', { customer: '', product: '' }, 400)
  const detailedJob = (await request('/api/job-orders', 'POST', {
    ...editedJob,
    steps: [{ id: 'api-flow', name: 'Design', status: 'active', flowType: 'Branch Store', branch: 'Branch Store Jakarta', assignees: 'API Operator', incentive: 1500, incentiveUnit: 'Job', infoList: [{ id: 'api-info', label: 'Warna Dominan', value: 'Biru' }], afterInfoList: [{ id: 'api-after', label: 'File Design Final?', inputType: 'Input Type', value: 'Approved' }] }],
  })).data
  assert.equal(detailedJob.steps[0].infoList[0].value, 'Biru')
  assert.equal(detailedJob.steps[0].afterInfoList[0].value, 'Approved')
  await request('/api/job-orders', 'POST', { ...detailedJob, steps: [{ name: 'Invalid', status: 'pending', incentive: -1 }] }, 400)

  const jobList = await request('/api/job-list')
  assert.ok(jobList.data.length >= 5)
  const flows = (await request('/api/job-list/flows')).data
  assert.equal(flows.reduce((sum, flow) => sum + flow.count, 0), jobList.data.length)
  assert.ok((await request(`/api/job-list?flow=${encodeURIComponent(flows[0].name)}`)).data.length >= 1)

  const branches = await request('/api/job-branches')
  const branch = branches.data[0]
  const branchUpdated = (await request(`/api/job-branches/${branch.id}`, 'PUT', {
    status: 'On Process', priority: 'Urgent', branch: branch.branch,
    infoList: [{ id: 'api', label: 'API Spec', value: 'Persisted' }],
    afterInfoList: [{ id: 'api', label: 'Qty OK' }], assignees: ['API Operator'], incentiveAmount: 2500, incentiveUnit: 'Lembar',
  })).data
  assert.equal(branchUpdated.infoList[0].value, 'Persisted')
  assert.equal((await request(`/api/job-branches?search=${encodeURIComponent(branch.customer)}`)).data.some(item => item.id === branch.id), true)
  await request(`/api/job-branches/${branch.id}`, 'PUT', { incentiveAmount: -1 }, 400)
  assert.ok((await request(`/api/job-branches/history?branch=${encodeURIComponent(branch.branch)}`)).data.length >= 1)

  const myJobs = await request('/api/my-jobs')
  const myJob = myJobs.data[0]
  const jobStatus = (await request(`/api/my-jobs/${myJob.id}`, 'PUT', { status: 'Complete', qtyOk: 700, qtyRusak: 7 })).data
  assert.equal(jobStatus.qtyOk, 700)
  assert.equal((await request(`/api/my-jobs?priority=${myJob.priority}`)).data.every(item => item.priority === myJob.priority), true)
  await request(`/api/my-jobs/${myJob.id}`, 'PUT', { status: 'Invalid', qtyOk: 1, qtyRusak: 0 }, 400)
  await request(`/api/my-jobs/${myJob.id}`, 'PUT', { status: 'Hold' }, 400)
  await request('/api/my-jobs/missing', 'PUT', { status: 'Hold', qtyOk: 1, qtyRusak: 0 }, 404)

  const incentives = await request('/api/my-incentives?process=Printing')
  assert.ok(incentives.data.every(item => item.process === 'Printing'))
  assert.equal(incentives.stats.totalAmount, incentives.data.reduce((sum, item) => sum + item.amount, 0))
  const created = (await request('/api/my-incentives', 'POST', {
    date: '10/10/2026', jobTitle: 'API Incentive', flowName: 'Cutting', process: 'Cutting', incentive: 1250,
    unit: 'Job', qty: 2, amount: 999999, status: 'Pending', employee: 'API User',
  })).data
  assert.equal(created.amount, 2500)
  await request(`/api/my-incentives/${created.id}`, 'DELETE')
  await request('/api/my-incentives', 'POST', { date: '', jobTitle: '', flowName: '', process: '', incentive: -1, unit: '', qty: -1, status: 'Pending' }, 400)

  const progress = await request('/api/job-progress')
  assert.ok(progress.data.length >= 5)
  assert.equal(progress.meta.stats.total, progress.data.length)
  assert.ok((await request('/api/job-progress?process=Printing')).data.every(item => item.process === 'Printing'))
  const pendingProgress = progress.data.find(item => !item.isCompleted)
  const completedProgress = (await request(`/api/job-progress/${pendingProgress.id}`, 'PUT', { isCompleted: true, completedBy: 'API Operator', employeeId: 'EMP-API', qtyOk: 100, qtyRusak: 2 })).data
  assert.equal(completedProgress.completedBy, 'API Operator')
  assert.equal(completedProgress.qtyOk, 100)
  assert.ok(completedProgress.completedAt)
  await request(`/api/job-progress/${pendingProgress.id}`, 'PUT', { isCompleted: true, completedBy: '', qtyOk: -1 }, 400)
  await request('/api/job-progress/missing', 'PUT', { isCompleted: false }, 404)

  await mkdir(join(cwd, 'data'), { recursive: true })
  await writeFile(join(cwd, 'data', 'job-list.json'), '[]', 'utf8')
  assert.deepEqual((await request('/api/job-list')).data, [])
  assert.deepEqual((await request('/api/job-list/flows')).data, [])
  await writeFile(join(cwd, 'data', 'job-list.json'), '{', 'utf8')
  await request('/api/job-list', 'GET', undefined, 500)

  await writeFile(join(cwd, 'data', 'job-progress.json'), '[]', 'utf8')
  const emptyProgress = await request('/api/job-progress')
  assert.deepEqual(emptyProgress.data, [])
  assert.equal(emptyProgress.meta.stats.total, 0)
  await writeFile(join(cwd, 'data', 'job-progress.json'), '{', 'utf8')
  await request('/api/job-progress', 'GET', undefined, 500)

  console.log('Orders API checks passed: workflow context and Job Progress, filters/derived stats, selected mutations, persistence, nested data, validation, empty and malformed data')
} finally {
  child.kill()
}
