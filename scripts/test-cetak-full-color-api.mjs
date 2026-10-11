import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
const cwd = await mkdtemp(join(tmpdir(), 'dulank-cetak-full-color-'))
const probe = createServer()
await new Promise(resolveListen => probe.listen(0, '127.0.0.1', resolveListen))
const port = probe.address().port
await new Promise(resolveClose => probe.close(resolveClose))
const child = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], {
  cwd,
  windowsHide: true,
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let output = ''
child.stdout.on('data', value => { output += value })
child.stderr.on('data', value => { output += value })
const base = `http://127.0.0.1:${port}`

async function request(path, options = {}, expectedStatus = 200) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: options.body ? { 'content-type': 'application/json' } : undefined,
  })
  const text = await response.text()
  assert.equal(response.status, expectedStatus, text)
  return text ? JSON.parse(text) : null
}

try {
  let ready = false
  for (let index = 0; index < 100; index += 1) {
    try { ready = (await fetch(`${base}/api/cetak-full-color`)).ok } catch {}
    if (ready) break
    if (child.exitCode !== null) throw new Error(output)
    await delay(100)
  }
  assert.ok(ready, output)

  const initial = await request('/api/cetak-full-color')
  assert.equal(initial.data.schemaVersion, 2)
  assert.deepEqual(initial.data.products.map(item => item.name), ['Brosur', 'Brosur', 'Produk Label', 'Tiket Karcis', 'Flyer'])
  assert.deepEqual(initial.data.sizes.map(item => [item.name, item.size, item.status]), [
    ['A5', '21x15cm', 'Show'],
    ['A4', '21x30cm', 'Show'],
    ['A3', '30x42cm', 'Hide'],
    ['Folio', '21x33cm', 'Show'],
  ])
  assert.deepEqual(initial.data.products.map(item => [item.name, item.laminates, item.printSides, item.folds]), [
    ['Brosur', 'Tanpa Laminasi (Default), Glossy, Doff, UV Vernish, Spot UV', 'Cetak 1 Sisi (default), Cetak Bolak Balik', 'Tanpa Lipatan (default), 1 Lipatan, 2 Lipatan'],
    ['Brosur', 'Tanpa Laminasi (Default), Glossy, Doff, UV Vernish, Spot UV', 'Cetak 1 Sisi (default), Cetak Bolak Balik', 'Tanpa Lipatan (default), 1 Lipatan, 2 Lipatan'],
    ['Produk Label', 'Tanpa Laminasi (Default), Glossy, Doff, UV Vernish, Spot UV', 'Cetak 1 Sisi (default), Cetak Bolak Balik', 'Tanpa Lipatan (default), 1 Lipatan, 2 Lipatan'],
    ['Tiket Karcis', null, 'Cetak 1 Sisi (default)', null],
    ['Flyer', null, 'Cetak 1 Sisi (default), Cetak Bolak Balik', null],
  ])
  assert.deepEqual(initial.data.paperGroups.map(group => [group.name, group.gramatures.map(item => item.label), group.gramatures.map(item => item.enabled)]), [
    ['Art Paper', ['100 gr', '120 gr', '150 gr'], [false, false, false]],
    ['Art Carton', ['210 gr', '230 gr', '260 gr', '290 gr'], [false, false, false, false]],
    ['HVS', ['60 gr', '70 gr', '80 gr', '100 gr'], [false, false, false, false]],
    ['Carton BC', ['180 gr'], [false]],
  ])
  assert.deepEqual(initial.data.machines.map(item => [item.printingType, item.printingName, item.unitColor, item.paperArea, item.status]), [
    ['OffSet', 'heidlberg sm52', '4 Color', '104x72 cm', 'Show'],
    ['OffSet', 'heidlberg sm74', '4 Color', '75 x 52 cm', 'Show'],
    ['OffSet', 'heidlberg sm104', '4 Color', '52 x 36 cm', 'Show'],
    ['A3', 'Xerox C 60', 'Digital', '32 x 48 cm', 'Show'],
  ])
  assert.deepEqual(initial.data.laminates.map(item => item.name), ['Laminasi Doff', 'Laminasi Glossy', 'Spot UV'])
  assert.deepEqual(initial.data.folds.map(item => item.name), ['Tanpa Lipatan', '1 Lipatan'])
  assert.deepEqual(initial.data.printSides.map(item => item.name), ['Cetak 1 Sisi', 'Cetak Bolak Balik'])
  assert.deepEqual(initial.data.components.map(item => [item.name, item.value, item.unit]), [['Jam Kerja', 8, 'Jam'], ['Kapasitas Packing Brosur Per Hari', 2, 'Jam']])
  assert.deepEqual(initial.data.workflowSteps.map(item => [item.step, item.category, item.name]), [
    [1, 'Pracetak', 'Pesen Kertas ke Toko'],
    [2, 'Cetak', 'Cetak Offset 4 Warna'],
    [3, 'Pracetak', 'Buat Plat CTP'],
    [4, 'Finishing', 'Laminasi doff dari Cetak Offset'],
    [5, 'Finishing', 'Proses Lipat ke mesin'],
  ])
  assert.deepEqual(initial.data.paperWorkflows[0].targets, ['Art Paper'])
  assert.deepEqual(initial.data.machineWorkflows.map(item => [item.category, item.name, item.assignee, item.incentiveAmount, item.incentiveUnit, item.targets]), [
    ['Pracetak', 'Plat CTP', 'Nurdin', 5000, 'per Job', ['Ofsett']],
    ['Cetak', 'Print A3', 'Nurdin,Raffi', 5000, 'per Job', ['Digital A3']],
    ['Cetak', 'Spk Cetak Offset', 'Arif,Galih', 5000, 'per Job', ['Ofsett']],
  ])
  assert.deepEqual(initial.data.laminateWorkflows[0].targets, ['Art Paper'])
  assert.deepEqual(initial.data.foldWorkflows[0].targets, ['1 lipatan'])
  assert.deepEqual(initial.data.printSideWorkflows[0].targets, ['Cetak 1 Sisi', 'Cetak Bolak-Balik'])
  assert.deepEqual(initial.data.componentWorkflows[0].targets, ['1 lipatan'])
  assert.deepEqual(initial.data.profitSettings.ranges.map(item => [item.from, item.to, item.posPercent, item.webstorePercent]), Array.from({ length: 4 }, () => [null, null, null, null]))
  assert.deepEqual(initial.data.profitSettings.additionalFees.map(item => [item.name, item.amount, item.unit]), [['Biaya Transport', null, 'Per Pekerjaan/Job'], ['Biaya Packing', null, 'Per Lembar']])
  assert.deepEqual(initial.data.profitSettings.taxes.map(item => [item.name, item.percent]), [['Ppn', null], ['Pph', null]])
  assert.equal(initial.data.logTransactions.length, 10)
  assert.deepEqual(initial.data.logTransactions.map(item => item.noSales), Array.from({ length: 10 }, (_, index) => String(2511000001 + index)))
  assert.equal(initial.data.logTransactions[0].price, 1200000)

  const changed = structuredClone(initial.data)
  changed.paperWorkflows[0].targets = ['Art Paper', 'Art Carton', 'HVS']
  changed.logTransactions = []
  const saved = await request('/api/cetak-full-color', { method: 'POST', body: JSON.stringify(changed) })
  assert.deepEqual(saved.data.paperWorkflows[0].targets, ['Art Paper', 'Art Carton', 'HVS'])
  assert.equal(saved.data.logTransactions.length, 10, 'Log transaction is output-only and must not be replaced')
  const reloaded = await request('/api/cetak-full-color')
  assert.deepEqual(reloaded.data.paperWorkflows[0].targets, ['Art Paper', 'Art Carton', 'HVS'])

  const invalid = structuredClone(reloaded.data)
  invalid.paperWorkflows[0].targets = []
  await request('/api/cetak-full-color', { method: 'POST', body: JSON.stringify(invalid) }, 400)

  const page = await fetch(`${base}/cetak-full-color`)
  assert.equal(page.status, 200, await page.text())

  await mkdir(join(cwd, 'data'), { recursive: true })
  await writeFile(join(cwd, 'data', 'cetak-full-color.json'), '{', 'utf8')
  await request('/api/cetak-full-color', {}, 500)

  console.log('Cetak Full Color checks passed: exact legacy seed, multiple targets, save/reload, output-only logs, invalid payload, route render, and malformed-data safeguard')
} finally {
  child.kill()
}
