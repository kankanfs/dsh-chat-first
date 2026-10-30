// Run in the installed Electron's Node mode. No live credentials or network.
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import assert from 'node:assert/strict'
import { filterDecision, Modes } from '../core.mjs'

const output = new URL('../validation-native.json', import.meta.url)
async function main() {
  const req = createRequire(process.resourcesPath + '/app.asar/dsh/node_modules/@deepseek-ai/dsh-llm/lib/index.js')
  const load = name => import(pathToFileURL(req.resolve('@deepseek-ai/' + name)).href)
  const installed = JSON.parse(fs.readFileSync(path.join(path.dirname(req.resolve('@deepseek-ai/dsh-typert-protocol')),'..','package.json'),'utf8')).version
  assert.equal(installed,'0.2.1-rc.5','validate the native protocol version before claiming compatibility')
  const [{ Session, canonicalHeader }, llm, { DeepSeekAdapter, resolveAdapterOptions }, { Context }, { default: Registry }, { default: Controller }, prompt] = await Promise.all([
    load('dsh-session'), load('dsh-llm'), load('dsh-llm-deepseek'), load('cordis'), load('dsh-typert-registry'), import('../index.mjs'), load('dsh-system-prompt'),
  ])
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'chat-first-request-'))
  const originalFetch = globalThis.fetch
  const records = []
  let ctx
  try {
    const session = new Session('chat-first-request-probe')
    const config = { provider: 'probe', model: 'probe-model' }
    const tools = [
      { name: 'pwsh', description: 'probe shell schema', parameters: { type: 'object', properties: {} } },
      { name: 'mcp_probe', description: 'probe deferred schema', parameters: { type: 'object', properties: {} }, deferLoading: true },
    ]
    const header = active => canonicalHeader({ config, ...(active.length ? { tools: active } : {}) })
    session.append('request/header', { header: header([]), reason: 'initial' })
    const added = session.append('request/header', { header: header(tools), reason: 'change' })
    const additions = llm.createDeveloperMessage({ source: { kind: 'tool-registry' }, content: tools.map(t => ({ type: 'tool-addition', toolName: t.name })) })
    session.append('developer/message', { turn: 1, step: 0, headerSeq: added.seq, message: additions }, { surfaceOp: 'append' })
    const user = llm.createUserMessage({ source: { kind: 'user' }, content: [{ type: 'text', text: 'probe' }] })
    const messages = [user, additions]
    const connection = resolveAdapterOptions({ baseURL: 'http://127.0.0.1:1', thinking: 'disabled', maxTokens: 32, models: [{ id: config.model, inputModalities: ['text'] }] })
    const adapter = new DeepSeekAdapter({
      options: () => connection, resolveFiles: () => ({}), resolveAuth: async () => ({ headers: {} }),
      resolveUserId: () => 'local-test', prepareExtensions: async () => ({ fields: {}, accept: async () => {} }),
    })
    const events = [
      { type: 'message_start', message: { id: 'msg-probe', type: 'message', role: 'assistant', model: config.model, content: [], usage: { input_tokens: 1, output_tokens: 0 } } },
      { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
      { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'ok' } },
      { type: 'content_block_stop', index: 0 },
      { type: 'message_delta', delta: { stop_reason: 'end_turn', stop_sequence: null }, usage: { output_tokens: 1 } },
      { type: 'message_stop' },
    ]
    globalThis.fetch = async (_url, init) => {
      const wire = JSON.parse(init.body)
      const allDeferred = wire.tools?.length > 0 && wire.tools.every(t => t.defer_loading === true)
      records.push({ toolCount: wire.tools?.length ?? 0, immediate: wire.tools?.filter(t => t.defer_loading !== true).length ?? 0, rejected: Boolean(allDeferred), currentStateAtEnd: JSON.stringify(wire.messages.at(-1)).includes('程序提供的本轮能力状态') })
      return allDeferred
        ? new Response(JSON.stringify({ error: { type: 'invalid_request_error', message: 'tools: at least one tool must have defer_loading=false. All tools cannot be deferred.' } }), { status: 400 })
        : new Response(events.map(e => `event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join(''), { status: 200, headers: { 'content-type': 'text/event-stream' } })
    }
    async function send(mode, active, notice) {
      const projected = llm.projectToolUpdates(notice ? [...messages, notice] : messages, active, mode, session.toolHistory())
      const chunks = []
      for await (const chunk of adapter.stream({ ...config, ...projected, signal: new AbortController().signal })) chunks.push(chunk)
      assert.equal(chunks.at(-1)?.type, 'finish')
      assert.equal(chunks.at(-1).reason.kind, 'stop')
      if (notice) assert.equal(records.at(-1).currentStateAtEnd, true, 'current state must reach the final serialized request')
    }
    // First reproduce the user's exact error through the installed serializer.
    await assert.rejects(send('in-history', tools), /All tools cannot be deferred/)
    assert.equal(records.at(-1).rejected, true)

    ctx = new Context()
    await ctx.plugin(Registry)
    await ctx.plugin(prompt.SystemPrompt, {})
    ctx.systemPrompt.tools(() => ({ schemas: tools }))
    const agent = { id: session.id, session, status: 'idle' }
    ctx.provide('agents', new Map([[agent.id, agent]]))
    ctx.provide('sessionProjections', { stateOf: s => s === session ? 'chat-first' : 'standard' })
    const controller = new Controller(ctx)
    controller.modes = new Modes(path.join(temp, 'states'))
    const normal = { id:'normal', session:new Session('normal-probe'), status:'idle' }
    const child = { id:'child', session:new Session('child-probe'), parentAgent:agent, status:'idle' }
    ctx.agents.set(normal.id,normal)
    assert.equal(controller.get(normal.id).available,false)
    const admitted = who => ctx.waterfall('tools/pre-execute', {agent:who}, () => ({kind:'allow'}))
    assert.equal((await admitted(agent)).kind,'deny')
    assert.equal((await admitted(normal)).kind,'allow')
    assert.equal((await admitted(child)).kind,'deny')
    await assert.rejects(Promise.resolve().then(() => ctx.waterfall('tools/execute',{agent},()=>true)))
    agent.status='running'
    assert.throws(()=>controller.set(agent.id,'execute'))
    agent.status='idle'
    let previousNotice
    for (const mode of ['execute', 'execute', 'discuss', 'discuss', 'execute']) {
      controller.set(agent.id, mode)
      assert.equal((await admitted(agent)).kind, mode === 'execute' ? 'allow' : 'deny')
      assert.equal((await admitted(child)).kind, mode === 'execute' ? 'allow' : 'deny')
      const assembly = await ctx.systemPrompt.assemble({ agent })
      const sections = prompt.renderContextSections(ctx.systemPrompt.refreshContext(assembly, { agent }))
      const snapshot = prompt.joinContextSections(sections)
      assert.match(snapshot, /程序提供的本轮能力状态/)
      assert.notEqual(snapshot, previousNotice, 'each admitted request gets a fresh state snapshot')
      previousNotice = snapshot
      assert.match(snapshot, mode === 'execute' ? /本轮提供 2 个工具/ : /现在不能执行/)
      const notice = llm.createUserMessage({ source: { kind: 'runtime-context', form: 'snapshot', sections }, content: [{ type: 'text', text: snapshot }] })
      const decision = await ctx.waterfall('agent/pre-step', { agent }, async () => ({ kind: 'enter', messages: [user] }))
      assert.equal(decision.startsRequestSeries === true, mode !== (records.at(-1).mode ?? 'broken'))
      const active = mode === 'execute' ? tools : []
      session.append('request/header', { header: header(active), reason: decision.startsRequestSeries ? 'series' : 'change', ...(decision.startsRequestSeries ? { startsSeries: true } : {}) })
      const seq = session.seq
      await send('in-history', active, notice)
      await send('addition-only', active, notice)
      assert.equal(session.seq, seq, 'provider projection must not rewrite the session')
      assert.equal(records.at(-1).toolCount, active.length)
      records.at(-1).mode = mode
      if (mode === 'execute') assert.ok(records.at(-1).immediate > 0)
    }
    assert.equal(session.snapshotEvents()[0].data.reason, 'initial')
    assert.equal(session.snapshotEvents().filter(e => e.type === 'developer/message').length, 1, 'old history preserved')
    fs.writeFileSync(output, JSON.stringify({ passed: true, installed, network: false, reproducedOriginalFailure: true, records }, null, 2))
  } finally {
    globalThis.fetch = originalFetch
    await ctx?.scope?.dispose?.()
    fs.rmSync(temp, { recursive: true, force: true })
  }
}
main().catch(error => { fs.writeFileSync(output, JSON.stringify({ passed: false, error: error.stack }, null, 2)); process.exitCode = 1 })
