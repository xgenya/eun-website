import { NextResponse } from 'next/server'
import { switchServer, type ServerId, type SwitchAction } from '../../../../../lib/eunBotApi'
import { requireAdmin } from '../../_guard'

export const dynamic = 'force-dynamic'

// POST /api/eun/admin/switch { server, action: 'on' | 'off' }
export async function POST(request: Request) {
  const denied = requireAdmin(request)
  if (denied) return denied
  const body = await request.json().catch(() => ({}))
  const server = (body?.server ?? 'main') as ServerId
  const action = body?.action as SwitchAction
  if (action !== 'on' && action !== 'off') {
    return NextResponse.json({ ok: false, error: "action 必须为 'on' 或 'off'" }, { status: 400 })
  }
  const result = await switchServer(server, action)
  return NextResponse.json(result)
}
