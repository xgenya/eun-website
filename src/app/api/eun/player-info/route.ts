import { NextResponse } from 'next/server'
import { getPlayerInfo } from '../../../../lib/eunBotApi'

export const dynamic = 'force-dynamic'

// GET /api/eun/player-info?name=<player>
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = (searchParams.get('name') || '').trim()
  if (!name) {
    return NextResponse.json({ ok: false, error: '缺少参数 name' }, { status: 400 })
  }
  const result = await getPlayerInfo(name)
  return NextResponse.json(result)
}
