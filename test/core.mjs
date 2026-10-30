import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import vm from 'node:vm'
import { Modes, filterAssembly, filterDecision, CAPABILITY_CONTEXT } from '../core.mjs'

const temp = fs.mkdtempSync(path.join(os.tmpdir(),'chat-first-community-'))
try {
  const warnings=[], modes=new Modes(path.join(temp,'states'),e=>warnings.push(e.message))
  assert.equal(modes.get('a'),'discuss')
  modes.set('a','execute'); assert.equal(new Modes(modes.directory).get('a'),'execute')
  modes.set('b','discuss'); assert.equal(modes.get('a'),'execute')
  assert.throws(()=>modes.set('a','bad'))
  assert.throws(()=>modes.get(''))
  const escaped=modes.file('../../outside\\文件')
  assert.equal(path.dirname(escaped),modes.directory)
  fs.writeFileSync(modes.file('a'),'{broken')
  assert.equal(modes.get('a'),'discuss'); assert.equal(modes.get('a'),'discuss'); assert.equal(warnings.length,1)
  modes.set('a','execute'); assert.equal(modes.get('a'),'execute')
  const blocked=path.join(temp,'not-a-directory'); fs.writeFileSync(blocked,'existing')
  const bad=new Modes(path.join(blocked,'states'))
  assert.throws(()=>bad.set('a','execute')); assert.equal(bad.get('a'),'discuss')
  const assembly={tools:[{name:'shell'}],contexts:[{name:'other',text:'catalog'}],sections:[{name:'persona',text:'agent'}]}
  const discuss=filterAssembly(assembly,'discuss',1), execute=filterAssembly(assembly,'execute',2)
  assert.equal(discuss.tools.length,0)
  assert.deepEqual(discuss.contexts.map(c=>c.name),[CAPABILITY_CONTEXT])
  assert.match(discuss.contexts[0].text,/本轮工具数为 0/)
  assert.notEqual(discuss.contexts[0].text,filterAssembly(assembly,'discuss',2).contexts[0].text)
  assert.equal(execute.tools,assembly.tools); assert.equal(execute.contexts.length,2)
  assert.equal(assembly.contexts.length,1)
  const decision={kind:'enter',messages:[]}
  assert.equal(filterDecision(decision,'execute',{toolHistory:()=>({tools:[],updates:[]})}).startsRequestSeries,true)
  const patch=fs.readFileSync(new URL('../cordis.patch.yml',import.meta.url),'utf8')
  assert.match(patch,/id: chat-first\b/); assert.doesNotMatch(patch,/id: qa\b|@local\//)
  const conditions=[...patch.matchAll(/disabled: !!js (process\.platform [^\r\n]+)/g)].map(m=>m[1])
  assert.equal(conditions.length,2)
  for(const platform of ['win32','darwin','linux']) {
    assert.deepEqual(conditions.map(expr=>vm.runInNewContext(expr,{process:{platform}})),platform==='win32'?[true,false]:[false,true])
  }
  const manifest=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url)))
  assert.equal(manifest.private,undefined)
  assert.ok(!manifest.files.some(f=>/state|verified|log/.test(f) && f!=='storage.mjs'))
  console.log('PASS: state persistence/isolation, fail-closed corruption and write errors, path containment, current notices, native baseline marker, Windows/macOS/Linux tool conditions, independent identity.')
} finally {
  assert.ok(path.resolve(temp).startsWith(path.resolve(os.tmpdir())+path.sep))
  fs.rmSync(temp,{recursive:true,force:true})
}
