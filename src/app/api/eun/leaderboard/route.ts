import { NextResponse } from 'next/server'
import { getStatsTop, type StatsOrder } from '../../../../lib/eunBotApi'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type RawTopPlayer = {
  name: string
  uuid?: string
  rank?: number
  stats?: {
    playtime?: number | null
    mined?: number | null
    elytra?: number | null
    deaths?: number | null
    kills?: number | null
  }
}
export type PublicPlayerStats = {
  name: string
  uuid?: string
  playtime: number // 分钟（tick / 20 / 60）
  mined: number
  elytra: number // 米（cm / 100）
  deaths: number
  kills: number
}

function normalize(p: RawTopPlayer): PublicPlayerStats {
  const s = p.stats ?? {}
  return {
    name: p.name,
    uuid: p.uuid,
    playtime: Math.floor((s.playtime ?? 0) / 20 / 60),
    mined: s.mined ?? 0,
    elytra: Math.round((s.elytra ?? 0) / 100),
    deaths: s.deaths ?? 0,
    kills: s.kills ?? 0,
  }
}
type CacheEntry = {
  payload: { ok: true; players: PublicPlayerStats[]; cachedAt: string }
  expiresAt: number
}

// 内存缓存 5 分钟
const TTL_MS = 5 * 60 * 1000
const cache = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<CacheEntry['payload']>>()

const VALID_ORDER: StatsOrder[] = ['playtime', 'mined', 'elytra', 'deaths', 'kills']

async function fetchFresh(limit: number, order: StatsOrder): Promise<CacheEntry['payload']> {
  const r = await getStatsTop(limit, order)
  if (!r.ok) throw new Error(r.error || '上游返回 ok:false')
  const raw = (r.players as RawTopPlayer[] | undefined) ?? []
  return { ok: true, players: raw.map(normalize), cachedAt: new Date().toISOString() }
}

// GET /api/eun/leaderboard?limit=50&order=playtime
// 透传上游 /api/stats/top，做单位归一化 + 5 分钟内存缓存 + 请求去重
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10) || 50, 1), 100)
  const orderRaw = (searchParams.get('order') || 'playtime') as StatsOrder
  const order: StatsOrder = VALID_ORDER.includes(orderRaw) ? orderRaw : 'playtime'
  const force = searchParams.get('refresh') === '1'
  const key = `${order}:${limit}`
  const now = Date.now()

  const hit = cache.get(key)
  if (!force && hit && hit.expiresAt > now) {
    return NextResponse.json(hit.payload, { headers: { 'x-cache': 'HIT' } })
  }

  if (!inflight.has(key)) {
    const p = fetchFresh(limit, order)
      .then((payload) => {
        cache.set(key, { payload, expiresAt: Date.now() + TTL_MS })
        return payload
      })
      .finally(() => {
        inflight.delete(key)
      })
    inflight.set(key, p)
  }

  try {
    const payload = await inflight.get(key)!
    return NextResponse.json(payload, { headers: { 'x-cache': force ? 'BYPASS' : 'MISS' } })
  } catch (e) {
    if (hit) {
      return NextResponse.json(hit.payload, {
        headers: { 'x-cache': 'STALE', 'x-error': String(e) },
      })
    }
    return NextResponse.json({ ok: false, error: String(e) }, { status: 502 })
  }
}
