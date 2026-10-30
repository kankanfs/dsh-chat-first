window.__ModuleLoader__.load({
  id: 'dsh-chat-first',
  factory: require => {
    const React = require('react')
    const zh = navigator.language.toLowerCase().startsWith('zh')
    const label = (cn,en) => zh ? cn : en
// This small contract is also embedded in client.js; no browser build dependency.
function contribution() {
  const string = { mode:'strict', typeSymbol:'ChatFirstString', schema:{ parse(x) {
    if (typeof x !== 'string' || !x || x.length > 200) throw new Error('会话编号无效')
    return x
  } } }
  const mode = { mode:'strict', typeSymbol:'ChatFirstMode', schema:{ parse(x) {
    if (x !== 'discuss' && x !== 'execute') throw new Error('模式无效')
    return x
  } } }
  const result = { mode:'strict', typeSymbol:'ChatFirstState', schema:{ parse(x) {
    if (!x || typeof x.available !== 'boolean' || typeof x.running !== 'boolean') throw new Error('模式状态格式无效')
    mode.schema.parse(x.mode)
    return x
  } } }
  // The installed rc.5 registry consumes factories; newer runtimes read schema.
  for (const codec of [string, mode, result]) codec.create = () => codec.schema
  return {package:'dsh-chat-first', descriptors:['get','set'].map(method => ({
    id:`dsh-chat-first#chatFirstMode/${method}`,service:'chatFirstMode',namespace:'chatFirstMode',method,
    invocation:{kind:'direct'},
    parameters:[{name:'sessionId',wire:'sessionId',source:'json',codec:string}, ...(method === 'set' ? [{name:'mode',wire:'mode',source:'json',codec:mode}] : [])],
    result,
  }))}
}

    function Control({ sessionId, read, change }) {
      const [state, update] = React.useState(null), [busy, working] = React.useState(false), [error, fail] = React.useState('')
      const generation = React.useRef(0)
      React.useEffect(() => {
        const current = ++generation.current
        let live = true
        update(null); fail(''); working(false)
        const poll = async () => {
          try {
            const r = await read(sessionId)
            if (!live || current !== generation.current) return
            if (r.ok) { update(r.value); fail('') }
            else fail(r.error?.message || '模式状态读取失败')
          } catch (e) { if (live && current === generation.current) fail(e.message) }
        }
        poll(); const timer = setInterval(poll, 1500)
        return () => { live = false; clearInterval(timer) }
      }, [sessionId, read])
      if (!state?.available) return error ? React.createElement('span', {role:'status'}, `先聊后做：${error}`) : null
      const execute = state.mode === 'execute'
      return React.createElement('div', {style:{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',fontSize:13}},
        React.createElement('span', {role:'status'}, execute ? label('执行模式 · 工具已开放','Working · Tools available') : label('讨论模式 · 工具已关闭','Discussing · Tools unavailable')),
        React.createElement('button', {
          type:'button', disabled:busy || state.running,
          title:state.running ? label('请先停止当前一轮，再切换状态','Stop the current turn before switching') : label('只切换工具状态，不会自动发送消息或启动任务','Changes tool availability; does not send or start a task'),
          style:{padding:'4px 10px',border:'1px solid currentColor',borderRadius:6,cursor:'pointer',font:'inherit'},
          onClick:async () => {
            const current = generation.current; working(true); fail('')
            try {
              const r = await change(sessionId, execute ? 'discuss' : 'execute')
              if (current !== generation.current) return
              if (r.ok) update(r.value); else fail(r.error?.message || '切换失败')
            } catch (e) { if (current === generation.current) fail(e.message) }
            finally { if (current === generation.current) working(false) }
          },
        }, busy ? label('切换中…','Switching…') : execute ? label('继续讨论','Discuss again') : label('开始执行','Start working')),
        state.running && React.createElement('span', null, label('本轮运行中，先停止再切换','Stop the current turn before switching')),
        error && React.createElement('span', {role:'alert'}, error),
      )
    }
    return { inject:['slots','remote'], async apply(ctx) {
      try {
      const unmount = await ctx.remote.$mount(contribution())
      ctx.effect(() => unmount, 'chat-first: remote client methods')
      const api = ctx.get('remote.chatFirstMode')
      const read = id => api.get(id), change = (id, mode) => api.set(id, mode)
      ctx.effect(() => ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
        name:'conversation.session.header.actions', id:'dsh-chat-first-toggle', order:0,
        inject:() => ({read, change}),
      }, Control)), 'chat-first: session mode toggle')
      } catch (error) {
        console.error('chat-first initialization:', error)
        throw error
      }
    } }
  },
})
