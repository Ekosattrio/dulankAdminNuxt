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
const appPort = await freePort(), debugPort = await freePort(), cwd = await mkdtemp(join(tmpdir(), 'dulank-workflow-browser-'))
const base = `http://127.0.0.1:${appPort}`
const app = spawn(process.execPath, [resolve(root, '.output/server/index.mjs')], { cwd, windowsHide: true, env: { ...process.env, HOST: '127.0.0.1', PORT: String(appPort) }, stdio: ['ignore', 'pipe', 'pipe'] })
let appOutput = ''; app.stdout.on('data', value => { appOutput += value }); app.stderr.on('data', value => { appOutput += value })
let ready = false
for (let attempt = 0; attempt < 100; attempt += 1) { try { ready = (await fetch(`${base}/flow-category`)).ok } catch {}; if (ready) break; if (app.exitCode !== null) throw new Error(appOutput); await delay(100) }
assert.ok(ready, appOutput)
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--disable-gpu', '--disable-extensions', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${cwd}-chrome`, '--window-size=1440,900', `${base}/flow-category`], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
let browserOutput = ''; chrome.stderr.on('data', value => { browserOutput += value })
let socket, id = 0; const pending = new Map(), exceptions = []
function call(method, params = {}) { const commandId = ++id; socket.send(JSON.stringify({ id: commandId, method, params })); return new Promise((resolvePromise, reject) => pending.set(commandId, { resolve: resolvePromise, reject })) }
async function evaluate(expression) { const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (response.exceptionDetails) throw new Error(response.exceptionDetails.text); return response.result?.value }
async function waitFor(expression, label) { for (let attempt = 0; attempt < 160; attempt += 1) { if (await evaluate(expression)) return; await delay(100) } throw new Error(`Timed out waiting for ${label}`) }
async function hydrated(label) { await waitFor("Boolean(document.querySelector('#__nuxt')?.__vue_app__)", `${label} hydration`); await delay(450) }
async function navigate(path, text) { await call('Page.navigate', { url: base + path }); await waitFor(`document.body.innerText.includes(${JSON.stringify(text)})`, path); await hydrated(path) }

