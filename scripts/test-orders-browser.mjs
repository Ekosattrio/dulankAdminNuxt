import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root = fileURLToPath(new URL('..', import.meta.url))
async function freePort() { const server = createServer(); await new Promise(done => server.listen(0, '127.0.0.1', done)); const value = server.address().port; await new Promise(done => server.close(done)); return value }
const appPort = await freePort()
const debugPort = await freePort()
const cwd = await mkdtemp(join(tmpdir(), 'dulank-orders-browser-'))
const base = `http://127.0.0.1:${appPort}`
const app = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], { cwd, windowsHide: true, env: { ...process.env, HOST: '127.0.0.1', PORT: String(appPort) }, stdio: ['ignore', 'pipe', 'pipe'] })
let appOutput = ''
app.stdout.on('data', value => { appOutput += value })
app.stderr.on('data', value => { appOutput += value })
let ready = false
for (let attempt = 0; attempt < 100; attempt += 1) { try { ready = (await fetch(`${base}/orders`)).ok } catch {}; if (ready) break; if (app.exitCode !== null) throw new Error(appOutput); await delay(100) }
assert.ok(ready, appOutput)

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--disable-extensions', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${cwd}-chrome`, '--window-size=1440,900', `${base}/orders`], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
let browserOutput = ''
chrome.stderr.on('data', value => { browserOutput += value })
let socket
let id = 0
const pending = new Map()
const exceptions = []
function call(method, params = {}) { const commandId = ++id; socket.send(JSON.stringify({ id: commandId, method, params })); return new Promise((resolvePromise, reject) => pending.set(commandId, { resolve: resolvePromise, reject })) }
async function evaluate(expression) { const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (response.exceptionDetails) throw new Error(response.exceptionDetails.text); return response.result?.value }
async function waitFor(expression, label) { for (let attempt = 0; attempt < 140; attempt += 1) { if (await evaluate(expression)) return; await delay(100) } throw new Error(`Timed out waiting for ${label}`) }
async function hydrated(label) { await waitFor("Boolean(document.querySelector('#__nuxt')?.__vue_app__)", `${label} hydration`); await delay(500) }
async function navigate(path, text) { await call('Page.navigate', { url: base + path }); await waitFor(`document.body.innerText.includes(${JSON.stringify(text)})`, path); await hydrated(path) }

