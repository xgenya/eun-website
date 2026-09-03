import { NextResponse } from 'next/server'
import { getStatus, getOnline, type ServerId } from '../../../../lib/eunBotApi'

export const dynamic = 'force-dynamic'

// GET /api/eun/status
//   无参数: 返回 /api/status + 主服在线玩家
//   ?server=main|creative|test|mirror : 仅返回指定服的 /api/online
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const server = searchParams.get('server') as ServerId | null

  if (server) {
    const online = await getOnline(server)
    return NextResponse.json(online)
  }

  const [status, online] = await Promise.all([getStatus(), getOnline('main')])
  return NextResponse.json({ ok: true, status, online })
}
