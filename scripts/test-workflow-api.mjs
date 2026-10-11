import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
const cwd = await mkdtemp(join(tmpdir(), 'dulank-workflow-api-'))
const probe = createServer(); await new Promise(done => probe.listen(0, '127.0.0.1', done)); const port = probe.address().port; await new Promise(done => probe.close(done))
const child = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], { cwd, windowsHide: true, env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] })
let output = ''; child.stdout.on('data', chunk => { output += chunk }); child.stderr.on('data', chunk => { output += chunk })
const base = `http://127.0.0.1:${port}`
async function request(path, method = 'GET', body, status = 200) {
  const response = await fetch(base + path, { method, headers: body ? { 'content-type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined })
  const text = await response.text(); assert.equal(response.status, status, `${method} ${path}: ${text}`)
  const json = JSON.parse(text); if (status === 200) assert.equal(json.success, true); return json
}

try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt += 1) { try { ready = (await fetch(base + '/api/flow-categories')).ok } catch {}; if (ready) break; if (child.exitCode !== null) throw new Error(output); await delay(100) }
  assert.ok(ready, output)

  const categories = await request('/api/flow-categories?category=Design')
  assert.ok(categories.data.length && categories.data.every(item => item.name === 'Design'))
  const category = (await request('/api/flow-categories', 'POST', { name: 'API Category', used: 999 })).data
  assert.equal(category.used, 0)
  assert.equal((await request(`/api/flow-categories/${category.id}`, 'PUT', { name: 'API Category Updated', used: 999 })).data.used, 0)
  await request(`/api/flow-categories/${category.id}`, 'DELETE')
  await request('/api/flow-categories', 'POST', { name: '' }, 400)

  const names = await request('/api/flow-names?category=Cetak')
  assert.ok(names.data.every(item => item.category === 'Cetak'))
  const flowName = (await request('/api/flow-names', 'POST', { name: 'API Flow', category: 'Cetak', incentiveAmount: 1250, unitIncentive: 'Per Job', flowAssignee: 'API Operator', flowType: 'In-House' })).data
  assert.equal(flowName.incentiveAmount, 1250)
  await request(`/api/flow-names/${flowName.id}`, 'PUT', { ...flowName, incentiveAmount: -1 }, 400)
  await request('/api/flow-names', 'POST', { name: 'Bad', category: 'Cetak', incentiveAmount: 1, unitIncentive: 'Bad', flowType: 'Bad' }, 400)
  await request(`/api/flow-names/${flowName.id}`, 'DELETE')

  const template = (await request('/api/flow-templates', 'POST', { name: 'API Template', items: [{ label: 'Material', type: 'Select Type', options: ['Paper', 'Vinyl'] }, { label: 'Notes', type: 'Input Type' }] })).data
  assert.equal(template.items[0].options.length, 2)
  assert.equal((await request(`/api/flow-templates/${template.id}`)).data.id, template.id)
  await request(`/api/flow-templates/${template.id}`, 'PUT', { ...template, name: 'API Template Updated' })
  await request('/api/flow-templates', 'POST', { name: 'Bad Template', items: [{ label: 'Empty Select', type: 'Select Type', options: [] }] }, 400)
  await request(`/api/flow-templates/${template.id}`, 'DELETE')

  const context = (await request('/api/work-flow-context')).data
  assert.ok(context.products.length > 0)
  assert.ok(context.flows.some(item => item.name === 'Artwork'))
  assert.ok(context.flowCategories.includes('Finishing'))

  const workflow = (await request('/api/work-flows', 'POST', { product: context.products[0].name, productId: context.products[0].id, category: context.products[0].category, steps: [{ id: 'art', name: 'Artwork', category: 'Design', template: 'Standard Ready Print' }] })).data
  assert.equal(workflow.workflowSteps, 'Artwork')
  assert.equal((await request(`/api/work-flows/${workflow.id}`)).data.productId, context.products[0].id)
  const updated = (await request(`/api/work-flows/${workflow.id}`, 'PUT', { ...workflow, steps: [{ id: 'art', name: 'Artwork', category: 'Design' }, { id: 'cut', name: 'Potong', category: 'Finishing' }] })).data
  assert.equal(updated.workflowSteps, 'Artwork, Potong')
  await request('/api/work-flows', 'POST', { product: 'Bad', category: 'Offset', steps: [{ name: 'Same', category: 'Design' }, { name: 'Same', category: 'Cetak' }] }, 400)
  await request(`/api/work-flows/${workflow.id}`, 'DELETE')

  await mkdir(join(cwd, 'data'), { recursive: true })
  await writeFile(join(cwd, 'data', 'flow-categories.json'), '[]', 'utf8')
  assert.deepEqual((await request('/api/flow-categories')).data, [])
  await writeFile(join(cwd, 'data', 'flow-categories.json'), '{', 'utf8')
  await request('/api/flow-categories', 'GET', undefined, 500)
  console.log('Workflow API checks passed: filters, CRUD, context, nested persistence, validation, empty and malformed data')
} finally { child.kill() }
