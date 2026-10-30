import path from 'node:path'
import { Modes, filterAssembly, filterDecision } from './core.mjs'
import { contribution } from './remote-contract.mjs'

import { loadHostPackage } from './runtime.mjs'
const protocol = await loadHostPackage('@deepseek-ai/dsh-typert-protocol')
const { resolveDshHome } = await loadHostPackage('@deepseek-ai/dsh-home-paths')
const { Remote, TypertRemoteService } = protocol

// Use the public decorator initializer API from plain JS, with no build dependency.
const initializers = []
export default class ChatFirst extends TypertRemoteService {
  static inject = ['agents', 'sessionProjections', 'systemPrompt', 'tools', 'typert']
  constructor(ctx) {
    super(ctx, 'chatFirstMode')
    for (const init of initializers) init.call(this)
    ctx.effect(() => ctx.typert.remotes.register(contribution()), 'chat-first: remote contract')
    this.modes = new Modes(path.join(resolveDshHome(), 'plugins', 'dsh-chat-first', 'sessions'), error => ctx.logger.warn('chat-first state unavailable: %s', error.message))
    const subject = agent => {
      const seen = new Set()
      while (agent?.session && !seen.has(agent)) {
        seen.add(agent)
        if (ctx.sessionProjections.stateOf(agent.session, 'agentPreset') === 'chat-first') return agent
        agent = agent.parentAgent
      }
      return null
    }
    this.subject = subject
    ctx.on('system-prompt/assemble', async (assembly, context, next) => {
      const result = await next()
      const agent = subject(context.agent || context.scope)
      return agent ? filterAssembly(result, this.modes.get(agent.id), (context.agent || context.scope).session.seq) : result
    }, { prepend: true })
    ctx.on('agent/pre-step', async (payload, next) => {
      const result = await next()
      const agent = subject(payload.agent)
      return agent && result?.kind === 'enter' ? filterDecision(result, this.modes.get(agent.id), payload.agent.session) : result
    }, { prepend: true })
    // Both gates are intentional: a call admitted before a toggle must not bypass dispatch.
    ctx.on('tools/pre-execute', (exec, next) => {
      const agent = subject(exec.agent)
      return agent && this.modes.get(agent.id) !== 'execute'
        ? { kind: 'deny', reason: '讨论状态禁止工具调用，请点击会话顶部“开始执行”。' } : next()
    }, { prepend: true })
    ctx.on('tools/execute', (exec, next) => {
      const agent = subject(exec.agent)
      if (agent && this.modes.get(agent.id) !== 'execute') throw new Error('讨论状态禁止工具执行')
      return next()
    }, { prepend: true })
  }
  get(sessionId) {
    if (typeof sessionId !== 'string') throw new Error('会话编号无效')
    const agent = this.ctx.agents.get(sessionId)
    return { available: Boolean(agent && this.subject(agent) === agent), mode: this.modes.get(sessionId), running: agent?.status === 'running' }
  }
  set(sessionId, mode) {
    const agent = this.ctx.agents.get(sessionId)
    if (!agent || this.subject(agent) !== agent) throw new Error('只支持先聊后做主会话；请先打开对应会话')
    if (agent.status === 'running') throw new Error('请先停止当前一轮，再切换讨论或执行状态')
    this.modes.set(sessionId, mode)
    this.ctx.emit('tools/change')
    return this.get(sessionId)
  }
}
for (const name of ['get', 'set']) Remote(name)(ChatFirst.prototype[name], {
  kind: 'method', name, static: false, private: false,
  addInitializer: init => initializers.push(init),
})