try {
  let target
  for (let attempt = 0; attempt < 100; attempt += 1) { try { target = (await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(response => response.json())).find(item => item.type === 'page') } catch {}; if (target) break; await delay(100) }
  assert.ok(target?.webSocketDebuggerUrl, browserOutput)
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((done, reject) => { socket.addEventListener('open', done, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  socket.addEventListener('message', event => { const message = JSON.parse(event.data); if (message.id) { const handler = pending.get(message.id); if (!handler) return; pending.delete(message.id); message.error ? handler.reject(new Error(message.error.message)) : handler.resolve(message.result) } else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text) })
  await call('Runtime.enable')
  await call('Page.enable')
  await hydrated('orders')

  assert.equal(await evaluate("document.querySelector('thead')?.innerText.includes('Order Status By')"), true)
  await evaluate("[...document.querySelectorAll('tbody tr button')].find(button=>button.innerText.trim()==='Status')?.click()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Update Order Status')", 'order status modal')
  await evaluate("(() => { const dialog=document.querySelector('dialog[open]'); const select=dialog.querySelector('select'); select.value='Processing'; select.dispatchEvent(new Event('change',{bubbles:true})); dialog.querySelector('button[type=submit]').click() })()")
  await waitFor("!document.querySelector('dialog[open]') && document.querySelector('tbody tr')?.innerText.includes('Processing')", 'order status persistence')
  await evaluate("[...document.querySelectorAll('tbody tr button')].find(button=>button.innerText.trim()==='Detail')?.click()")
  await waitFor("location.pathname==='/job-order-detail' && new URLSearchParams(location.search).has('orderId')", 'selected order detail navigation')
  await waitFor("document.body.innerText.includes('Product Detail No. 1') && document.body.innerText.includes('Flow No. 1')", 'selected job order document')
  assert.equal(await evaluate("!document.body.innerText.includes('Thermal CTP Plate')"), true)

  await navigate('/edit-job-order?orderId=1&mode=edit', 'Manage your order with default work flow')
  assert.equal(await evaluate("document.body.innerText.includes('Work Flow Default') && document.body.innerText.includes('Assignee') && document.body.innerText.includes('Incentive')"), true)
  await evaluate("(() => { const label=[...document.querySelectorAll('label')].find(node=>node.innerText.trim().startsWith('Job Title')); const input=label?.querySelector('input'); input.value='Browser Standalone Updated'; input.dispatchEvent(new Event('input',{bubbles:true})); const detail=document.querySelector('input[placeholder=\"Input label information\"]'); detail.value='Browser Detail'; detail.dispatchEvent(new Event('input',{bubbles:true})); [...document.querySelectorAll('button')].find(button=>button.innerText.trim()==='Add Information')?.click(); [...document.querySelectorAll('button')].find(button=>button.innerText.trim()==='Save')?.click() })()")
  await waitFor("location.pathname==='/job-order-detail' && document.body.innerText.includes('Browser Standalone Updated') && document.body.innerText.includes('Browser Detail')", 'standalone job editor persistence')

  await navigate('/job-order', 'Job Orders')
  assert.equal(await evaluate("document.body.innerText.includes('All Work Flow') && document.querySelector('thead')?.innerText.includes('Job Title')"), true)
  await waitFor("Boolean(document.querySelector('tbody tr button[aria-label=\"View Flow\"]'))", 'job order rows')
  await evaluate("document.querySelector('tbody tr button[aria-label=\"View Flow\"]')?.click()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.toLowerCase().includes('sales information')", 'job flow detail')
  await evaluate("[...document.querySelectorAll('dialog[open] button')].find(button=>button.innerText.trim()==='Close')?.click()")
  await waitFor("!document.querySelector('dialog[open]')", 'job flow close')
  await evaluate("document.querySelector('tbody tr button[aria-label=\"Edit\"]')?.click()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Edit Job Order')", 'job edit modal')
  await evaluate("(() => { const dialog=document.querySelector('dialog[open]'); const inputs=dialog.querySelectorAll('input'); inputs[2].value='Browser Job Updated'; inputs[2].dispatchEvent(new Event('input',{bubbles:true})); inputs[3].value='888'; inputs[3].dispatchEvent(new Event('input',{bubbles:true})); dialog.querySelector('button[type=submit]').click() })()")
  await waitFor("!document.querySelector('dialog[open]') && document.body.innerText.includes('Browser Job Updated')", 'job order edit persistence')

  await navigate('/job-list', 'All Job List')
  await waitFor("Boolean(document.querySelector('tbody tr button[aria-label=\"View Detail\"]'))", 'job list rows')
  await evaluate("document.querySelector('tbody tr button[aria-label=\"View Detail\"]')?.click()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.toLowerCase().includes('job completed information')", 'job list selected detail')

  await navigate('/job-branch', 'Job Branch')
  await waitFor("Boolean(document.querySelector('tbody tr button[aria-label=\"Settings\"]'))", 'job branch rows')
  await evaluate("document.querySelector('tbody tr button[aria-label=\"Settings\"]')?.click()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.toLowerCase().includes('information before flow')", 'job branch settings')
  assert.equal(await evaluate("document.querySelector('dialog[open]')?.innerText.includes('Assignee List')"), true)
  await evaluate("[...document.querySelectorAll('dialog[open] button')].find(button=>button.innerText.trim()==='Submit')?.click()")
  await waitFor("!document.querySelector('dialog[open]')", 'job branch persistence')
  await evaluate("[...document.querySelectorAll('button')].find(button=>button.innerText.trim()==='History Job Branch')?.click()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('History')", 'job branch history')

  await navigate('/my-job', 'Your All Job in waiting List')
  await waitFor("Boolean(document.querySelector('button[title=\"View Job Detail\"]'))", 'my job cards')
  await evaluate("document.querySelector('button[title=\"View Job Detail\"]')?.click()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Job Detail')", 'my job detail')
  await evaluate("[...document.querySelectorAll('dialog[open] button')].find(button=>button.innerText.trim()==='Cancel')?.click()")
  await waitFor("!document.querySelector('dialog[open]')", 'my job detail close')
  await evaluate("(() => { const select=document.querySelector('.my-job-container select'); select.value='Complete'; select.dispatchEvent(new Event('change',{bubbles:true})) })()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Konfirmasi Ubah Status')", 'my job status modal')
  await evaluate("(() => { const dialog=document.querySelector('dialog[open]'); const fields=dialog.querySelectorAll('input[type=number]'); fields[0].value='600'; fields[0].dispatchEvent(new Event('input',{bubbles:true})); fields[1].value='6'; fields[1].dispatchEvent(new Event('input',{bubbles:true})); [...dialog.querySelectorAll('button')].find(button=>button.innerText.trim()==='Save').click() })()")
  await waitFor("!document.querySelector('dialog[open]') && document.body.innerText.includes('berhasil diubah')", 'my job status persistence')

  await navigate('/my-incentive', 'My Incentive List')
  assert.equal(await evaluate("document.querySelector('thead')?.innerText.includes('Amount') && !document.querySelector('thead')?.innerText.includes('Action')"), true)
  assert.equal(await evaluate("document.querySelector('tfoot')?.innerText.includes('Total')"), true)

  await navigate('/job-progress', 'Job Progress List')
  assert.equal(await evaluate("document.querySelector('thead')?.innerText.includes('Complete by') && document.querySelector('thead')?.innerText.includes('Time')"), true)
  const progressBefore = await evaluate("document.querySelector('tbody tr button')?.getAttribute('aria-label')")
  await evaluate("document.querySelector('tbody tr button')?.click()")
  await waitFor(`document.querySelector('tbody tr button')?.getAttribute('aria-label') !== ${JSON.stringify(progressBefore)}`, 'job progress persistence')

  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  for (const [path, title] of [['/orders','Orders List'],['/job-order','Job Orders'],['/job-list','All Job List'],['/job-branch','Job Branch'],['/my-job','Your All Job'],['/my-incentive','My Incentive List'],['/job-order-detail?id=1','Job Order Detail'],['/edit-job-order?id=1&mode=edit','Manage your order with default work flow'],['/job-progress','Job Progress List']]) {
    await navigate(path, title)
    const overflow = await evaluate("({ ok: document.documentElement.scrollWidth <= window.innerWidth, page: document.documentElement.scrollWidth, viewport: window.innerWidth, elements: [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > window.innerWidth + 1 || (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX === 'visible')).slice(-16).map(el => ({ tag: el.tagName, text: String(el.innerText || '').trim().slice(0,40), className: String(el.className).slice(0,120), right: Math.round(el.getBoundingClientRect().right), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth })) })")
    assert.equal(overflow.ok, true, `${path} overflow: ${JSON.stringify(overflow)}`)
  }
  assert.deepEqual(exceptions, [])
  console.log('Orders browser checks passed: nine routes, Job Progress mutation, standalone selected detail/editor persistence, desktop/390px and no runtime exceptions')
} finally {
  socket?.close()
  chrome.kill()
  app.kill()
}