try {
  let target
  for (let attempt = 0; attempt < 100; attempt += 1) { try { target = (await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(response => response.json())).find(item => item.type === 'page') } catch {}; if (target) break; await delay(100) }
  assert.ok(target?.webSocketDebuggerUrl, browserOutput)
  socket = new WebSocket(target.webSocketDebuggerUrl); await new Promise((done, reject) => { socket.addEventListener('open', done, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  socket.addEventListener('message', event => { const message = JSON.parse(event.data); if (message.id) { const handler = pending.get(message.id); if (!handler) return; pending.delete(message.id); message.error ? handler.reject(new Error(message.error.message)) : handler.resolve(message.result) } else if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text) })
  await call('Runtime.enable'); await call('Page.enable'); await hydrated('flow category')

  assert.equal(await evaluate("document.querySelector('thead')?.innerText.includes('Flow Process')"), true)
  await evaluate("[...document.querySelectorAll('button')].find(button=>button.innerText.includes('Add Flow Category'))?.click()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Flow Category')", 'category modal')
  await evaluate("(() => { const dialog=document.querySelector('dialog[open]'); const input=dialog.querySelector('input'); input.value='Browser Flow Category'; input.dispatchEvent(new Event('input',{bubbles:true})); dialog.querySelector('button[type=submit]').click() })()")
  await waitFor("!document.querySelector('dialog[open]') && document.body.innerText.includes('Browser Flow Category')", 'category persistence')

  await navigate('/flow-name', 'Flow Name List')
  assert.equal(await evaluate("document.querySelector('thead')?.innerText.includes('Incentive Amount (Rp)')"), true)
  await evaluate("[...document.querySelectorAll('button')].find(button=>button.innerText.includes('Add New Flow Name'))?.click()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Assignee') && document.querySelector('dialog[open]')?.innerText.includes('Flow Type') && document.querySelector('dialog[open]')?.innerText.includes('Add Incentive')", 'full flow name modal')
  await evaluate("[...document.querySelectorAll('dialog[open] button')].find(button=>button.innerText.trim()==='Cancel')?.click()")

  await navigate('/flow-template', 'Flow Template')
  await evaluate("[...document.querySelectorAll('button')].find(button=>button.innerText.includes('Add Flow Template'))?.click()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Add Information')", 'template modal')
  await evaluate("(() => { const dialog=document.querySelector('dialog[open]'); const inputs=dialog.querySelectorAll('input'); inputs[0].value='Browser Template'; inputs[0].dispatchEvent(new Event('input',{bubbles:true})); inputs[1].value='Material'; inputs[1].dispatchEvent(new Event('input',{bubbles:true})); [...dialog.querySelectorAll('button')].find(button=>button.innerText.trim()==='Save').click() })()")
  await waitFor("document.querySelector('dialog[open]')?.innerText.includes('Material')", 'template information row')
  await evaluate("(() => { const dialog=document.querySelector('dialog[open]'); const select=dialog.querySelector('select'); select.value='Select Type'; select.dispatchEvent(new Event('change',{bubbles:true})) })()")
  await waitFor("[...document.querySelectorAll('dialog[open] button')].some(button=>button.innerText.trim()==='Add Data Select')", 'data select trigger')
  await evaluate("[...document.querySelectorAll('dialog[open] button')].find(button=>button.innerText.trim()==='Add Data Select')?.click()")
  await waitFor("[...document.querySelectorAll('dialog[open]')].some(dialog=>dialog.innerText.includes('Data Select Saved'))", 'data select modal')
  await evaluate("(() => { const dialog=[...document.querySelectorAll('dialog[open]')].find(node=>node.innerText.includes('Data Select Saved')); const input=dialog.querySelector('input[placeholder=\"e.g. Option name\"]'); input.value='Paper'; input.dispatchEvent(new Event('input',{bubbles:true})); [...dialog.querySelectorAll('button')].find(button=>button.innerText.trim()==='Add').click(); dialog.querySelector('button[type=submit]').click() })()")
  await waitFor("document.querySelectorAll('dialog[open]').length===1", 'data select save')
  await evaluate("document.querySelector('dialog[open] button[type=submit]')?.click()")
  await waitFor("!document.querySelector('dialog[open]') && document.body.innerText.includes('Browser Template')", 'template persistence')

  await navigate('/work-flow', 'Work Flow List')
  assert.equal(await evaluate("document.querySelector('thead')?.innerText.includes('Product Category') && document.querySelector('thead')?.innerText.includes('Work Flow')"), true)
  await evaluate("[...document.querySelectorAll('a,button')].find(node=>node.innerText.includes('Add New Work Flow'))?.click()")
  await waitFor("location.pathname==='/add-work-flow' && document.body.innerText.includes('Work Flow Arrange') && document.body.innerText.includes('Artwork')", 'workflow editor context')
  await evaluate("document.querySelector('input[placeholder=\"Search Product\"]')?.focus()")
  await waitFor("Boolean(document.querySelector('input[placeholder=\"Search Product\"]')?.parentElement?.querySelector('div.absolute button'))", 'product choices')
  await evaluate("document.querySelector('input[placeholder=\"Search Product\"]')?.parentElement?.querySelector('div.absolute button')?.click(); [...document.querySelectorAll('label')].find(label=>label.innerText.trim()==='Artwork')?.querySelector('input')?.click()")
  await waitFor("document.body.innerText.includes('1 Steps')", 'selected workflow step')
  const editorState = await evaluate("({ product: document.querySelector('input[placeholder=\"Search Product\"]')?.value, saveDisabled: document.querySelector('form > div:last-of-type button[type=submit]')?.disabled })")
  assert.ok(editorState.product, `workflow product was not selected: ${JSON.stringify(editorState)}`)
  assert.equal(editorState.saveDisabled, false, `workflow save disabled: ${JSON.stringify(editorState)}`)
  await evaluate("document.querySelector('form > div:last-of-type button[type=submit]')?.click()")
  await waitFor("location.pathname==='/work-flow' || document.body.innerText.includes('required') || document.body.innerText.includes('Invalid')", 'workflow create result')
  assert.equal(await evaluate("location.pathname"), '/work-flow', await evaluate("document.body.innerText.slice(-1200)"))
  await evaluate("document.querySelector('tbody tr a[aria-label=\"Edit\"]')?.click()")
  await waitFor("location.pathname==='/edit-work-flow' && document.body.innerText.includes('Work Flow Arrange')", 'selected workflow edit')

  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  for (const [path, title] of [['/flow-category','Flow Category'],['/flow-name','Flow Name List'],['/flow-template','Flow Template'],['/work-flow','Work Flow List'],['/add-work-flow','Add Work Flow'],['/edit-work-flow?id=1','Edit Work Flow']]) {
    await navigate(path, title)
    const overflow = await evaluate("({ ok: document.documentElement.scrollWidth <= window.innerWidth, page: document.documentElement.scrollWidth, viewport: window.innerWidth })")
    assert.equal(overflow.ok, true, `${path} overflow: ${JSON.stringify(overflow)}`)
  }
  assert.deepEqual(exceptions, [])
  console.log('Workflow browser checks passed: six routes, modal/persistence/editor navigation, desktop/390px and no runtime exceptions')
} finally { socket?.close(); chrome.kill(); app.kill() }
