// EUN Bot API 客户端（服务端专用，切勿在浏览器中导入）
// 目标地址与鉴权约束参见项目根 "网站调用示例" README。
// Token 存放在环境变量 EUN_BOT_TOKEN，可在项目根 .env.local 中维护。

const API_BASE = process.env.EUN_API_BASE

function getBase(): string {
  if (!API_BASE) throw new Error('缺少环境变量 EUN_API_BASE')
  return API_BASE
}

export type ServerId = 'main' | 'creative' | 'test' | 'mirror' | 'vc'
export type SwitchAction = 'on' | 'off'
export type UnifiedAction = 'start' | 'stop' | 'restart' | 'cancel'

export interface EunResponse<T = unknown> {
  ok: boolean
  error?: string
  data?: T
  [key: string]: unknown
}

function getToken(): string {
  const t = process.env.EUN_BOT_TOKEN
  if (!t) throw new Error('缺少环境变量 EUN_BOT_TOKEN')
  return t
}

async function call<T = unknown>(path: string, body?: unknown): Promise<EunResponse<T>> {
  let token: string
  try {
    token = getToken()
  } catch (e) {
    return { ok: false, error: String(e) }
  }
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  }
  const init: RequestInit = {
    method: body === undefined ? 'GET' : 'POST',
    headers,
    cache: 'no-store',
  }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(body)
  }
  try {
    const res = await fetch(getBase() + path, init)
    let json: EunResponse<T>
    try {
      json = (await res.json()) as EunResponse<T>
    } catch {
      return { ok: false, error: `HTTP ${res.status} 非 JSON 响应` }
    }
    if (!res.ok && json.ok === undefined) {
      return { ok: false, error: `HTTP ${res.status}` }
    }
    return json
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

// ---- 只读查询 ----
export const getHealth = () => call('/api/health')
export const getServers = () => call('/api/servers')
export const getStatus = () => call('/api/status')
export const getOnline = (server: ServerId = 'main') =>
  call(`/api/online?server=${encodeURIComponent(server)}`)
export const getPlayerInfo = (name: string) =>
  call(`/api/player-info?name=${encodeURIComponent(name)}`)
export const getSparkState = () => call('/api/spark/state')

export type StatsOrder = 'playtime' | 'mined' | 'elytra' | 'deaths' | 'kills'
export const getStatsTop = (limit = 50, order: StatsOrder = 'playtime') =>
  call(`/api/stats/top?limit=${limit}&order=${order}`)

// ---- 管理动作 ----
export const restartServer = (server: ServerId, seconds = 60) =>
  call('/api/restart', { server, seconds })
export const switchServer = (server: ServerId, action: SwitchAction) =>
  call('/api/switch', { server, action })
export const actionServer = (server: ServerId, action: UnifiedAction, seconds = 60) =>
  call('/api/action', { server, action, seconds })
export const sendCommand = (server: ServerId, command: string, timeout = 6) =>
  call('/api/command', { server, command, timeout })

// ---- spark ----
export const sparkSample = (seconds = 10) =>
  call('/api/spark/sample', { server: 'main', seconds })
export const sparkAnalyze = (url: string) => call('/api/spark/analyze', { url })

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** 触发一次 spark 采样并轮询至完成；主要给后端脚本用。 */
export async function sparkSampleAndWait(seconds = 10, pollMs = 5000, timeoutMs = 120_000) {
  const start = Date.now()
  const trigger = await sparkSample(seconds)
  if (!trigger.ok) return trigger
  while (true) {
    await sleep(pollMs)
    const st = await getSparkState()
    if (!st.ok) return st
    const data = st.data as { running?: boolean } | undefined
    if (data && data.running === false) return st
    if (Date.now() - start > timeoutMs) return { ok: false, error: 'spark 轮询超时' }
  }
}
