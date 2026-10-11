import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'

const root=fileURLToPath(new URL('..',import.meta.url)),cwd=await mkdtemp(join(tmpdir(),'dulank-calculator-dashboard-api-'))
const probe=createServer();await new Promise(done=>probe.listen(0,'127.0.0.1',done));const port=probe.address().port;await new Promise(done=>probe.close(done))
const child=spawn(process.execPath,[resolve(root,'.output/server/index.mjs')],{cwd,windowsHide:true,env:{...process.env,HOST:'127.0.0.1',PORT:String(port)},stdio:['ignore','pipe','pipe']});let output='';child.stdout.on('data',value=>output+=value);child.stderr.on('data',value=>output+=value);const base=`http://127.0.0.1:${port}`
async function request(path,options={},status=200){const response=await fetch(`${base}${path}`,{...options,headers:options.body?{'content-type':'application/json'}:undefined});const body=await response.text();assert.equal(response.status,status,body);return JSON.parse(body)}
try{
  let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch(`${base}/api/calculator/dashboard`)).ok}catch{}if(ready)break;if(child.exitCode!==null)throw new Error(output);await delay(100)}assert.ok(ready,output)
  const initial=await request('/api/calculator/dashboard');assert.equal(initial.success,true);assert.equal(initial.data.users.length,10);assert.deepEqual(initial.data.users.map(item=>item.user),['Bambang Prakoso','Citra Dewi','Dian Permata','Fajar Hidayat','Gita Ramadhani','Hadi Wijaya','Indah Sari','Joko Susilo','Kartika Chandra','Lukman Hakim']);assert.deepEqual(initial.data.telemetry.chart.thisWeek,[0,100,0,0,1000,0,0]);assert.ok(initial.data.users.every(item=>item.userId&&item.employeeId&&item.departmentId&&item.createdAt))
  const updated=await request('/api/calculator/dashboard/1',{method:'PUT',body:JSON.stringify({calculate:1300,usage:90,status:'Disabled'})});assert.equal(updated.data.calculate,1300);assert.equal(updated.data.usage,90);assert.equal(updated.data.status,'Disabled');assert.equal((await request('/api/calculator/dashboard')).data.users[0].calculate,1300)
  await request('/api/calculator/dashboard/1',{method:'PUT',body:JSON.stringify({usage:101})},400);await request('/api/calculator/dashboard/999',{method:'PUT',body:JSON.stringify({usage:10})},404)
  await request('/api/calculator/dashboard/10',{method:'DELETE'});assert.equal((await request('/api/calculator/dashboard')).data.users.length,9);await request('/api/calculator/dashboard/10',{method:'DELETE'},404)
  await mkdir(join(cwd,'data'),{recursive:true});await writeFile(join(cwd,'data','calculator-dashboard.json'),'{','utf8');await request('/api/calculator/dashboard',{},500)
  console.log('Calculator Dashboard API checks passed: exact legacy snapshot, typed relations, update/delete persistence, validation, 404, and malformed-data safeguard')
}finally{child.kill()}
