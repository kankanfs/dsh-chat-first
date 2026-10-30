// This small contract is also embedded in client.js; no browser build dependency.
export function contribution() {
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
