// An isolated real DSH web host. No user profile or credentials are copied.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
const root = fs.mkdtempSync(path.join(os.tmpdir(),'dsh-chat-first-host-'))
const profile = path.join(root,'profiles','chat-first-check')
const packageDir = fileURLToPath(new URL('..',import.meta.url))
fs.mkdirSync(path.join(profile,'node_modules'),{recursive:true})
fs.symlinkSync(packageDir,path.join(profile,'node_modules','dsh-chat-first'),process.platform==='win32'?'junction':'dir')
fs.writeFileSync(path.join(profile,'package.json'),JSON.stringify({name:'chat-first-isolated-check',private:true,type:'module',dependencies:{'dsh-chat-first':`link:${packageDir}`},dsh:{profile:{bundles:['@deepseek-ai/dsh-base','@deepseek-ai/dsh-web-app','dsh-chat-first']}}}))
const runtimeUrl=pathToFileURL(path.join(packageDir,'runtime.mjs')).href
fs.writeFileSync(path.join(profile,'test-seed.mjs'), `import {loadHostPackage} from ${JSON.stringify(runtimeUrl)}; export const inject=['agents','agentPresets']; export async function apply(ctx) { const {createUserMessage}=await loadHostPackage('@deepseek-ai/dsh-llm'); const handle=await ctx.agents.create({sessionId:'chat-first-ui-check',meta:{cwd:${JSON.stringify(packageDir)}}}); await ctx.agentPresets.select(handle.agent,'chat-first'); handle.agent.session.append('turn/start',{turn:1}); handle.agent.session.append('user/message',createUserMessage({source:{kind:'user'},content:[{type:'text',text:'Local interface fixture. No model request or tool call was made.'}]}),{surfaceOp:'append'}); handle.agent.session.append('turn/end',{turn:1,reason:{kind:'completed'}}); }`)
fs.writeFileSync(path.join(profile,'cordis.patch.yml'), '- insert:\n    - id: local-test-seed\n      name: ./test-seed.mjs\n')
process.env.DSH_HOME=root
fs.writeFileSync(new URL('../validation-boot.json',import.meta.url),JSON.stringify({home:root,pid:process.pid,profile:'chat-first-check'}))
const bin = path.join(process.resourcesPath,'app.asar','dsh','node_modules','@deepseek-ai','dsh','lib','bin.js')
process.argv=[process.execPath,bin,'--profile','chat-first-check','--port','0','--no-open']
const { runCli } = await import(pathToFileURL(bin).href)
await runCli()
