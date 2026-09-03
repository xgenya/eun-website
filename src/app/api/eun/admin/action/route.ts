import { NextResponse } from 'next/server'
import { actionServer, type ServerId, type UnifiedAction } from '../../../../../lib/eunBotApi'
import { requireAdmin } from '../../_guard'

export const dynamic = 'force-dynamic'

const VALID: UnifiedAction[] = ['start', 'stop', 'restart', 'cancel']

// POST /api/eun/admin/action { server, action, seconds? }
export async function POST(request: Request) {
  const denied = requireAdmin(request)
  if (denied) return denied
  const body = await request.json().catch(() => ({}))
  const server = (body?.server ?? 'main') as ServerId
  const action = body?.action as UnifiedAction
  const seconds = typeof body?.seconds === 'number' ? body.seconds : 60
  if (!VALID.includes(action)) {
    return NextResponse.json(
      { ok: false, error: `action 必须为 ${VALID.join('|')}` },
      { status: 400 },
    )
  }
  const result = await actionServer(server, action, seconds)
  return NextResponse.json(result)
}
