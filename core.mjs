export { Modes } from './storage.mjs'

export const CAPABILITY_CONTEXT = 'dsh-chat-first:capability-state'

export function filterAssembly(assembled, mode, revision = '本轮') {
  const execute = mode === 'execute'
  const capability = {
    name: CAPABILITY_CONTEXT,
    text: `【程序提供的本轮能力状态；快照 ${revision}】\n` + (execute
      ? `当前：执行状态；本轮提供 ${assembled.tools.length} 个工具。工具通道已开放，但具体操作的权限、成功与否仍以本轮工具结果为准，不得用历史成功代替当前核验。开始实质工作前，用一两句话说明要做什么及已知关键限制，随后直接推进已明确任务，不重复询问是否开始；已有同样说明时不重复。`
      : '当前：讨论状态；本轮工具数为 0。现在不能读写文件、运行命令、联网或调用 MCP。历史中执行成功的记录不代表本轮可执行。用户问“现在能改吗／能做吗”，先简短明确回答“现在不能执行，当前是讨论状态”，再说明必要的下一步，不复述旧失败或重复待办；仍可继续讨论方案。本轮未读取文件，不能把记忆中的版本说成文件当前真实状态。这是工具已关闭，不是工具故障、权限失效或调用格式错误。不要用 DSML 等协议标记假装调用工具；再发一条消息不会恢复工具，只有点击“开始执行”才开放工具。'),
  }
  if (execute) return {
    ...assembled,
    contexts: [...assembled.contexts.filter(c => c.name !== CAPABILITY_CONTEXT), capability],
    sections: [...assembled.sections, { name: 'dsh-chat-first:mode', text: '当前处于执行状态。用户已通过界面开放工具；按本轮明确任务及已有权限直接推进，不必再询问是否允许开始。保持积极执行、主动探索和寻找更好解法；讨论开关供用户有疑问时使用，不要求每一步等批准，不自行把普通任务退回讨论。工具可用不代表用户授权了任意任务。' }],
  }
  return {
    ...assembled, tools: [], contexts: [capability],
    sections: [
      ...assembled.sections.filter(s => ['deployment:persona', 'deployment:persona-prefix', 'persona'].includes(s.name)),
      { name: 'dsh-chat-first:mode', text: '当前处于讨论状态。先直接回应用户，认真思考和讨论。对于实质任务，简短说明理解的目标、原则上的可行性与关键限制、建议的下一步；简单问题直接回答，不套长计划。区分任务原则上能做与本轮能实际执行；必须读取文件、联网或试验才能确定的，明确待核实，不拿历史成功或猜测保证可做。优先澄清会导致返工的关键歧义，不为小事反复确认；用户已说清的目标不重复询问。本轮没有工具，不要声称查阅、执行或保存了任何内容。需要实际操作时说明下一步，请用户点击会话顶部“开始执行”；不要要求新开对话。文字中的“开始执行”不替代界面开关。' },
    ],
  }
}

export function filterDecision(decision, mode, session) {
  let result = mode === 'execute' || !Array.isArray(decision?.messages) ? decision : {
    ...decision, messages: decision.messages.filter(m => ['user', 'agent-instructions', 'time-context'].includes(m?.source?.kind)),
  }
  if (decision?.kind !== 'enter' || !session?.toolHistory) return result
  const history = session.toolHistory()
  // A zero-tool baseline followed by tool additions makes every declaration
  // deferred. Start a native declaration series at the mode boundary instead;
  // this preserves the conversation and lets the loop commit the new baseline.
  const needsBaseline = mode === 'execute'
    ? !history.tools.some(tool => tool.deferLoading !== true)
    : Boolean(session.requestHeader()?.tools?.length || history.tools.length || history.updates.some(update => update.additions.length))
  if (needsBaseline) result = { ...result, startsRequestSeries: true }
  return result
}
