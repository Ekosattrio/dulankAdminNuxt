import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'
const root = fileURLToPath(new URL('..', import.meta.url)), cwd = await mkdtemp(join(tmpdir(), 'dulank-dashboard-api-'))
const probe = createServer(); await new Promise(done => probe.listen(0,'127.0.0.1',done)); const port=probe.address().port; await new Promise(done=>probe.close(done))
const child=spawn(process.execPath,[resolve(root,'.output/server/index.mjs')],{cwd,windowsHide:true,env:{...process.env,HOST:'127.0.0.1',PORT:String(port)},stdio:['ignore','pipe','pipe']}); let output=''; child.stdout.on('data',v=>output+=v); child.stderr.on('data',v=>output+=v); const base=`http://127.0.0.1:${port}`
async function get(path,status=200){const response=await fetch(`${base}${path}`); const text=await response.text(); assert.equal(response.status,status,text); return JSON.parse(text)}
try { let ready=false; for(let i=0;i<100;i++){try{ready=(await fetch(`${base}/api/analytics-dashboard`)).ok}catch{};if(ready)break;if(child.exitCode!==null)throw new Error(output);await delay(100)}; assert.ok(ready,output)
  const admin=await get('/api/admin-dashboard'); assert.equal(admin.success,true); assert.equal(admin.data.primaryMetrics.length,4); assert.equal(admin.data.transactionGroups.length,5); assert.equal(admin.data.transactionGroups[0].rows.length,5); assert.ok(admin.data.primaryMetrics.every(item=>Number.isFinite(item.amount)))
  const result=await get('/api/analytics-dashboard'); assert.equal(result.success,true); assert.equal(result.data.kpis.length,4); assert.equal(result.data.performance.ALL.pageViews.length,12); assert.ok(result.data.topPages.every(item=>Number.isFinite(item.views)))
  await mkdir(join(cwd,'data'),{recursive:true}); await writeFile(join(cwd,'data','admin-dashboard.json'),'{','utf8'); await get('/api/admin-dashboard',500)
  await writeFile(join(cwd,'data','analytics-dashboard.json'),'{','utf8'); await get('/api/analytics-dashboard',500)
  console.log('Dashboard API checks passed: typed Admin/Analytics snapshots and malformed-data safeguards')
} finally { child.kill() }
