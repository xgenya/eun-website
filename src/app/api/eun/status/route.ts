import { NextResponse } from 'next/server'
import { fetchServerInfo } from 'minestat-es'
import { getStatus, getOnline, type ServerId } from '../../../../lib/eunBotApi'
import homeConfig from '../../../../../config/home'

export const dynamic = 'force-dynamic'

type Merged = {
  online: boolean
  players: number
  maxPlayers: number
  pingMs?: number
  version?: string
  motd?: string
  running?: boolean
  bridge?: boolean
  onlineList?: string[]
  filteredFake?: string[]
}

async function pingMinestat(host: string, port: number) {
  try {
    const r = await fetchServerInfo({ address: host, port, timeout: 5000, ping: true })
    return {
      online: r.online,
      players: r.players ?? 0,
      maxPlayers: r.maxPlayers ?? 0,
      pingMs: r.pingMs,
      version: r.version,
      motd: r.motd,
    }
  } catch {
    return { online: false, players: 0, maxPlayers: 0 }
  }
}

// GET /api/eun/status
//   无参: 返回首页所用聚合数据 { ok, <configId>: Merged, ... }
//   ?server=main|creative|test|mirror : 透传上游 /api/online
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const server = searchParams.get('server') as ServerId | null

  if (server) {
    return NextResponse.json(await getOnline(server))
  }

  const servers = homeConfig.servers
  // 并发：EUN 全服状态 + 每个服的 EUN online + 每个服的 minestat
  const [eunStatus, ...perServer] = await Promise.all([
    getStatus(),
    ...servers.flatMap((s) => [getOnline(s.eunId), pingMinestat(s.host, s.port)] as const),
  ])

  const statusData =
    (eunStatus.ok && (eunStatus.data as Record<string, { running?: boolean; bridge?: boolean }> | undefined)) || {}

  const out: Record<string, Merged> = {}
  servers.forEach((s, i) => {
    const eunOnline = perServer[i * 2] as { ok?: boolean; online?: string[]; filtered_fake?: string[] }
    const mine = perServer[i * 2 + 1] as Awaited<ReturnType<typeof pingMinestat>>
    const info = statusData[s.eunId] || {}
    const running = info.running === true
    const bridge = info.bridge === true
    const hasEunOnline = eunOnline && eunOnline.ok === true && Array.isArray(eunOnline.online)
    const filteredPlayers = hasEunOnline ? (eunOnline.online as string[]) : []

    out[s.id] = {
      online: running && bridge ? true : mine.online,
      players: hasEunOnline ? filteredPlayers.length : mine.players,
      maxPlayers: mine.maxPlayers,
      pingMs: mine.pingMs,
      version: mine.version,
      motd: mine.motd,
      running,
      bridge,
      onlineList: hasEunOnline ? filteredPlayers : undefined,
      filteredFake: hasEunOnline ? (eunOnline.filtered_fake as string[] | undefined) : undefined,
    }
  })

  const totalPlayers = Object.values(out).reduce((sum, s) => sum + s.players, 0)
  const anyOnline = Object.values(out).some((s) => s.online)

  return NextResponse.json({ ok: true, ...out, totalPlayers, anyOnline })
}
