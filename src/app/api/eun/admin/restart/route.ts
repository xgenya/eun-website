import { NextResponse } from 'next/server'
import { restartServer, type ServerId } from '../../../../../lib/eunBotApi'
import { requireAdmin } from '../../_guard'

export const dynamic = 'force-dynamic'

// POST /api/eun/admin/restart { server, seconds? }
export async function POST(request: Request) {
  const denied = requireAdmin(request)
  if (denied) return denied
  const body = await request.json().catch(() => ({}))
  const server = (body?.server ?? 'main') as ServerId
  const seconds = typeof body?.seconds === 'number' ? body.seconds : 60
  const result = await restartServer(server, seconds)
  return NextResponse.json(result)
}
