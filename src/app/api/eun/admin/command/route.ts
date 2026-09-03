import { NextResponse } from 'next/server'
import { sendCommand, type ServerId } from '../../../../../lib/eunBotApi'
import { requireAdmin } from '../../_guard'

export const dynamic = 'force-dynamic'

// POST /api/eun/admin/command { server, command, timeout? }
export async function POST(request: Request) {
  const denied = requireAdmin(request)
  if (denied) return denied
  const body = await request.json().catch(() => ({}))
  const server = (body?.server ?? 'main') as ServerId
  const command = typeof body?.command === 'string' ? body.command : ''
  const timeout = typeof body?.timeout === 'number' ? body.timeout : 6
  if (!command) {
    return NextResponse.json({ ok: false, error: '缺少参数 command' }, { status: 400 })
  }
  const result = await sendCommand(server, command, timeout)
  return NextResponse.json(result)
}
